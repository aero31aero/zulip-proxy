window.compose_box = (() => {
    // This only works for PMs now, and it assumes
    // its parent is pm_list.js.
    const drafts = new Map();

    function build(recipient, helpers) {
        const is_pm = !!recipient.user_id; // coerce user_id to boolean

        function get_display_recipient(recipient) {
            if (is_pm) {
                return window._.get_user_by_id(recipient.user_id).full_name;
            } else {
                return `# ${model.Streams.by_id(recipient.stream_id).name} > ${
                    recipient.topic
                }`;
            }
        }

        const div = $('<div>').addClass('compose-box');

        const draft = drafts.get(JSON.stringify(recipient)) || '';

        const box = $('<textarea>').val(draft).attr('rows', 4);

        const send_button = $('<button>').text('Send');

        send_button.prop('disabled', !draft);

        function handle_box_keyup(event) {
            const content = box.val().trim();
            drafts.set(JSON.stringify(recipient), content);
            send_button.prop('disabled', !content);
        }

        function clear_box() {
            drafts.delete(JSON.stringify(recipient));
            box.off('keyup');
            box.val('');
            send_button.prop('disabled', true);
            box.focus();
            box.on('keyup', handle_box_keyup);
        }

        const send = () => {
            const content = box.val().trim();
            if (content === '') {
                // we cannot send empty messages;
                console.warn('did not expect button to be enabled');
                return;
            }

            clear_box();
            transmit.send_message(recipient, content);
        };

        send_button.on('click', send);
        box.on('keyup', handle_box_keyup);

        const compose_target = $('<p>');
        compose_target.text(`To: ${get_display_recipient(recipient)}`);

        div.append(compose_target);
        div.append(box);
        div.append(send_button);

        return div;
    }

    return {
        build,
    };
})();
