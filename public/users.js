window.users = (() => {
    let data;

    async function get_user_data() {
        if (data === undefined) {
            const response = await fetch('/z/users');
            data = await response.json();
        }

        return data;
    }

    async function get_message_data(user_id) {
        // TODO: cache data for user
        const narrow = JSON.stringify([
            {
                operator: "pm-with",
                operand: [user_id],
            }
        ]);
        const response = await fetch(
            `/z/messages?num_before=5&anchor=newest&num_after=0&narrow=${narrow}`
        );
        const message_data = await response.json();
        return message_data;
    }

    function build_user_view(user) {
        return async () => {
            const data = await get_message_data(user.user_id);
            return messages.build_message_table(data.messages);
        };
    }

    async function render() {
        const data = await get_user_data();
        const members = data.members;

        members.sort((a, b) => a.full_name.localeCompare(b.full_name));

        const conf = members.map((user) => ({
            label: user.full_name,
            view: build_user_view(user),
        }));

        const pane = await split_pane.render(conf);

        return pane;
    }

    return {
        render: render,
    };
})();
