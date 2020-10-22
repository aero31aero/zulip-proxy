window.pm_view = (() => {
    function make(user) {
        async function get_message_data(user_id) {
            // TODO: cache data for user
            const narrow = JSON.stringify([
                {
                    operator: 'pm-with',
                    operand: [user_id],
                },
            ]);
            const response = await fetch(
                `/z/messages?num_before=5&anchor=newest&num_after=0&narrow=${narrow}`
            );
            const message_data = await response.json();
            return message_data;
        }

        async function render() {
            const data = await get_message_data(user.user_id);
            const message_table = messages.build_message_table(data.messages);

            const div = $('<div>');
            div.append(message_table);
            div.append(compose_box.build_for_user(user));

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
