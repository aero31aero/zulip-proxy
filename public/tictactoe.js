window.tictactoe = (() => {
    // This is roughly based on:
    // https://github.com/zulip/zulip/blob/master/static/js/tictactoe_widget.js

    let game_info;
    let ws;

    class TicTacToeData {
        // TODO: Have multiple players.
        square_values = new Map();
        num_filled = 0;
        game_over = false;

        is_game_over() {
            const lines = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
                [1, 4, 7],
                [2, 5, 8],
                [3, 6, 9],
                [1, 5, 9],
                [7, 5, 3],
            ];

            const line_won = (line) => {
                const token = this.square_values.get(line[0]);

                if (!token) {
                    return false;
                }

                return (
                    this.square_values.get(line[1]) === token &&
                    this.square_values.get(line[2]) === token
                );
            };

            const board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const filled = (i) => this.square_values.get(i);

            return lines.some(line_won) || board.every(filled);
        }

        get_widget_data() {
            const square = (i) => ({
                val: this.square_values.get(i),
                // disabled: this.waiting || this.square_values.get(i) || this.game_over,
            });

            const squares = [
                null,
                square(1),
                square(2),
                square(3),
                square(4),
                square(5),
                square(6),
                square(7),
                square(8),
                square(9),
            ];

            const token = this.num_filled % 2 === 0 ? 'X' : 'O';
            let move_status = token + "'s turn";

            if (this.game_over) {
                move_status = 'Game over!';
            }

            const widget_data = {
                squares: squares,
                move_status: move_status,
                game_over: this.game_over,
            };

            return widget_data;
        }

        handle = {
            square_click: {
                outbound: (idx) => {
                    const event = {
                        type: 'square_click',
                        idx: idx,
                        num_filled: this.num_filled,
                    };
                    return event;
                },

                inbound: (data) => {
                    const idx = data.idx;

                    if (data.num_filled !== this.num_filled) {
                        throw Error('out of sync', data.num_filled);
                        return;
                    }

                    const token = this.num_filled % 2 === 0 ? 'X' : 'O';

                    if (this.square_values.has(idx)) {
                        return;
                    }

                    // this.waiting = sender_id === this.me;

                    this.square_values.set(idx, token);
                    this.num_filled += 1;

                    this.game_over = this.is_game_over();
                },
            },
        };

        handle_event(data) {
            const type = data.type;
            if (this.handle[type]) {
                this.handle[type].inbound(data);
            }
        }
    }

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
        const callback = opts.callback;
        const tictactoe_data = opts.tictactoe_data;

        function handle_click(idx) {
            const data = tictactoe_data.handle.square_click.outbound(idx);
            callback(data);
        }

        const widget_data = tictactoe_data.get_widget_data();
        const status = $('<div>').html($('<b>').text(widget_data.move_status));
        const board = render_board(widget_data, {
            handle_click: handle_click,
        });

        const player_greeting = `hello ${game_info.user.name} (${game_info.user.user_id})`;
        const player = $('<div>').text(player_greeting);

        elem.empty();
        elem.append(status);
        elem.append(board);
        elem.append(player);
    }

    function make() {
        const div = $('<div>');
        const tictactoe_data = new TicTacToeData();

        const opts = {
            elem: div,
            callback: (event) => {
                // try to send event to socket
                console.info('sending', event);
                ws.send(JSON.stringify(event));

                // handle event internally -- we
                // are not actually using the server
                // for game play yet; we are just
                // having the server broadcast the
                // events
                tictactoe_data.handle_event(event);
                render();
            },
            tictactoe_data: tictactoe_data,
        };

        function render() {
            populate(opts);
            return div;
        }

        return {
            render: render,
        };
    }

    function initialize(opts) {
        game_info = opts.params;
        ws = opts.ws;

        ws.onmessage = (message) => {
            const event = JSON.parse(message.data);
            console.log('got message', event);
        };
    }

    return {
        initialize: initialize,
        make: make,
    };
})();
