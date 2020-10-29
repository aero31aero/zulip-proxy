window.compose_box = (() => {
    // This only works for PMs now, and it assumes
    // its parent is pm_list.js.
    const drafts = new Map();

    function build_for_user(user_id) {
        const div = $('<div>');

        const box = $('<textarea>').val(drafts.get(user_id) || '');
        const button = $('<button>').text('Send PM');
        const loader = $('<div>');

        div.append(loader);

        box.on('change', () => {
            drafts.set(user_id, box.val());
        });

        const send = async () => {
            loader.text('sending...');
            const content = box.val();
            box.val('');
            drafts.delete(user_id);

            await window.transmit.send_pm(user_id, content);

            loader.text('sent!');
        };

        button.on('click', send);

        box.on('keyup', (event) => {
            if (event.keyCode === 13) {
                send();
            }
        });

        div.append(box);
        div.append(button);
        return div;
    }

    return {
        build_for_user: build_for_user,
    };
})();
