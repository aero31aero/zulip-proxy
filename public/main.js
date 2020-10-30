window.main = (() => {
    function make() {
        const games_widget = window.games.make();
        const user_widget = window.users.make();

        const pane_config = [
            {
                label: 'Users',
                name: 'users',
                render: user_widget.render,
                update: user_widget.update,
            },
            {
                label: 'Tic Tac Toe',
                name: 'tic-tac-toe',
                render: games_widget.render,
            },
        ];

        const main_pane_widget = window.top_nav.make(pane_config);
        let redraw_button;

        function update() {
            main_pane_widget.update();
            redraw_button.css('background', '');
        }

        function render() {
            const top_div = $('<div>');
            top_div.text(`${_.me().full_name} - `);
            const link = $('<a>', {
                text: `Server: ${model().state.server}`,
                href: model().state.server,
                target: '_blank',
            });
            top_div.append(link);

            redraw_button = $('<button>').text('redraw app');

            redraw_button.on('click', (e) => {
                e.stopPropagation();
                redraw_button.css('background', 'blue');
                _.redraw();
            });

            const main_pane = main_pane_widget.render();

            const navbar = $('<div>').addClass('navbar');
            navbar.append(redraw_button);
            navbar.append(top_div);

            const page = $('<div>');
            page.append(navbar);
            page.append(main_pane);

            return page;
        }

        return {
            render: render,
            update: update,
        };
    }

    return {
        make: make,
    };
})();
