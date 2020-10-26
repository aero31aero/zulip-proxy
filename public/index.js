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
        'ws://' + window.location.hostname + ':' + page_params.game_port;
    console.info(ws_url);
    const ws = new WebSocket(ws_url);

    ws.onopen = () => {
        console.log('now connected');
    };

    await init_data();
    window.tictactoe.initialize({
        params: page_params.game,
        ws: ws,
    });

    events(ws);

    let main_widget;

    async function redraw_everything() {
        console.log('Redrawing');
        const main_page = await main_widget.render();
        $('#main').html(main_page);
    }

    $(document).on('zulipRedrawEverything', redraw_everything);

    main_widget = window.main.make(redraw_everything);

    redraw_everything();
});
