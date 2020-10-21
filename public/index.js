$(document).ready(async () => {
    const ws_url =
        'ws://' + window.location.hostname + ':' + page_params.game_port;
    console.info(ws_url);
    const ws = new WebSocket(ws_url);

    ws.onopen = () => {
        console.log('now connected');
    };

    window.tictactoe.initialize({
        params: page_params.game,
        ws: ws,
    });

    const top_div = $('<div>');
    top_div.text(`${page_params.me.full_name} - `);
    const link = $('<a>', {
        text: `Server: ${page_params.app_url}`,
        href: page_params.app_url,
    });
    top_div.append(link);

    const pane_config = [
        {
            label: 'Tic Tac Toe',
            view: () => window.tictactoe.render(),
        },
        {
            label: 'Users',
            view: () => window.users.render(),
        },
        {
            label: 'Messages',
            view: () => window.messages.render(),
        },
        {
            label: 'Streams',
            view: () => window.streams.render(),
        },
    ];

    const main_pane = await window.split_pane.render(pane_config);

    $('#main').append(top_div);
    $('#main').append('<hr>');

    $('#main').append(main_pane);
});
