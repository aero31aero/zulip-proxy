window.pm_view = (() => {
    function make(user) {
        let fetched = false;
        let message_data;

        let div;

        function render() {
            div = $('<div>');
            message_data = _.find_pms_with(user.user_id);
            div.html('building');
            populate(div);
            return div;
        }

        function populate(div) {
            const message_table = messages.build_message_table(message_data);

            div.empty();
            div.append(message_table);
            div.append(compose_box.build_for_user(user));
        }

        return {
            render: render,
        };
    }

    return {
        make: make,
    };
})();
