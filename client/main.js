window.main = (() => {
    function make() {
        let main_pane;

        const user_widget = window.users.make_view();
        const test_widget = window.streams.make_view();

        const config = [
            {
                label: 'Users',
                name: 'users',
                render: user_widget.render,
                update: user_widget.update,
            },
            {
                label: 'Streams',
                name: 'streams',
                render: test_widget.render,
            },
        ];

        const main_pane_widget = window.tab_bar.make(config);

        function update() {
            main_pane_widget.update();
        }

        function render() {
            const page = $('<div>');
            main_pane = main_pane_widget.render();
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
