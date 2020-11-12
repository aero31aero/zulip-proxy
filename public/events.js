window.events = (() => {
    let queue_id;

    function get_queue_id() {
        return queue_id;
    }

    const handle_event = (event) => {
        if (event.data.type === 'queue_id') {
            queue_id = event.data.queue_id;
            return;
        }

        let data = event.data;

        if (data.type === 'message') {
            const message = data.message;
            const local_id = data.local_message_id;

            if (local_id) {
                window.transmit.ack_local(local_id);
            }
            model.Messages.add(message);
        } else if (data.type === 'update_message') {
            model.Messages.update_message(
                data.message_id,
                data.rendered_content
            );
        }
        _.redraw();
    };

    return { handle_event, get_queue_id };
})();
