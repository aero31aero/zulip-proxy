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

        const update = () => {
            redraw_button.css('background', '');
            panes.forEach((p) => {
                p.pane.update();
            });
            let i = 0;
            while (i < current_panes) {
                panes[i].html.css('display', 'block');
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
        let redraw_button;
        let panes_input;

        const render_navbar = () => {
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

            panes_input = $('<select>');
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

            const navbar = $('<div>').addClass('navbar');
            navbar.append(redraw_button);
            navbar.append(top_div);
            navbar.append(panes_input);
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
        make: make,
    };
})();
