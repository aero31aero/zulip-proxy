window.launcher = (() => {
    function make() {
        let buttons = [];

        function populate() {
            // this is hardcoded for now; we want a better system here.
            buttons.push({
                recipient: {
                    stream_id: model.Streams.by_name('oauth provider').id,
                    topic: 'meeting',
                },
                text: 'Oauth > Meeting',
            });
            buttons.push({
                recipient: model.Users.by_name('Rohitt Vashishtha'),
                text: 'PM with Rohitt',
            });
            buttons.push({
                recipient: model.Users.by_name('Steve Howell'),
                text: 'PM with Steve',
            });
            buttons.push({
                recipient: model.Users.by_name('Yash RE'),
                text: 'PM with Yash',
            });
        }

        function update() {
            // noop
        }

        function render() {
            const pane = $('<div>').addClass('launcher-pane');
            populate();
            pane.append($('<h1>').text('Quick Shortcuts'));
            buttons.forEach((item) => {
                const button = $('<button>').addClass('launcher-item');
                button.on('click', () => {
                    window.make_new_pane(item.recipient);
                });
                button.text(item.text);
                pane.append(button);
            });

            return pane;
        }

        return {
            render,
            update,
        };
    }

    return {
        make,
    };
})();
