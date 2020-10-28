window.split_pane = (() => {
    function left_click_handler(self, button, idx) {
        return async () => {
            self.active_idx = idx;

            button.css('opacity', '50%');
            self.right.html('loading...');
            $(document).trigger('zulipRedrawEverything');
        };
    }

    function update_left(self, config) {
        self.items_div.empty();
        self.search.on('keyup', async () => {
            self.search_val = self.search.val().toLowerCase();
            $(document).trigger('zulipRedrawEverything');
            self.search.focus();
        });

        config.forEach((conf, idx) => {
            if (!conf.label.toLowerCase().includes(self.search_val)) {
                if (idx === self.active_idx) {
                    self.active_idx = undefined;
                }
                return;
            }

            const button = $('<button>').text(conf.label);
            const div = $('<div>').html(button);

            self.items_div.append(div);

            button.on('click', left_click_handler(self, button, idx));

            if (idx === self.active_idx) {
                button.css('background-color', '#4CAF50');
            } else {
                button.css('background-color', '008CBA');
            }

            button.css('width', '95%');
            button.css('white-space', 'nowrap');
            button.css('text-align', 'left');
        });
    }

    function update_right(self, config) {
        self.right.empty();

        if (self.active_idx !== undefined) {
            const right_contents = config[self.active_idx].view();
            self.right.html(right_contents);
        }
    }

    function populate(self, widget_container) {
        widget_container.addClass('split-pane');
        widget_container.css('display', 'flex');
        self.left = $('<div>').addClass('left');
        self.right = $('<div>').addClass('right');
        self.active_idx = 0;
        self.search_val = '';
        self.search = search = $('<input>').attr({ type: 'text' });
        self.search_div = $('<div>').addClass('search');
        self.items_div = $('<div>').addClass('items');
        self.search_div.append(self.search);
        self.left.append(self.search_div);
        self.left.append(self.items_div);
        widget_container.append(self.left);
        widget_container.append(self.right);
    }

    function make(config, name) {
        const widget = widgets.make({
            name: name,
            should_update: (self, data) => {
                return window.widgets.PARTIAL;
            },
            populate: populate,
            update: (self, widget_container, data) => {
                update_left(self, config);
                update_right(self, config);
            },
        });
        window.x = widget;
        return widget;
    }
    return {
        make: make,
    };
})();
