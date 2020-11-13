window.layout = (() => {
    function make() {
        const root = $('<div>').addClass('layout-root');
        const container = $('<div>').addClass('layout-container');
        let panes = new Set();
        const make_new_pane = () => {
            const pane = window.main.make();
            const close_button = $('<button>')
                .text('CLOSE')
                .addClass('close-pane-button')
                .hide();
            panes.add(pane);
            const thin_wrapper = $('<div>');
            thin_wrapper.append(close_button);
            thin_wrapper.append(pane.render());
            container.append(thin_wrapper);
            close_button.on('click', () => {
                panes.delete(pane);
                thin_wrapper.remove();
                _.redraw();
            });
        };

        make_new_pane();
        let redraw_button;

        const update = () => {
            redraw_button.css('background', '');
            panes.forEach((pane) => {
                pane.update();
            });
            let i = 0;
            if (panes.size === 1) {
                container.css('justify-content', 'center');
                $('.close-pane-button').hide();
            } else {
                container.css('justify-content', 'flex-start');
                $('.close-pane-button').show();
            }
        };

        function make_redraw_button() {
            const button = $('<button>').text('redraw app');

            button.on('click', (e) => {
                e.stopPropagation();
                redraw_button.css('background', 'blue');
                _.redraw();
            });

            return button;
        }

        function logout_link() {
            return '<a href="logout">Log out </a>';
        }

        function make_top_div() {
            const div = $('<div>');
            div.text(`${_.me().full_name} - `);
            const link = $('<a>', {
                text: `Server: ${model.main().state.server}`,
                href: model.main().state.server,
                target: '_blank',
            });
            div.append(link);

            return div;
        }

        function make_new_pane_button() {
            const new_pane_button = $('<button>').addClass('new-pane-button');
            new_pane_button.text('Add Pane');
            new_pane_button.on('click', () => {
                make_new_pane();
                _.redraw();
            });
            return new_pane_button;
        }

        const render_navbar = () => {
            const navbar = $('<div>').addClass('navbar');

            redraw_button = make_redraw_button();

            navbar.append(redraw_button);
            navbar.append(logout_link());
            navbar.append(make_top_div());
            navbar.append(make_new_pane_button());
            root.append(navbar);
        };

        const render = () => {
            root.empty();
            render_navbar();
            root.append(container);
            update();
            return root;
        };

        return {
            update,
            render,
        };
    }

    return {
        make,
    };
})();
