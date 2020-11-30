window.main = (() => {
    function make() {
        let main_pane;

        const modal_div = $('<div>', {
            class: 'modal',
        }).hide();

        function enter_modal(div, set_focus) {
            modal_div.html(div);
            main_pane.hide();
            modal_div.show();

            if (set_focus) {
                console.info('focus');
                set_focus();
            }
        }

        function exit_modal() {
            main_pane.show();
            modal_div.hide();
            update();
        }

        const helpers = {
            enter_modal,
            exit_modal,
        };

        const user_widget = window.users.make_view(helpers);
        const test_widget = window.tester.make_view(helpers);

        const config = [
            {
                label: 'Users',
                name: 'users',
                render: user_widget.render,
                update: user_widget.update,
            },
            {
                label: 'Test Widget',
                name: 'test-widget',
                render: test_widget.render,
            },
        ];

        const main_pane_widget = window.tab_bar.make(config);

        function update() {
            main_pane_widget.update();
            // modals aren't allowed to be live-updated yet
        }

        function render() {
            const page = $('<div>');
            main_pane = main_pane_widget.render();
            page.append(main_pane);
            page.append(modal_div);

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
