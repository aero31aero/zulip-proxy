const WebSocket = require('ws');
const client_events = require('./client_events');
const game = require('./game');

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

                const client = {
                    ws,
                    user_id,
                    session,
                };
                exports.clients.push(client);

                console.log(
                    `handleUpgrade for ${user_id} (session ${session.id})`
                );

                ws.on('close', () => {
                    // TODO: remove from list
                    console.log('closed');
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
