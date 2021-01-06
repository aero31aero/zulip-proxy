window.transmit = (() => {
    let local_id_seq = 100;
    let in_flight = [];

    function in_flight_messages(recipient) {
        if (recipient.type !== 'private') {
            console.error('unexpected recipient type');
            return [];
        }

        return in_flight.filter((msg) => {
            return msg.recipient.user_id === recipient.user_id;
        });
    }

    function ack_local(local_id) {
        in_flight = in_flight.filter((msg) => {
            return msg.local_id.toString() !== local_id;
        });
    }

    function local_echo(recipient, content, data) {
        const message = {
            recipient: recipient,
            sender_full_name: window._.me.full_name,
            content: `<b>in flight<b><pre>${content}</pre>`,
        };

        local_id_seq += 1;
        const local_id = local_id_seq + 0.01;
        const queue_id = events.get_queue_id();

        message.local_id = local_id;
        data.queue_id = queue_id;
        data.local_id = local_id;

        if (queue_id) {
            in_flight.push(message);
            window._.redraw();
        } else {
            // We will send our message, but we won't locally echo it.
            // This shouldn't happen unless a user is really quick.
            console.warn('local echo is turned off until we know our queue_id');
        }
    }

    function send_stream_message(stream_id, topic, content) {
        // TODO merge with send_pm and use local echo.
        const data = {
            type: 'stream',
            to: stream_id,
            topic: topic,
            content: content,
        };

        fetch('/z/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    function send_pm(recipient, content) {
        const data = {
            type: 'private',
            to: JSON.stringify([recipient.user_id]),
            content: content,
        };

        local_echo(recipient, content, data);

        fetch('/z/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    function send_message(recipient, content) {
        if (recipient.type === 'private') {
            send_pm(recipient, content);
        } else {
            send_stream_message(recipient.stream_id, recipient.topic, content);
        }
    }

    return {
        in_flight_messages,
        ack_local,
        send_message,
    };
})();
