window.compose_box = (() => {
    const drafts = new Map();

    function build_for_user(user_id) {
        const div = $('<div>');

        const box = $('<textarea>').val(drafts.get(user_id) || '');
        const button = $('<button>').text('Send PM');

        box.on('change', () => {
            drafts.set(user_id, box.val());
        });

        button.on('click', async () => {
            const loader = $('<div>').text('sending...');

            div.append(loader);

            const data = {
                type: 'private',
                to: JSON.stringify([user_id]),
                content: box.val(),
            };

            box.val('');
            drafts.delete(user_id);

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
