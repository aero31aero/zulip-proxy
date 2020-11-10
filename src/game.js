const websocket = require('./websocket');

const user_map = new Map();
const game_map = new Map();

function make_game(owner_id, seq) {
    const game = {
        events: [],
        players: [],
    };

    function game_id() {
        return `${owner_id}-${seq}`;
    }

    function handle_events(message, user_id) {
        const num_players = 2;

        if (game.players.length >= num_players) {
            if (!game.players.includes(user_id)) {
                console.warn(`${user_id} is too late for this game`);
                return;
            }
        } else {
            game.players.push(user_id);
        }

        const event = {
            message: message,
            user_id: user_id,
            type: 'game',
            game_type: 'tictactoe',
        };

        game.events.push(event);

        websocket.clients.forEach((client) => {
            console.info(
                `sending game event to user ${client.user_id} (id ${client.id})`
            );
            client.ws.send(JSON.stringify(event));
        });
    }

    function start_event() {
        // TODO: pull game_id up out of message
        const message = {
            type: 'start_game',
            game_id: game_id(),
        };

        return {
            message: message,
            user_id: owner_id,
            type: 'game',
            game_type: 'tictactoe',
        };
    }

    function events() {
        return game.events;
    }

    return {
        game_id,
        handle_events,
        events,
        start_event,
    };
}

function make_user(user_id) {
    let game_seq = 0;

    function add_game() {
        game_seq += 1;
        const game = make_game(user_id, game_seq);
        game_map.set(game.game_id(), game);

        websocket.clients.forEach((client) => {
            client.ws.send(JSON.stringify(game.start_event()));
        });
    }

    return {
        add_game,
    };
}

exports.get_user_data = (user_id) => {
    if (!user_map.get(user_id)) {
        console.info(`make game user for ${user_id}`);
        const game_user = make_user(user_id);
        user_map.set(user_id, game_user);
        game_user.add_game();
    }

    const result = {};

    for (const [game_id, game] of game_map) {
        result[game_id] = {
            events: game.events(),
        };
    }

    return result;
};

exports.handle_message = (client, payload) => {
    const message = JSON.parse(payload);

    const game_id = message.game_id;

    const user_id = client.user_id;

    const game = game_map.get(game_id);

    if (!game) {
        console.warn(`client sent bad game id ${game_id}`);
        return;
    }

    game.handle_events(message, user_id);
};
