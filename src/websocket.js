const WebSocket = require('ws');
const client_events = require('./client_events');
const game = require('./game');

let seq = 0;

// Keep track of our websocket clients.
exports.clients = [];

exports.init = (server, session_parser, zulip) => {
    const wss = new WebSocket.Server({
        clientTracking: false,
        noServer: true,
    });

    server.on('upgrade', function (request, socket, head) {
        console.log('Parsing session from request...');

        session_parser(request, {}, () => {
            const user_id = request.session.user_id;

            if (!user_id) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
                return;
            }

            wss.handleUpgrade(request, socket, head, function (ws) {
                /*
                    Our websocket has 2-way traffic for games.

                        proxy server <-> (ws) <-> proxy client

                    For Zulip events, the data flows in one direction
                    between the proxy server and client:

                        Zulip server <-> (long poll) <-> proxy server -> (ws) -> client

                */
                const session = request.session;

                // We associate each websocket connection with an id based on
                // a simple incrementing sequence.  It's possible that the same
                // user can open up two different browser tabs that are associated
                // to the same session id, and we want to be able to tell those
                // websockets apart when we go to delete them.
                seq += 1;
                const id = seq;

                const client = {
                    id,
                    ws,
                    user_id,
                    session,
                };
                exports.clients.push(client);

                console.log(
                    `handleUpgrade for ${user_id} (session ${session.id}, id ${id})`
                );

                ws.on('close', () => {
                    console.log(
                        `user ${user_id} closed websocket for session ${session.id}`
                    );
                    exports.clients = exports.clients.filter((client) => {
                        return client.id !== id;
                    });
                    event_handler.stop();
                });

                ws.on('message', (message) => {
                    game.handle_message(client, message);
                });

                const event_handler = client_events.make_handler(zulip, client);

                event_handler.start();
            });
        });
    });
};
