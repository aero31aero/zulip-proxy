window.compose_box = (() => {
    function build_for_user(user) {
        const div = $('<div>');

        const box = $('<textarea>').val('');
        const button = $('<button>').text('Send PM');

        button.on('click', async () => {
            const loader = $('<div>').text('sending...');

            div.append(loader);

            const data = {
                type: 'private',
                to: JSON.stringify([user.user_id]),
                content: box.val(),
            };
            box.val('');

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

    return {
        build_for_user: build_for_user,
    };
})();
