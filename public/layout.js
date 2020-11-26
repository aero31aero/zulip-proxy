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

        const refresh_layout = () => {
            container.attr('class', 'pane-wrapper flex-main');
            help_message.hide();
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
        console.log(color_list);
        let current_color_index = 0;

        const make_new_pane = () => {
            const pane = window.main.make();
            const close_button = $('<button>')
                .text('CLOSE')
                .addClass('close-pane-button')
                .addClass('focus-mode-hidden')
                .hide();
            panes.add(pane);
            const thin_wrapper = $('<div>').addClass('pane-wrapper');
            thin_wrapper.append(close_button);
            thin_wrapper.append(pane.render().addClass('flex-main'));
            container.append(thin_wrapper);

            // assign color
            thin_wrapper.css('background', color_list[current_color_index]);
            current_color_index++;

            // event handlers
            close_button.on('click', () => {
                panes.delete(pane);
                thin_wrapper.remove();
                _.redraw();
                refresh_layout();
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
                $('.close-pane-button').hide();
            } else {
                container.css('justify-content', 'flex-start');
                $('.close-pane-button').show();
            }

            if (is_focus_on) {
                $('.focus-mode-hidden').hide();
            } else {
                $('.focus-mode-hidden').show();
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

        function make_focus_mode_button() {
            const focus_mode_button = $('<button>').addClass(
                'focus-mode-button'
            );
            focus_mode_button.text('Focus Mode');
            focus_mode_button.on('click', () => {
                is_focus_on = !is_focus_on;
                _.redraw();
            });
            return focus_mode_button;
        }

        const render_navbar = () => {
            const navbar = $('<div>').addClass('navbar');

            redraw_button = make_redraw_button();

            navbar.append(redraw_button);
            navbar.append(logout_link());
            navbar.append(make_top_div());
            navbar.append(make_focus_mode_button());
            navbar.append(make_new_pane_button());
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
