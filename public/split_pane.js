window.split_pane = (() => {
    function make(opts) {
        let keys = opts.keys;
        let get_keys = opts.get_keys;
        let key_to_label = opts.key_to_label;
        let right_handler = opts.right_handler;

        if (!(keys || get_keys) || !key_to_label || !right_handler) {
            throw Error('misconfigured split_pane');
        }
        if (get_keys) {
            keys = get_keys();
        }

        let pane;
        let left;
        let search;
        let right;
        let active_key = keys[0];
        let search_val = '';
        let active_conf;

        function render() {
            if (get_keys) {
                keys = get_keys();
            }
            pane = $('<div>').addClass('split-pane');
            left = $('<div>').addClass('left');
            right = $('<div>').addClass('right');

            pane.append(left);
            pane.append(right);

            search = $('<input>').attr({ type: 'text' });

            populate(pane);

            search.val(search_val);

            return pane;
        }

        function left_click_handler(button, idx) {
            return async () => {
                active_key = keys[idx];

                button.css('opacity', '50%');
                right.html('loading...');
                populate(pane);
            };
        }

        function populate_left() {
            left.empty();

            const search_div = $('<div>').addClass('search');
            const items_div = $('<div>').addClass('items');
            search_div.append(search);
            left.append(search_div);
            left.append(items_div);

            search.on('keyup', async () => {
                search_val = search.val().toLowerCase();
                populate(pane);
                search.focus();
            });

            active_conf = undefined;

            keys.forEach((key, idx) => {
                const label = key_to_label(key);

                if (!label.toLowerCase().includes(search_val)) {
                    return;
                }

                if (key === active_key) {
                    active_conf = right_handler(key);
                }

                const button = $('<button>').text(label);
                const div = $('<div>').html(button);

                items_div.append(div);

                button.on('click', left_click_handler(button, idx));

                if (key === active_key) {
                    button.css('background-color', '#4CAF50');
                } else {
                    button.css('background-color', '008CBA');
                }

                button.css('width', '95%');
                button.css('white-space', 'nowrap');
                button.css('text-align', 'left');
            });
        }

        function populate(pane) {
            pane.css('display', 'flex');

            populate_left();
            right.empty();

            if (active_conf) {
                console.info('about to redraw right');
                const right_contents = active_conf.render();
                right.html(right_contents);
            }
        }

        function update() {
            if (get_keys) {
                keys = get_keys();
                populate_left();
            }

            if (active_conf === undefined) {
                right.empty();
                return;
            }

            const item = active_conf;

            if (item.update) {
                item.update();
                return;
            }

            // If our item does not know how to update itself,
            // just re-render the whole thing.
            right.empty();
            const right_contents = item.render();
            right.html(right_contents);
        }

        return {
            render: render,
            update: update,
        };
    }

    return {
        make: make,
    };
})();
