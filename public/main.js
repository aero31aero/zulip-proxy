window.main = (() => {
    function make(redraw_callback) {
        const user_widget = window.users.make();
        const stream_widget = window.streams.make();

        const pane_config = [
            {
                label: 'Tic Tac Toe',
                name: 'tic-tac-toe',
                view: () => window.tictactoe.render(),
            },
            {
                label: 'Users',
                name: 'users',
                view: () => user_widget.render(),
            },
            {
                label: 'Messages',
                name: 'messages',
                view: () => window.messages.render(),
            },
            {
                label: 'Streams',
                name: 'streams',
                view: () => stream_widget.render(),
            },
        ];

        const main_pane_widget = window.split_pane.make(pane_config, 'main');

        async function render() {
            const top_div = $('<div>');
            top_div.text(`${_.me().full_name} - `);
            const link = $('<a>', {
                text: `Server: ${model().state.server}`,
                href: model().state.server,
            });
            top_div.append(link);

            const redraw_button = $('<button>').text('redraw app');

            redraw_button.on('click', redraw_callback);

            const main_pane = await main_pane_widget.render();

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
