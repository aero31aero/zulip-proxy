const WebSocket = require('ws');

let player_seq = 100;

exports.init_session = (user) => {
    player_seq += 1;

    return {
        player_id: player_seq,
        user: user,
    };
};

exports.start_ws = (game_port) => {
    const socketServer = new WebSocket.Server({ port: game_port });
    socketServer.on('connection', (socketClient) => {
        console.log('connected');
        console.log('client Set length: ', socketServer.clients.size);

        socketClient.on('close', (socketClient) => {
            console.log('closed');
            console.log('Number of clients: ', socketServer.clients.size);
        });

        socketClient.on('message', (message) => {
            console.info('about to broadcast', JSON.stringify(message));
            socketServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });
    });
};
