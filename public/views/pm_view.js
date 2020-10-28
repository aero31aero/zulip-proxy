window.pm_view = (() => {
    function make(user) {
        let fetched = false;
        let message_data;

        let div;

        function render() {
            div = $('<div>').addClass('message-list');
            message_data = _.find_pms_with(user.user_id);
            div.html('building');
            populate(div);
            return div;
        }

        function populate(div) {
            const message_table = messages.build_message_table(message_data);

            div.empty();
            div.append(compose_box.build_for_user(user));
            div.append(message_table);
        }

        return {
            render: render,
        };
    }

    return {
        make: make,
    };
})();