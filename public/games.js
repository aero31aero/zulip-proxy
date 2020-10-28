window.games = (() => {
    let model = new Map();
    let pane_widget;
    let div;

    function game_conf([game_id, data_handler]) {
        function render() {
            const opts = {
                tictactoe_data: data_handler,
            };

            return window.tictactoe_view.render(opts);
        }

        return {
            label: game_id,
            view: render,
        };
    }

    function make() {
        div = $('<div>');

        const conf = Array.from(model, game_conf);
        pane_widget = split_pane.make(conf, 'games');

        function render() {
            populate();
            return div;
        }

        return {
            render: render,
        };
    }

    function populate() {
        if (!div) {
            console.info('tried to populate before div was made');
            return;
        }
        div.empty();
        div.append(pane_widget.render());
    }

    function handle_event(event) {
        const game_id = event.message.game_id;
        const data_handler = model.get(game_id);

        if (!data_handler) {
            console.log(`missing data handler for game ${game_id}`);
            return;
        }

        data_handler.handle_event(event);
        populate();
    }

    function initialize(games) {
        console.info('initialize games', games);

        for (const [game_id, game] of Object.entries(games)) {
            const data_handler = new window.TicTacToeData(game_id);
            for (const event of game.events) {
                data_handler.handle_event(event);
            }

            model.set(game_id, data_handler);
        }
    }

    return {
        initialize: initialize,
        make: make,
        handle_event: handle_event,
    };
})();
