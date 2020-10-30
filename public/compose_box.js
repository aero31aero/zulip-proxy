window.compose_box = (() => {
    // This only works for PMs now, and it assumes
    // its parent is pm_list.js.
    const drafts = new Map();

    function build_for_user(user_id) {
        const div = $('<div>').addClass('compose-box');

        const draft = drafts.get(user_id) || '';

        const box = $('<textarea>').val(draft).attr('rows', 4);

        const send_button = $('<button>').text('Send PM');
        const afk_button = $('<button>').text('AFK');

        send_button.prop('disabled', !draft);
        afk_button.prop('disabled', !!draft);

        const send = () => {
            console.trace();
            const content = box.val().trim();
            if (content === '') {
                // we cannot send empty messages;
                console.warn('did not expect button to be enabled');
                return;
            }

            box.val('');

            // Not focusing here prevents the double-send, which seems
            // to imply that focus generates keyup=13
            // box.focus();
            drafts.delete(user_id);
            send_button.prop('disabled', true);

            window.transmit.send_pm(user_id, content);
        };

        send_button.on('click', send);

        afk_button.on('click', () => {
            const content = box.val().trim();
            if (content === '') {
                // we cannot send empty messages;
                console.warn('did not expect box to have contents');
                return;
            }

            drafts.delete(user_id);
            box.val('/me is about to go afk');
            send_button.prop('disabled', false);
            afk_button.prop('disabled', true);
        });

        box.on('keyup', (event) => {
            if (event.keyCode === 13) {
                send();
                return;
            }

            const content = box.val().trim();
            drafts.set(user_id, content);
            send_button.prop('disabled', !content);
            afk_button.prop('disabled', !!content);
        });

        div.append(afk_button);
        div.append(box);
        div.append(send_button);

        return div;
    }

    return {
        build_for_user: build_for_user,
    };
})();
