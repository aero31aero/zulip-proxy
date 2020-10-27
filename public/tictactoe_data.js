window.TicTacToeData = (() => {
    class TicTacToeData {
        square_values = new Map();
        num_filled = 0;
        x_player;
        o_player;
        game_id;

        constructor(_game_id) {
            this.game_id = _game_id;
        }

        me() {
            return window._.me().user_id;
        }

        game_result() {
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

            for (const line of lines) {
                const token = this.square_values.get(line[0]);

                if (!token) {
                    continue;
                }

                const victory =
                    this.square_values.get(line[1]) === token &&
                    this.square_values.get(line[2]) === token;

                if (!victory) {
                    continue;
                }

                // The logic here is slightly convoluted, so
                // that we account for somebody playing herself,
                // in which case we want her to win regardless.
                // Refactorings are welcome.
                if (token === 'X' && this.x_player == this.me()) {
                    return 'me';
                } else if (token === 'O' && this.o_player == this.me()) {
                    return 'me';
                } else {
                    return 'them';
                }
            }

            const board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const filled = (i) => this.square_values.get(i);

            if (board.every(filled)) {
                return 'tie';
            }
        }

        get_widget_data() {
            const square = (i) => ({
                val: this.square_values.get(i),
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

            const result = this.game_result();

            // We may eventually want to let the view control
            // the messaging, but this is fine for now.
            if (result === 'me') {
                move_status = 'Game over! YOU WON!';
            } else if (result === 'them') {
                move_status = 'Game over! Sorry, you lost.';
            } else if (result === 'tie') {
                move_status = 'Game over. Looks like a tie.';
            }

            const active_player = token == 'X' ? this.x_player : this.o_player;
            const is_my_turn = !active_player || active_player === this.me();

            const widget_data = {
                squares: squares,
                move_status: move_status,
                is_my_turn: is_my_turn,
                game_over: result !== undefined,
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
                        game_id: this.game_id,
                    };
                    return event;
                },

                inbound: (data, user_id) => {
                    const idx = data.idx;

                    if (![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(idx)) {
                        console.log('bad square');
                        return;
                    }

                    if (!this.x_player) {
                        this.x_player = user_id;
                    } else if (!this.o_player) {
                        this.o_player = user_id;
                    }

                    if (data.num_filled !== this.num_filled) {
                        console.log('out of sync', data.num_filled);
                        return;
                    }

                    const token = this.num_filled % 2 === 0 ? 'X' : 'O';

                    if (token === 'X' && user_id != this.x_player) {
                        console.log('bad X player');
                        return;
                    }

                    if (token === 'O' && user_id != this.o_player) {
                        console.log('bad O player');
                        return;
                    }

                    if (this.square_values.has(idx)) {
                        console.log('square already clicked');
                        return;
                    }

                    this.square_values.set(idx, token);
                    this.num_filled += 1;
                },
            },
        };

        handle_event(payload) {
            const user_id = payload.user_id;
            const data = payload.message;
            console.info('payload', payload);
            console.info('data', data);

            const type = data.type;
            if (this.handle[type]) {
                this.handle[type].inbound(data, user_id);
            }
        }
    }

    return TicTacToeData;
})();
