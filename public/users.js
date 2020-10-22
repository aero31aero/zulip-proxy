window.users = (() => {
    function make() {
        const members = model().users;

        const conf = members.map((user) => {
            const view_widget = window.pm_view.make(user);

            return {
                label: user.full_name,
                view: view_widget.render,
            };
        });

        const pane_widget = split_pane.make(conf, 'users');

        async function render() {
            const pane = await pane_widget.render();

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
