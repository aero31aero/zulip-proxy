window.layout = (() => {
    function make() {
        const root = $('<div>').addClass('layout-root');
        const container = $('<div>')
            .addClass('layout-container')
            .addClass('flex-main');
        const help_message = $('<h1>You need help!</h1>')
            .addClass('help-message')
            .hide();
        let panes = new Set();
        let is_focus_on = false;
        let is_maximized = false;

        const refresh_layout = () => {
            container.attr('class', 'flex-main');
            help_message.hide();
            if (is_maximized) {
                container.addClass('layout-maximized');
                return;
            }
            if ([4, 5, 6, 7, 8, 9].includes(panes.size)) {
                container.addClass(`layout-panes-${panes.size}`);
            } else {
                container.addClass('layout-horizontal');
            }
            if (panes.size >= 10) {
                help_message.show();
            }
        };

        function getRandomColor() {
            const letters = '89ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * letters.length)];
            }
            return color;
        }

        const color_list = [];
        for (let i = 0; i < 1000; i++) {
            color_list.push(getRandomColor());
        }
        let current_color_index = 0;

        const make_new_pane = () => {
            const pane = window.main.make();
            const close_button = $('<button>').text('✕');
            const maximize_button = $('<button>').text('🗖');
            const title = $('<p>').addClass('title');
            const controls_wrapper = $('<div>')
                .hide()
                .addClass('controls-wrapper');
            controls_wrapper.append(close_button);
            controls_wrapper.append(maximize_button);
            controls_wrapper.append(title);

            panes.add(pane);
            const thin_wrapper = $('<div>').addClass('pane-wrapper');
            thin_wrapper.append(controls_wrapper);
            thin_wrapper.append(pane.render().addClass('flex-main'));
            container.append(thin_wrapper);

            // assign color
            controls_wrapper.css('background', color_list[current_color_index]);
            current_color_index++;

            // event handlers
            close_button.on('click', () => {
                panes.delete(pane);
                thin_wrapper.remove();
                _.redraw();
                refresh_layout();
            });
            maximize_button.on('click', () => {
                // push pane to the end of set.
                container.prepend(thin_wrapper);
                is_maximized = true;
                _.redraw();
            });
            refresh_layout();
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
                $('.controls-wrapper').hide();
            } else {
                container.css('justify-content', 'flex-start');
                $('.controls-wrapper').show();
            }

            if (is_focus_on) {
                $('.focus-mode-hidden').hide();
            } else {
                $('.focus-mode-hidden').show();
            }
            refresh_layout();
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
                text: `Server: ${model.main.server}`,
                href: model.main.server,
                target: '_blank',
            });
            div.append(link);

            return div;
        }

        function make_buttons() {
            const new_pane_button = $('<button>').addClass('new-pane-button');
            new_pane_button.text('Add Pane');
            new_pane_button.on('click', () => {
                make_new_pane();
                _.redraw();
            });

            const focus_mode_button = $('<button>').addClass(
                'focus-mode-button'
            );
            focus_mode_button.text('Focus Mode');
            focus_mode_button.on('click', () => {
                is_focus_on = !is_focus_on;
                _.redraw();
            });

            const restore_button = $('<button>').addClass('restore-button');
            restore_button.text('Restore Layout');
            restore_button.on('click', () => {
                is_maximized = false;
                _.redraw();
            });

            const buttons_wrapper = $('<div>');
            buttons_wrapper.append(restore_button);
            buttons_wrapper.append(focus_mode_button);
            buttons_wrapper.append(new_pane_button);
            return buttons_wrapper;
        }

        const render_navbar = () => {
            const navbar = $('<div>').addClass('navbar');

            redraw_button = make_redraw_button();

            navbar.append(redraw_button);
            navbar.append(logout_link());
            navbar.append(make_top_div());
            navbar.append(make_buttons());
            root.append(navbar);
        };

        const render = () => {
            root.empty();
            render_navbar();
            root.append(container);
            root.append(help_message);
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
