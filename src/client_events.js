const make = (client) => {
    return;
};

const queue = require('./queue');

const send_model_update = (json, client) => {
    client.ws.send(
        JSON.stringify({
            type: 'update',
            model: json,
        })
    );
};

const process_event = (event, client) => {
    if (!event) return;
    if (event.type === 'message') {
        send_model_update(
            {
                messages: [event.message],
            },
            client
        );
    }
};

module.exports = (zulip, client) => {
    const call_on_each = (event) => {
        process_event(event, client);
    };
    const z = zulip.get_raw_methods(client.session);
    z.get('messages', {
        num_before: 1000,
        num_after: 0,
        anchor: 'newest',
    }).then((res) => {
        send_model_update(
            {
                messages: res.messages,
            },
            client
        );
        console.log('Loaded messages: ', res.messages.length);
    });
    queue(z)(call_on_each, ['message', 'realm_emoji']);
};
