window.top_nav = (() => {
    /*

    This widget is similar to split_pane, but it deals
    with heterogenous children, and we don't have search for
    it.  Also, the left pane is not dynamic, so we never
    need to update it.
    */

    function make(config) {
        let pane;
        let left;
        let right;
        let active_idx = 0;

        function render() {
            pane = $('<div>').addClass('split-pane');
            left = $('<div>').addClass('left');
            right = $('<div>').addClass('right');

            pane.append(left);
            pane.append(right);

            populate(pane);

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

            const items_div = $('<div>').addClass('items');
            left.append(items_div);

            config.forEach((conf, idx) => {
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

            console.info('about to redraw right', config[active_idx]);
            const right_contents = config[active_idx].view();
            right.html(right_contents);
        }

        function update() {
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
