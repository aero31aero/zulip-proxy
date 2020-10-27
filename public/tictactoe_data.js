window.TicTacToeData = (() => {
    class TicTacToeData {
        square_values = new Map();
        num_filled = 0;
        game_over = false;
        x_player;
        y_player;
        game_id;

        constructor(_game_id) {
            this.game_id = _game_id;
        }

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
                    } else if (!this.y_player) {
                        this.y_player = user_id;
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

                    if (token === 'Y' && user_id != this.y_player) {
                        console.log('bad Y player');
                        return;
                    }

                    if (this.square_values.has(idx)) {
                        console.log('square already clicked');
                        return;
                    }

                    // this.waiting = sender_id === this.me;

                    this.square_values.set(idx, token);
                    this.num_filled += 1;

                    this.game_over = this.is_game_over();
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
