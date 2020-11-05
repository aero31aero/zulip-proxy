window.compose_box = (() => {
    // This only works for PMs now, and it assumes
    // its parent is pm_list.js.
    const drafts = new Map();

    function build(recipient, helpers) {
        const is_pm = !!recipient.user_id; // coerce user_id to boolean'

        function get_display_recipient(recipient) {
            if (is_pm) {
                return window._.get_user_by_id(recipient.user_id).full_name;
            } else {
                return `# ${recipient.stream} > ${recipient.topic}`;
            }
        }

        function enter_goodbye_modal() {
            const display_recipient = get_display_recipient(recipient);

            const div = $('<div>');

            const cancel_button = $('<button>').text('No (cancel)');
            cancel_button.attr('class', 'cancel-red');

            cancel_button.on('click', () => {
                helpers.exit_modal();
            });

            const ok_button = $('<button>').text('Yes (and say goodbye)');
            ok_button.attr('class', 'ok-green');

            ok_button.on('click', () => {
                window.transmit.send_message(recipient, 'goodbye!');
                helpers.exit_modal();
            });

            const button_div = $('<div>').attr('class', 'button-row');

            button_div.append(cancel_button);
            button_div.append(ok_button);

            div.append(
                $('<p>').text(`Are you done talking to ${display_recipient}?`)
            );
            div.append(button_div);
            div.append(
                $('<p>').text(
                    'todo: give options to customize goodbye and to mark messages as read'
                )
            );

            helpers.enter_modal(div, () => {
                ok_button.focus();
            });
        }

        const div = $('<div>').addClass('compose-box');

        const draft = drafts.get(JSON.stringify(recipient)) || '';

        const box = $('<textarea>').val(draft).attr('rows', 4);

        const send_button = $('<button>').text('Send PM');
        const bye_button = $('<button>').text('Say goodbye');

        send_button.prop('disabled', !draft);

        function handle_box_keyup(event) {
            const content = box.val().trim();
            drafts.set(JSON.stringify(recipient), content);
            send_button.prop('disabled', !content);
            bye_button.prop('disabled', !!content);
        }

        function clear_box() {
            drafts.delete(JSON.stringify(recipient));
            box.off('keyup');
            box.val('');
            send_button.prop('disabled', true);
            bye_button.prop('disabled', false);
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

        bye_button.on('click', () => {
            if (!is_pm) return; // don't do anything for stream/topic.
            enter_goodbye_modal();
        });

        div.append(box);
        div.append(send_button);
        div.append(bye_button);

        return div;
    }

    return {
        build,
    };
})();
