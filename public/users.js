window.users = (() => {
    function make() {
        const users = model().users;
        const user_map = new Map();

        for (const user of users) {
            user_map.set(user.user_id, user);
        }

        const user_ids = Array.from(user_map.keys());

        function right_handler(user_id) {
            const user = user_map.get(user_id);

            const view_widget = window.pm_view.make(user);

            return {
                view: view_widget.render,
                update: view_widget.update,
            };
        }

        function key_to_label(user_id) {
            return user_map.get(user_id).full_name;
        }

        const opts = {
            keys: user_ids,
            key_to_label: key_to_label,
            right_handler: right_handler,
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
