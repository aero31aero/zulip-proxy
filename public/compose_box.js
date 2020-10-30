window.compose_box = (() => {
    // This only works for PMs now, and it assumes
    // its parent is pm_list.js.
    const drafts = new Map();

    function build_for_user(user_id) {
        const div = $('<div>').addClass('compose-box');

        const box = $('<textarea>')
            .val(drafts.get(user_id) || '')
            .attr('rows', 4);
        const send_button = $('<button>').text('Send PM');

        box.on('change', () => {
            drafts.set(user_id, box.val());
        });

        const send = () => {
            const content = box.val();
            if (content === '') {
                // we cannot send empty messages;
                return;
            }

            box.val('');
            drafts.delete(user_id);
            box.focus();

            window.transmit.send_pm(user_id, content);
        };

        send_button.on('click', send);

        box.on('keyup', (event) => {
            if (event.keyCode === 13) {
                send();
            }
        });

        div.append(box);
        div.append(send_button);

        return div;
    }

    return {
        build_for_user: build_for_user,
    };
})();
