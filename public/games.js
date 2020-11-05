window.games = (() => {
    let model = new Map();

    function right_handler(game_id) {
        const data_handler = model.get(game_id);

        function render() {
            const opts = {
                tictactoe_data: data_handler,
            };

            return window.tictactoe_view.render(opts);
        }

        return {
            render,
        };
    }

    function name(user_id) {
        if (user_id === window.model.main().state.user_id) {
            return 'me';
        }

        const user = window._.get_user_by_id(user_id);
        return user.full_name;
    }

    function key_to_label(game_id) {
        // TODO: show actual players
        let label = game_id;

        const data = model.get(game_id);

        if (data.x_player) {
            label += ' ' + name(data.x_player);
        }

        if (data.o_player) {
            label += ' vs. ' + name(data.o_player);
        }

        return label;
    }

    function get_keys() {
        const game_ids = Array.from(model.keys());
        return game_ids;
    }

    function make_view() {
        const div = $('<div>');

        const opts = {
            get_keys,
            key_to_label,
            right_handler,
        };

        const pane_widget = split_pane.make(opts);

        function render() {
            div.empty();
            div.append(pane_widget.render());
            return div;
        }

        return {
            render,
        };
    }

    function handle_start_game(game_id) {
        if (model.get(game_id)) {
            console.warn(`got dup start_game for game ${game_id}`);
            return;
        }

        console.info('create new handler');
        const data_handler = new window.TicTacToeData(game_id);
        model.set(game_id, data_handler);
        window._.redraw();
    }

    function handle_event(event) {
        const game_id = event.message.game_id;

        if (event.message.type === 'start_game') {
            console.info('handle start_game');
            handle_start_game(game_id);
            return;
        }

        const data_handler = model.get(game_id);

        if (!data_handler) {
            console.log(`missing data handler for game ${game_id}`);
            return;
        }

        data_handler.handle_event(event);
        window._.redraw();
    }

    function initialize(games) {
        for (const [game_id, game] of Object.entries(games)) {
            const data_handler = new window.TicTacToeData(game_id);
            for (const event of game.events) {
                data_handler.handle_event(event);
            }

            model.set(game_id, data_handler);
        }
    }

    return {
        initialize,
        make_view,
        handle_event,
    };
})();
