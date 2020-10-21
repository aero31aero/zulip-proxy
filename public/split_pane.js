window.split_pane = (() => {
    function make(config, name) {
        async function render() {
            const pane = $('<div>')
                .addClass('split-pane')
                .attr('id', `pane-${name}`);

            const left = $('<div>').addClass('left');
            const right = $('<div>').addClass('right');

            pane.css('display', 'flex');

            const search = $('<input>').attr({ type: 'text' });
            const search_div = $('<div>').addClass('search');
            const items_div = $('<div>').addClass('items');
            search_div.append(search);
            left.append(search_div);
            left.append(items_div);

            search.on('keyup', (evt) => {
                const val = search.val().toLowerCase();
                const buttons = left.find('button');
                buttons.show();
                buttons.each(function () {
                    const button = $(this);
                    const text = button.text().toLowerCase();
                    if (!text.includes(val)) {
                        button.hide();
                    }
                });
            });

            for (const conf of config) {
                const button = $('<button>').text(conf.label);
                const div = $('<div>').html(button);

                items_div.append(div);

                button.on('click', async function () {
                    $(this)
                        .parent()
                        .siblings()
                        .find('button')
                        .css('background-color', '#008CBA');
                    $(this).css('background-color', '#4CAF50');
                    right.html('loading...');
                    const contents = await conf.view();
                    right.empty();
                    right.append(contents);
                });

                button.css('width', '90%');
            }

            left.find('button').first().css('background-color', '#4CAF50');

            const left_contents = await config[0].view();
            right.html(left_contents);

            pane.append(left);
            pane.append(right);

            return pane;
        }

        return {
            render: render,
        };
    }

    return {
        make: make,
    };
})();
