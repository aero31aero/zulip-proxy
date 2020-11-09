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

            data = {
                messages: [message],
            };
        } else if (data.type === 'update_message') {
            data = {
                messages: [
                    {
                        id: data.message_id,
                        content: data.rendered_content,
                    },
                ],
            };
        }

        try {
            model.main(data);
            _.redraw();
        } catch (e) {
            console.error('Error updating model:', event, e);
        }
    };

    return { handle_event, get_queue_id };
})();
