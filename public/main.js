window.main = (() => {
    async function render(page_params) {
        const top_div = $('<div>');
        top_div.text(`${page_params.me.full_name} - `);
        const link = $('<a>', {
            text: `Server: ${page_params.app_url}`,
            href: page_params.app_url,
        });
        top_div.append(link);

        const pane_config = [
            {
                label: 'Tic Tac Toe',
                view: () => window.tictactoe.render(),
            },
            {
                label: 'Users',
                view: () => window.users.render(),
            },
            {
                label: 'Messages',
                view: () => window.messages.render(),
            },
            {
                label: 'Streams',
                view: () => window.streams.render(),
            },
        ];

        const main_pane = await window.split_pane.render(pane_config);

        const page = $('<div>');
        page.append(top_div);
        page.append('<hr>');
        page.append(main_pane);

        return page;
    }

    return {
        render: render,
    };
})();
