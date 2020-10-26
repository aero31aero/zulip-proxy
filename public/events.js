window.events = (() => {
    let ws = undefined;

    const handle_model_updates = (event) => {
        try {
            model(event.model);
            $(document).trigger('zulipRedrawEverything');
        } catch (e) {
            console.error('Error updating model:', event, e);
        }
    };

    const init = (_ws) => {
        ws = _ws;
        console.log('init events');
        ws.onmessage = (message) => {
            const event = JSON.parse(message.data);
            console.log('got message', event);
            if (event.type === 'update') {
                handle_model_updates(event);
            }
        };
    };
    return init;
})();
