window.users = (() => {
    function get_user_ids_by_recency(show_all = false) {
        const user_set = new Set();
        const messages = model().messages;
        for (let i = messages.length - 1; i >= 0; i--) {
            user_set.add(messages[i].sender_id);
        }
        if (show_all) {
            model().users.forEach((u) => {
                user_set.add(u.user_id);
            });
        }
        return Array.from(user_set).filter(
            (e) => _.get_user_by_id(e) !== undefined
        );
    }

    function make() {
        const users = model().users;
        const user_map = new Map();

        for (const user of users) {
            user_map.set(user.user_id, user);
        }

        function right_handler(user_id) {
            const user = user_map.get(user_id);

            return window.pm_view.make(user);
        }

        function key_to_label(user_id) {
            return user_map.get(user_id).full_name;
        }

        const opts = {
            key_to_label: key_to_label,
            right_handler: right_handler,
            get_keys: get_user_ids_by_recency,
        };

        const pane_widget = split_pane.make(opts);

        return {
            render: pane_widget.render,
            update: pane_widget.update,
        };
    }

    return {
        make: make,
    };
})();
