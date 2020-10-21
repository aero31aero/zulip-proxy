const WebSocket = require('ws');

let player_seq = 100;

exports.get_info = (info, user) => {
    if (info && info.user.user_id == user.user_id) {
        // just update the name
        info.user.name = user.name;
        return info;
    }

    player_seq += 1;

    const new_info = {
        player_id: player_seq,
        user: {
            user_id: user.user_id,
            name: user.name,
        },
    };

    return new_info;
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
