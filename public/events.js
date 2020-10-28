window.events = (() => {
    const handle_model_updates = (event) => {
        try {
            model(event.model);
            _.redraw();
        } catch (e) {
            console.error('Error updating model:', event, e);
        }
    };

    const init = () => {
        console.log('init events');

        if (!window.ws) {
            console.warn('No web socket!');
            return;
        }

        window.ws.onmessage = (message) => {
            const event = JSON.parse(message.data);
            console.log('got message', event);
            if (event.type === 'update') {
                handle_model_updates(event);
            } else if (event.type === 'game') {
                window.games.handle_event(event);
            }
        };
    };
    return init;
})();
