const WebSocket = require('ws');

exports.handle_message = (clients, client, message) => {
    payload = {
        message: JSON.parse(message),
        user_id: client.user_id,
        type: 'tictactoe',
    };
    clients.forEach((client) => {
        console.info('about to reply', JSON.stringify(payload));
        client.ws.send(JSON.stringify(payload));
    });
};
