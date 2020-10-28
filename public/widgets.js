window.widgets = {
    NOOP: 0,
    PARTIAL: 1,
    REDRAW: 2,
    make: (user_opts) => {
        const default_opts = {
            name: 'default-widget',
            populate: (self, widget_container) => {
                self.p = $('<p>Hello World</p>');
                widget_container.append(self.p);
            },
            should_update: (self, data) => {
                return window.widgets.REDRAW;
            },
            update: (self, widget_container, data) => {
                self.p.addClass(data.class);
            },
            destroy: () => {},
        };

        return (function new_widget() {
            let rendered_once = false;
            let children = [];
            let self = {};
            let opts = Object.assign(default_opts, user_opts);
            const widget_container = $('<div>')
                .addClass('zulip-widget')
                .attr('id', opts.name);

            const should_update = (data) => {
                if (!rendered_once) {
                    return window.widgets.REDRAW;
                }
                return opts.should_update(self, data);
            };

            const render = (data) => {
                const update_status = should_update(data);
                switch (update_status) {
                    case window.widgets.NOOP:
                        return;
                        break;
                    case window.widgets.PARTIAL:
                        opts.update(self, widget_container, data);
                        break;
                    case window.widgets.REDRAW:
                        widget_container.empty();
                        opts.populate(self, widget_container);
                        opts.update(self, widget_container, data);
                        break;
                }
                rendered_once = true;
                return widget_container;
            };

            const destroy = () => {
                opts.destroy(); // call some custom code if the widget wants.
                widget_container.remove();
            };

            const get_div = () => widget_container;
            const set_div = (d) => {
                widget_container = d;
            };

            return {
                render,
                self,
                widget_container,
                destroy,
                get_div,
                set_div,
            };
        })();
    },
};
