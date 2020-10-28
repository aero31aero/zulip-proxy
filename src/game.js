const WebSocket = require('ws');

let game_seq = 100;

const games = {};

function add_game() {
    game_seq += 1;
    games[game_seq] = {
        events: [],
        players: [],
    };
}

// Start with 3 canned games.
add_game();
add_game();
add_game();

exports.data = () => {
    console.info('game info', JSON.stringify(games, null, 4));
    return games;
};

exports.handle_message = (clients, client, payload) => {
    const message = JSON.parse(payload);

    const game_id = message.game_id;

    const user_id = client.user_id;

    event = {
        message: message,
        user_id: user_id,
        type: 'game',
        game_type: 'tictactoe',
    };

    const game = games[game_id];

    if (!game) {
        console.warn(`client sent bad game id ${game_id}`);
        return;
    }

    const num_players = 2;

    if (game.players.length >= num_players) {
        if (!game.players.includes(user_id)) {
            console.warn(`${user_id} is too late for this game`);
            return;
        }
    } else {
        game.players.push(user_id);
    }

    game.events.push(event);

    clients.forEach((client) => {
        console.info('about to reply', JSON.stringify(event));
        client.ws.send(JSON.stringify(event));
    });
};
