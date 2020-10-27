window.tictactoe = (() => {
    let active_game;
    let games;
    let active_game_id = 101;

    function make() {
        const div = $('<div>');
        const game = games[active_game_id];

        const tictactoe_data = new window.TicTacToeData(active_game_id);

        for (const event of game.events) {
            tictactoe_data.handle_event(event);
        }

        const opts = {
            elem: div,
            tictactoe_data: tictactoe_data,
        };

        function render() {
            window.tictactoe_view.make(opts);
            return div;
        }

        function handle_event(event) {
            tictactoe_data.handle_event(event);
            render();
        }

        active_game = {
            render: render,
            handle_event: handle_event,
        };

        return active_game;
    }

    function handle_event(event) {
        active_game.handle_event(event);
    }

    function initialize(_games) {
        console.info('initialize games', _games);
        games = _games;
    }

    return {
        initialize: initialize,
        make: make,
        handle_event: handle_event,
    };
})();
