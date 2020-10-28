window.users = (() => {
    function make() {
        const conf = () => {
            const members = model().users;
            return members.map((user) => {
                const view_widget = window.pm_view.make(user);

                return {
                    label: user.full_name,
                    view: view_widget,
                };
            });
        };

        const pane_widget = split_pane.make(conf, 'users');

        function render() {
            const pane = pane_widget.render();
            return pane;
        }

        return {
            render: render,
        };
    }

    return {
        make: make,
    };
})();
