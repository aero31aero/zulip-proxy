window.users = (() => {
    function get_user_ids_by_recency() {
        const user_set = new Set();
        const messages = model.Messages.filter((m) => m.type === 'private');
        for (let i = messages.length - 1; i >= 0; i--) {
            const recp = messages[i].display_recipient;
            if (recp.length === 2) {
                const other_recipient = recp.find((recipient) => {
                    return !_.is_me(recipient.id);
                });
                user_set.add(other_recipient.id);
            } else if (recp.length === 1 && _.is_me(recp[0].id)) {
                user_set.add(recp[0].id);
            }
        }
        return Array.from(user_set).filter(
            (id) => model.Users.by_id_maybe(id) !== undefined
        );
    }

    function make_view() {
        const users = model.Users.list();
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
            key_to_label,
            right_handler,
            get_keys: get_user_ids_by_recency,
            hide_left: true,
        };

        const pane_widget = split_pane.make(opts);

        return pane_widget;
    }

    return {
        make_view,
    };
})();
