window.pm_view = (() => {
    function make(user) {
        let fetched = false;
        let message_data;

        async function get_message_data(user_id) {
            const narrow = JSON.stringify([
                {
                    operator: 'pm-with',
                    operand: [user_id],
                },
            ]);
            const response = await fetch(
                `/z/messages?num_before=5&anchor=newest&num_after=0&narrow=${narrow}`
            );
            message_data = await response.json();

            fetched = true;
        }

        let div;

        function render() {
            div = $('<div>');

            if (fetched) {
                console.log('already fetched!');
                div.html('building');
                populate(div);
                return div;
            }

            get_message_data(user.user_id).then(() => {
                populate(div);
            });

            div.html('loading');
            return div;
        }

        function populate(div) {
            const message_table = messages.build_message_table(
                message_data.messages
            );

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
