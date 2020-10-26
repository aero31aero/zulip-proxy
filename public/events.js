window.events = (() => {
    const handle_model_updates = (event) => {
        try {
            model(event.model);
            $(document).trigger('zulipRedrawEverything');
        } catch (e) {
            console.error('Error updating model:', event, e);
        }
    };

    const init = (ws) => {
        console.log('init events');
        ws.onmessage = (message) => {
            const event = JSON.parse(message.data);
            console.log('got message', event);
            if (event.type === 'update') {
                handle_model_updates(event);
            } else if (event.type === 'tictactoe') {
                window.tictactoe.handle_event(event);
            }
        };
    };
    return init;
})();
