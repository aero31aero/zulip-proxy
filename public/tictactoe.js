window.tictactoe = (() => {
    let active_game;
    let games;
    let active_game_id = 101;

    function render_board(widget_data, props) {
        // In the Zulip widget, we use templates, but
        // here we build up things in jQuery.
        function table(r1, r2, r3) {
            const table = $('<table>');
            table.attr('border', 1);
            table.css('border-collapse', 'collapse');

            table.append(r1);
            table.append(r2);
            table.append(r3);
            return table;
        }

        function tr(c1, c2, c3) {
            const tr = $('<tr>');
            tr.append(td(c1));
            tr.append(td(c2));
            tr.append(td(c3));

            return tr;
        }

        function td(cell) {
            const td = $('<td>');
            td.css('text-align', 'center');
            td.css('height', '55px');
            td.css('width', '55px');
            td.append(cell);
            return td;
        }

        function sq(idx) {
            const val = widget_data.squares[idx].val;

            // draw X or O
            if (val) {
                return $('<b>').text(val);
            }

            if (widget_data.game_over) {
                return '';
            }

            const button = $('<button>').html($('<b>'));

            button.text(idx);

            button.on('click', (e) => {
                e.stopPropagation();
                props.handle_click(idx);
            });

            return button;
        }

        return table(
            tr(sq(1), sq(2), sq(3)),
            tr(sq(4), sq(5), sq(6)),
            tr(sq(7), sq(8), sq(9))
        );
    }

    function populate(opts) {
        const elem = opts.elem;
        const tictactoe_data = opts.tictactoe_data;

        function handle_click(idx) {
            const data = tictactoe_data.handle.square_click.outbound(idx);
            window.ws.send(JSON.stringify(data));
        }

        const widget_data = tictactoe_data.get_widget_data();
        const status = $('<div>').html($('<b>').text(widget_data.move_status));
        const board = render_board(widget_data, {
            handle_click: handle_click,
        });

        const player = $('<div>');

        if (tictactoe_data.x_player) {
            player.append($('<div>').text(`X: ${tictactoe_data.x_player}`));
        }

        if (tictactoe_data.y_player) {
            player.append($('<div>').text(`Y: ${tictactoe_data.y_player}`));
        }

        elem.empty();
        elem.append(status);
        elem.append(board);
        elem.append(player);
    }

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
            populate(opts);
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
