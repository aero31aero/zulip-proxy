window.layout = (() => {
    function make() {
        const layouts = {
            single: {
                container: {
                    'grid-template-rows': 'auto',
                    'grid-template-columns': 'auto',
                },
                items: [
                    {
                        'grid-rows': '0/1',
                        'grid-columns': '0/1',
                    },
                ],
            },
            double: {
                container: {
                    'grid-template-rows': 'auto',
                    'grid-template-columns': 'auto auto',
                },
                items: [
                    {
                        'grid-rows': '1 / span 1',
                        'grid-columns': '1 / span 1',
                    },
                    {
                        'grid-rows': '1 / span 1',
                        'grid-columns': '2 / span 1',
                    },
                ],
            },
        };

        const max_views = 3;
        const container = $('<div>').addClass('layout-container');
        const views = Array.apply(null, Array(max_views)).map((e) => {
            const view = window.main.make();
            return view;
        });
        let current_layout = 'single';

        views.forEach((e) => {
            container.append(e.render());
        });

        const set_layout = (name) => {
            const l = layouts[name];
            if (!l) {
                console.error(`layout ${name} not found`);
                return;
            }
            container.css(l.container);
        };

        const update = () => {
            set_layout(current_layout);
            views.forEach((x) => {
                x.update();
            });
        };

        const render = () => {
            update();
            return container;
        };

        return {
            update,
            render,
            set_layout,
        };
    }

    return {
        make: make,
    };
})();
