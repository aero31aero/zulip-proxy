window.split_pane = (() => {
    async function render(config) {
        const pane = $('<div>');

        const left = $('<div>');
        const right = $('<div>');

        pane.css('display', 'flex');

        const search = $('<input>').attr({ type: 'text' });
        const search_div = $('<div>');
        search_div.append(search);
        left.append(search_div);

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

            left.append(div);

            button.on('click', async () => {
                right.html('loading...');
                const contents = await conf.view();
                right.empty();
                right.append(contents);
            });

            button.css('width', '90%');
        }

        const left_contents = await config[0].view();
        right.html(left_contents);

        pane.append(left);
        pane.append(right);

        return pane;
    }

    return {
        render: render,
    };
})();
