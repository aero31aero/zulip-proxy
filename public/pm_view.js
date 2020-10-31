window.pm_view = (() => {
    function make(user) {
        let div;
        let message_div;
        const user_id = user.user_id;

        function render() {
            div = $('<div>').addClass('pm-view');

            message_div = $('<div>').addClass('message-list');

            div.empty();
            div.append(message_div);
            div.append(compose_box.build_for_user(user_id));

            update();

            return div;
        }

        function update() {
            message_div.empty();

            const messages = _.find_pms_with(user_id);
            const new_messages = window.transmit.in_flight_messages(user_id);
            messages.push(...new_messages);

            const message_table = window.messages.build_message_table(messages);
            message_div.append(message_table);
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
