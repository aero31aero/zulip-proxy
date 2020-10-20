$(document).ready(async () => {
    const top_div = $('<div>');
    top_div.text(`${page_params.me.full_name} - `);
    const link = $('<a>', {
        text: `Server: ${page_params.app_url}`,
        href: page_params.app_url,
    });
    top_div.append(link);

    const pane_config = [
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

    $('#main').append(top_div);
    $('#main').append('<hr>');

    $('#main').append(main_pane);
});
