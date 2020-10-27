const WebSocket = require('ws');

const game_seq = 101;

const games = {};

games[game_seq] = {
    events: [],
    players: [],
};

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
        type: 'tictactoe',
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
