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
        let right;
        let search_val = '';
        let search;
        let active_key = keys[0];
        let active_conf = right_handler(active_key);

        function render() {
            if (get_keys) {
                keys = get_keys();
            }
            pane = $('<div>').addClass('split-pane');
            left = $('<div>').addClass('left');
            right = $('<div>').addClass('right');

            pane.css('display', 'flex');

            pane.append(left);
            pane.append(right);

            search = $('<input>').attr({ type: 'text' });

            populate();

            search.val(search_val);

            return pane;
        }

        function left_click_handler(button, idx) {
            return async () => {
                active_key = keys[idx];
                active_conf = right_handler(active_key);

                button.css('opacity', '50%');
                right.html('loading...');
                populate();
            };
        }

        function is_key_visible(key) {
            const label = key_to_label(key);
            return label.toLowerCase().includes(search_val);
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

            keys.forEach((key, idx) => {
                if (!is_key_visible(key)) {
                    return;
                }

                const label = key_to_label(key);

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

        function populate_right() {
            right.empty();

            if (is_key_visible(active_key)) {
                const right_contents = active_conf.render();
                right.html(right_contents);
            }
        }

        function populate(pane) {
            populate_left();
            populate_right();
        }

        function update() {
            if (get_keys) {
                keys = get_keys();
                populate_left();
            }

            if (!active_conf.update) {
                populate_right();
                return;
            }

            if (!is_key_visible(active_key)) {
                right.empty();
            }
            active_conf.update();
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
