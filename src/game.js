const WebSocket = require('ws');

const game_seq = 101;

const games = {};

games[game_seq] = {
    events: [],
};

exports.data = () => {
    console.info('game info', JSON.stringify(games, null, 4));
    return games;
};

exports.handle_message = (clients, client, payload) => {
    const message = JSON.parse(payload);

    const game_id = message.game_id;

    event = {
        message: message,
        user_id: client.user_id,
        type: 'tictactoe',
    };

    const game = games[game_id];

    if (!game) {
        console.warn(`client sent bad game id ${game_id}`);
        return;
    }

    game.events.push(event);

    clients.forEach((client) => {
        console.info('about to reply', JSON.stringify(event));
        client.ws.send(JSON.stringify(event));
    });
};
