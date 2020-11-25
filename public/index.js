import css from './index.css';

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

function start_ui() {
    let main_widget;

    function update() {
        main_widget.update();
    }

    $(document).on('zulipRedrawEverything', update);

    main_widget = window.layout.make();

    const main_page = main_widget.render();
    $('#main').html(main_page);
}

function establish_ws_channel() {
    // TODO: extract helper for these loading things
    $('#main').append('establishing socket').append('<br>');

    const ws_url =
        'ws://' + window.location.hostname + ':' + window.location.port;

    // We have to establish listeners immediately after
    // creating the socket, or the first messages from the
    // server will get lost.  I don't know why WebSocket
    // doesn't take handlers in the constructor; this would
    // save a lot of confusion.
    window.ws = new WebSocket(ws_url);

    window.ws.onopen = () => {
        console.log('ws to server is open');
        start_ui();
    };

    window.ws.onmessage = (message) => {
        const event = JSON.parse(message.data);
        if (event.type === 'zulip') {
            window.events.handle_event(event);
        } else if (event.type === 'game') {
            window.games.handle_event(event);
        }
    };
}

$(document).ready(async () => {
    $('#loading-js').remove();

    await init_data();

    window.games.initialize(page_params.games);

    // When we establish the channel, we will start the UI.
    establish_ws_channel();
});
