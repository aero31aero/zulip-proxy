const init_data = async () => {
    const br = '<br>';

    $('#main').html('loading model\n').append(br);
    model.main({
        state: {
            user_id: page_params.me.user_id,
            server: page_params.app_url,
        },
    });
    $('#main').append('fetching users').append(br);
    await _.fetch_users();
    $('#main').append('fetching messages').append(br);
    await _.fetch_messages();
    $('#main').append('fetching streams').append(br);
    await _.fetch_streams();
    $('#main').append('done with init_data').append(br);
};

$(document).ready(async () => {
    $('#loading-js').remove();

    const ws_url =
        'ws://' + window.location.hostname + ':' + page_params.ws_port;
    console.info(ws_url);
    window.ws = new WebSocket(ws_url);

    window.ws.onopen = () => {
        console.log('now connected');
    };

    await init_data();

    window.games.initialize(page_params.games);

    window.ws.onmessage = (message) => {
        const event = JSON.parse(message.data);
        if (event.type === 'zulip') {
            window.events.handle_event(event);
        } else if (event.type === 'game') {
            window.games.handle_event(event);
        }
    };

    let main_widget;

    function update() {
        main_widget.update();
    }

    $(document).on('zulipRedrawEverything', update);

    main_widget = window.layout.make();

    const main_page = main_widget.render();
    $('#main').html(main_page);
});
