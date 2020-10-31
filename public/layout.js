window.layout = (() => {
    function make() {
        const max_panes = 5;
        let current_panes = 1;
        const root = $('<div>').addClass('layout-root');
        const container = $('<div>').addClass('layout-container');
        let panes = Array.apply(null, Array(max_panes)).map((e) => {
            const view = window.main.make();
            return view;
        });
        panes = panes.map((p) => {
            return {
                pane: p,
                html: p.render(),
            };
        });

        panes.forEach((p) => {
            container.append(p.html);
        });

        let redraw_button;

        const update = () => {
            redraw_button.css('background', '');
            panes.forEach((p) => {
                p.pane.update();
            });
            let i = 0;
            while (i < current_panes) {
                panes[i].html.css('display', 'block');
                panes[i].html.attr('class', 'layout-pane');
                i++;
            }
            while (i < max_panes) {
                panes[i].html.css('display', 'none');
                i++;
            }
            if (current_panes === 1) {
                container.css('justify-content', 'center');
            } else {
                container.css('justify-content', 'flex-start');
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

        function make_top_div() {
            const div = $('<div>');
            div.text(`${_.me().full_name} - `);
            const link = $('<a>', {
                text: `Server: ${model().state.server}`,
                href: model().state.server,
                target: '_blank',
            });
            div.append(link);

            return div;
        }

        function make_panes_selector() {
            const panes_input = $('<select>');
            for (let i = 1; i <= max_panes; i++) {
                $('<option/>')
                    .val(i)
                    .html(`${i} pane(s)`)
                    .appendTo(panes_input);
            }
            panes_input.on('change', function () {
                current_panes = parseInt(this.value);
                _.redraw();
            });
            return panes_input;
        }

        const render_navbar = () => {
            const navbar = $('<div>').addClass('navbar');

            redraw_button = make_redraw_button();

            navbar.append(redraw_button);
            navbar.append(make_top_div());
            navbar.append(make_panes_selector());
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
