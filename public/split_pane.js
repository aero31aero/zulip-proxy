window.split_pane = (() => {
    function make(config, name) {
        let pane;
        let left;
        let search;
        let right;
        let active_idx = 0;
        let search_val = '';

        function render() {
            pane = $('<div>').addClass('split-pane').attr('id', `pane-${name}`);
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
                active_idx = idx;

                button.css('opacity', '50%');
                right.html('loading...');
                populate(pane);
            };
        }

        function populate(pane) {
            pane.css('display', 'flex');

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

            config.forEach((conf, idx) => {
                if (!conf.label.toLowerCase().includes(search_val)) {
                    if (idx === active_idx) {
                        active_idx = undefined;
                    }
                    return;
                }

                const button = $('<button>').text(conf.label);
                const div = $('<div>').html(button);

                items_div.append(div);

                button.on('click', left_click_handler(button, idx));

                if (idx === active_idx) {
                    button.css('background-color', '#4CAF50');
                } else {
                    button.css('background-color', '008CBA');
                }

                button.css('width', '95%');
                button.css('white-space', 'nowrap');
                button.css('text-align', 'left');
            });

            right.empty();

            if (active_idx !== undefined) {
                console.info('about to redraw right', config[active_idx]);
                const right_contents = config[active_idx].view();
                right.html(right_contents);
            }
        }

        function update() {
            // TODO: Allow left-pane updates.

            if (active_idx === undefined) {
                right.empty();
                return;
            }

            const item = config[active_idx];

            if (item.update) {
                item.update();
                return;
            }

            // If our item does not know how to update itself,
            // just re-render the whole thing.
            right.empty();
            const right_contents = item.view();
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
