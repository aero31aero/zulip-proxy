const init_data = async () => {
    model({
        state: {
            user_id: page_params.me.user_id,
            server: page_params.app_url,
        },
    });
    await _.fetch_users();
    await _.fetch_streams();
};

$(document).ready(async () => {
    const ws_url =
        'ws://' + window.location.hostname + ':' + page_params.ws_port;
    console.info(ws_url);
    window.ws = new WebSocket(ws_url);

    window.ws.onopen = () => {
        console.log('now connected');
    };

    await init_data();

    window.games.initialize(page_params.games);
    events();

    let main_widget;

    async function redraw_everything() {
        const main_page = main_widget.render();
        console.log('Redrawing');
        $('body').html(main_page);
    }

    $(document).on('zulipRedrawEverything', redraw_everything);

    main_widget = window.main.make(redraw_everything);

    redraw_everything();
});
