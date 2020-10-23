const WebSocket = require('ws');

exports.get_info = (info, user) => {
    if (info && info.user.user_id == user.user_id) {
        // just update the name
        info.user.name = user.name;
        return info;
    }

    const new_info = {
        user: {
            user_id: user.user_id,
            name: user.name,
        },
    };

    return new_info;
};

exports.handle_message = (clients, client, message) => {
    payload = {
        message: JSON.parse(message),
        user_id: client.user_id,
    };
    clients.forEach((client) => {
        console.info('about to reply', JSON.stringify(payload));
        client.ws.send(JSON.stringify(payload));
    });
};
