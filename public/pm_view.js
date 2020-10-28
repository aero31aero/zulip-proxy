window.pm_view = (() => {
    function make(user) {
        let div;
        let message_div;

        function render() {
            div = $('<div>').addClass('message-list');
            const message_data = _.find_pms_with(user.user_id);

            message_div = $('<div>');

            const message_table = messages.build_message_table(message_data);
            message_div.append(message_table);

            div.empty();
            div.append(compose_box.build_for_user(user));
            div.append(message_div);

            return div;
        }

        return {
            render: render,
        };
    }

    return {
        make: make,
    };
})();
