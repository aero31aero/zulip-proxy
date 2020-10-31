window.main = (() => {
    function make() {
        const games_widget = window.games.make_view();
        const user_widget = window.users.make_view();

        const config = [
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

        const main_pane_widget = window.tab_bar.make(config);

        function update() {
            main_pane_widget.update();
        }

        function render() {
            const page = $('<div>');
            const main_pane = main_pane_widget.render();
            page.append(main_pane);

            return page;
        }

        return {
            render,
            update,
        };
    }

    return {
        make,
    };
})();
