const queue = require('./queue');

const send_model_update = (json, client) => {
    client.ws.send(
        JSON.stringify({
            type: 'zulip',
            model: json,
        })
    );
};

const process_event = (event, client) => {
    if (!event) return;
    if (event.type === 'message') {
        event.message.local_id = event.local_message_id;
        send_model_update(
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
        send_model_update(
            {
                messages: [new_message],
            },
            client
        );
    } else if (event.type === 'queue_id') {
        // This event is received almost immediately;
        // let's let the client get loaded first.
        setTimeout(function () {
            send_model_update(
                {
                    state: {
                        queue_id: event.queue_id,
                    },
                },
                client
            );
        }, 5000);
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
