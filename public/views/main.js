window.main = (() => {
    function make(redraw_callback) {
        const games_widget = window.games.make();
        const user_widget = window.users.make();
        const stream_widget = window.streams.make();
        const message_widget = window.messages.make();

        const pane_config = [
            {
                label: 'Tic Tac Toe',
                name: 'tic-tac-toe',
                view: games_widget,
            },
            {
                label: 'Users',
                name: 'users',
                view: user_widget,
            },
            {
                label: 'Streams',
                name: 'streams',
                view: stream_widget,
            },
            {
                label: 'All Messages',
                name: 'messages',
                view: message_widget,
            },
        ];

        const main_pane_widget = window.split_pane.make(pane_config, 'main');

        function render() {
            const top_div = $('<div>');
            top_div.text(`${_.me().full_name} - `);
            const link = $('<a>', {
                text: `Server: ${model().state.server}`,
                href: model().state.server,
                target: '_blank',
            });
            top_div.append(link);

            const redraw_button = $('<button>').text('redraw app');

            redraw_button.on('click', (e) => {
                e.stopPropagation();
                redraw_button.css('background', 'blue');
                redraw_callback();
            });

            const main_pane = main_pane_widget.render();

            const navbar = $('<div>').addClass('navbar');
            navbar.append(redraw_button);
            navbar.append(top_div);

            const page = $('<div>');
            page.append(navbar);
            page.append('<hr>');

            page.append(main_pane);

            return page;
        }

        return {
            render: render,
        };
    }

    return {
        make: make,
    };
})();
