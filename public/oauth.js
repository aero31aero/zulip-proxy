$(document).ready(async () => {
    const age_div = $('<div>');
    age_div.text(`session age: ${page_params.session_age}`);

    const me_div = $('<div>');
    me_div.text(page_params.me.full_name);

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

    $('#main').append(age_div);
    $('#main').append(me_div);
    $('#main').append('<hr>');

    $('#main').append(main_pane);
});
