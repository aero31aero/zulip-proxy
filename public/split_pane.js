window.split_pane = (() => {
    async function render(config) {
        const pane = $('<div>');

        const left = $('<div>');
        const right = $('<div>');

        pane.css('display', 'flex');

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
