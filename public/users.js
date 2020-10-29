window.users = (() => {
    function make() {
        const members = model().users;

        const conf = members.map((user) => {
            const view_widget = window.pm_view.make(user);

            return {
                key: user.user_id,
                label: user.full_name,
                view: view_widget.render,
                update: view_widget.update,
            };
        });

        const pane_widget = split_pane.make(conf);

        return {
            render: pane_widget.render,
            update: pane_widget.update,
        };
    }

    return {
        make: make,
    };
})();
