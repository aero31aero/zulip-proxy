window.top_nav = (() => {
    function make(config) {
        let pane;
        let top;
        let bottom;
        let active_idx = 0;

        function render() {
            pane = $('<div>').addClass('top-nav');
            top = $('<div>').addClass('top');
            bottom = $('<div>').addClass('bottom');

            pane.append(top);
            pane.append(bottom);

            populate(pane);

            return pane;
        }

        function top_click_handler(button, idx) {
            return async () => {
                active_idx = idx;
                button.css('opacity', '50%');
                bottom.html('loading...');
                populate(pane);
            };
        }

        function populate(pane) {
            pane.css('display', 'flex');

            top.empty();

            const items_div = $('<div>').addClass('items');
            top.append(items_div);

            config.forEach((conf, idx) => {
                const button = $('<button>').text(conf.label);
                const div = $('<div>').html(button);

                items_div.append(div);

                button.on('click', top_click_handler(button, idx));

                if (idx === active_idx) {
                    button.css('background-color', '#4CAF50');
                } else {
                    button.css('background-color', '008CBA');
                }

                button.css('width', '95%');
                button.css('white-space', 'nowrap');
            });

            console.info('about to redraw bottom', config[active_idx]);
            const bottom_contents = config[active_idx].render();
            bottom.html(bottom_contents);
        }

        function update() {
            const item = config[active_idx];

            if (item.update) {
                item.update();
                return;
            }

            // If our item does not know how to update itself,
            // just re-render the whole thing.
            bottom.empty();
            const bottom_contents = item.render();
            bottom.html(bottom_contents);
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
