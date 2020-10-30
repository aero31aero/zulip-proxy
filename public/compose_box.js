window.compose_box = (() => {
    // This only works for PMs now, and it assumes
    // its parent is pm_list.js.
    const drafts = new Map();

    function build_for_user(user_id) {
        const div = $('<div>').addClass('compose-box');

        const draft = drafts.get(user_id) || '';

        const box = $('<textarea>').val(draft).attr('rows', 4);

        const send_button = $('<button>').text('Send PM');

        send_button.prop('disabled', !draft);

        const send = () => {
            console.trace();
            const content = box.val().trim();
            if (content === '') {
                // we cannot send empty messages;
                console.warn('did not expect button to be enabled');
                return;
            }

            box.val('');
            box.focus();
            drafts.delete(user_id);
            send_button.prop('disabled', true);

            window.transmit.send_pm(user_id, content);
        };

        send_button.on('click', send);

        box.on('keyup', (event) => {
            if (event.keyCode === 13) {
                send();
                return;
            }

            const content = box.val().trim();
            drafts.set(user_id, content);
            send_button.prop('disabled', !content);
        });

        div.append(box);
        div.append(send_button);

        return div;
    }

    return {
        build_for_user: build_for_user,
    };
})();
