window.pm_view = (() => {
    function make(recipient) {
        if (recipient.type !== 'private') {
            console.error('illegal recipient');
        }

        let div;
        let message_div;
        const user_id = recipient.user_id;

        function render() {
            div = $('<div>').addClass('pm-view');

            message_div = $('<div>')
                .addClass('message-list')
                .addClass('flex-main');

            div.empty();
            div.append(message_div);
            div.append(compose_box.build(recipient));

            update();

            return div;
        }

        function update() {
            message_div.empty();

            const messages = _.find_pms_with(user_id);
            const new_messages = window.transmit.in_flight_messages(recipient);
            messages.push(...new_messages);

            const message_table = window.messages.build_message_table(messages);
            message_div.append(message_table);

            const full_name = window._.full_name_from_user_id(user_id);
            _.set_pane_title(`Chat with ${full_name}`, message_div);
        }

        return {
            render,
            update,
        };
    }

    return {
        make,
    };
})();
