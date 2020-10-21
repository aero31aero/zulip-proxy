window.users = (() => {
    let data;

    async function get_user_data() {
        if (data === undefined) {
            const response = await fetch('/z/users');
            data = await response.json();
        }

        return data;
    }

    async function get_message_data(user_id) {
        // TODO: cache data for user
        const narrow = JSON.stringify([
            {
                operator: 'pm-with',
                operand: [user_id],
            },
        ]);
        const response = await fetch(
            `/z/messages?num_before=5&anchor=newest&num_after=0&narrow=${narrow}`
        );
        const message_data = await response.json();
        return message_data;
    }

    function build_compose_box(user) {
        const div = $('<div>');

        const box = $('<textarea>').val('canned message');
        const button = $('<button>').text('Send PM');

        button.on('click', async () => {
            const loader = $('<div>').text('sending...');

            div.append(loader);

            const data = {
                type: 'private',
                to: JSON.stringify([user.user_id]),
                content: box.val(),
            };

            const response = await fetch('/z/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            loader.text('sent!');
        });

        div.append(box);
        div.append(button);
        return div;
    }

    function build_user_view(user) {
        return async () => {
            const data = await get_message_data(user.user_id);
            const message_table = messages.build_message_table(data.messages);

            const div = $('<div>');
            div.append(message_table);
            div.append(build_compose_box(user));

            return div;
        };
    }

    async function render() {
        const data = await get_user_data();
        const members = data.members;

        members.sort((a, b) => a.full_name.localeCompare(b.full_name));

        const conf = members.map((user) => ({
            label: user.full_name,
            view: build_user_view(user),
        }));

        // TODO: persist the widget
        const pane_widget = split_pane.make(conf);
        const pane = await pane_widget.render();

        return pane;
    }

    return {
        render: render,
    };
})();
