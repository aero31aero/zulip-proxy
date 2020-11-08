const queue = require('./queue');

const send_to_client = (data, client) => {
    client.ws.send(
        JSON.stringify({
            type: 'zulip',
            data: data,
        })
    );
};

const process_event = (event, client) => {
    if (!event) return;
    if (event.type === 'message') {
        event.message.local_id = event.local_message_id;
        send_to_client(
            {
                messages: [event.message],
            },
            client
        );
    } else if (event.type === 'update_message') {
        const new_message = {
            id: event.message_id,
            content: event.rendered_content,
        };
        send_to_client(
            {
                messages: [new_message],
            },
            client
        );
    } else {
        if (event.type == 'queue_id') {
            console.info(`registered queue ${event.queue_id}`);
        }
        send_to_client(event, client);
    }
};

exports.make_handler = (zulip, client) => {
    const call_on_each = (event) => {
        process_event(event, client);
    };
    const z = zulip.get_raw_methods(client.session);
    const q = queue.make(z);

    function start() {
        q.start(call_on_each, ['message', 'realm_emoji'], {
            apply_markdown: true,
        });
    }

    return {
        start,
        stop: q.stop,
    };
};
