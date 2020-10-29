window.pm_view = (() => {
    function make(user) {
        let div;
        let message_div;
        const user_id = user.user_id;

        function render() {
            div = $('<div>').addClass('message-list');

            message_div = $('<div>');
            update_messages();

            div.empty();
            div.append(compose_box.build_for_user(user_id));
            div.append(message_div);

            return div;
        }

        function update_messages() {
            message_div.empty();

            const message_data = _.find_pms_with(user_id);
            const message_table = messages.build_message_table(message_data);
            message_div.append(message_table);
        }

        return {
            render: render,
            update: update_messages,
        };
    }

    return {
        make: make,
    };
})();
