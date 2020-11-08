window.events = (() => {
    const handle_event = (event) => {
        if (event.model.messages) {
            const message = event.model.messages[0];
            if (message.local_id) {
                window.transmit.ack_local(message);
            }
        }
        try {
            model.main(event.model);
            _.redraw();
        } catch (e) {
            console.error('Error updating model:', event, e);
        }
    };

    return { handle_event };
})();
