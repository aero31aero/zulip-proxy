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

        if (event.data.messages) {
            const message = event.data.messages[0];
            if (message.local_id) {
                window.transmit.ack_local(message);
            }
        }
        try {
            model.main(event.data);
            _.redraw();
        } catch (e) {
            console.error('Error updating model:', event, e);
        }
    };

    return { handle_event, get_queue_id };
})();
