window.split_pane = (() => {
    function make(opts) {
        let get_keys = opts.get_keys;
        let key_to_label = opts.key_to_label;
        let right_handler = opts.right_handler;
        let hide_left = opts.hide_left;

        if (!get_keys || !key_to_label || !right_handler) {
            throw Error('misconfigured split_pane');
        }

        let keys = get_keys();
        let pane;
        let left;
        let right;
        let search_val = '';
        let search;
        let active_key = keys[0];
        let active_conf;

        if (active_key) {
            active_conf = right_handler(active_key);
        }

        function render() {
            if (get_keys) {
                keys = get_keys();
            }
            pane = $('<div>').addClass('split-pane');
            left = $('<div>').addClass('left');
            if (hide_left) {
                left.addClass('focus-mode-hidden');
            }
            right = $('<div>').addClass('right').addClass('flex-main');

            pane.css('display', 'flex');

            pane.append(left);
            pane.append(right);

            if (keys.length === 0) {
                left.html('no items');
                return pane;
            }

            search = $('<input>').attr({ type: 'text' });
            search.val(search_val);

            populate();

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

            if (keys.length === 0) {
                left.html('no items');
                return;
            }

            const search_div = $('<div>').addClass('search');
            const items_div = $('<div>').addClass('items');
            search_div.append(search);
            left.append(search_div);
            left.append(items_div);

            search.on('keyup', async () => {
                search_val = search.val().toLowerCase();
                populate(pane);
                console.info('focus search box in keyup');
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
                    button.addClass('active-item');
                }

                button.css('width', '100%');
                button.css('white-space', 'nowrap');
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
            keys = get_keys();
            populate_left();

            if (!active_conf) {
                return;
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
