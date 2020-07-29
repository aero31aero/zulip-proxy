(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = 'function' == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw ((a.code = 'MODULE_NOT_FOUND'), a);
                }
                var p = (n[i] = { exports: {} });
                e[i][0].call(
                    p.exports,
                    function (r) {
                        var n = e[i][1][r];
                        return o(n || r);
                    },
                    p,
                    p.exports,
                    r,
                    e,
                    n,
                    t
                );
            }
            return n[i].exports;
        }
        for (
            var u = 'function' == typeof require && require, i = 0;
            i < t.length;
            i++
        )
            o(t[i]);
        return o;
    }
    return r;
})()(
    {
        1: [
            function (require, module, exports) {
                (function (Buffer) {
                    'use strict';

                    var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

                    var _instanceof2 = _interopRequireDefault(
                        require('@babel/runtime/helpers/instanceof')
                    );

                    var helper = require('./helper');

                    function api(baseUrl, config, method, params) {
                        var url = baseUrl;
                        var auth = Buffer.from(
                            ''
                                .concat(config.username, ':')
                                .concat(config.apiKey)
                        ).toString('base64');
                        var authHeader = 'Basic '.concat(auth);
                        var options = {
                            method: method,
                            headers: {
                                Authorization: authHeader,
                            },
                        };

                        if (method === 'POST') {
                            options.body = new helper.FormData();
                            Object.keys(params).forEach(function (key) {
                                var data = params[key];

                                if (Array.isArray(data)) {
                                    data = JSON.stringify(data);
                                }

                                options.body.append(key, data);
                            });
                        } else if (params) {
                            var generateQueryParam = function generateQueryParam(
                                key
                            ) {
                                return ''.concat(key, '=').concat(params[key]);
                            };

                            var queryParams = Object.keys(params).map(
                                generateQueryParam
                            );
                            url = ''
                                .concat(url, '?')
                                .concat(queryParams.join('&'));
                        }

                        var response = null;
                        return helper
                            .fetch(url, options)
                            .then(function (res) {
                                response = res;
                                return res.json();
                            })
                            ['catch'](function (e) {
                                if (
                                    (0, _instanceof2['default'])(e, SyntaxError)
                                ) {
                                    // We probably got a non-JSON response from the server.
                                    // We should inform the user of the same.
                                    var message =
                                        'Server Returned a non-JSON response.';

                                    if (response.status === 404) {
                                        message += ' Maybe endpoint: '
                                            .concat(method, ' ')
                                            .concat(
                                                response.url.replace(
                                                    config.apiURL,
                                                    ''
                                                ),
                                                " doesn't exist."
                                            );
                                    } else {
                                        message +=
                                            ' Please check the API documentation.';
                                    }

                                    var error = new Error(message);
                                    error.res = response;
                                    throw error;
                                }

                                throw e;
                            });
                    }

                    module.exports = api;
                }.call(this, require('buffer').Buffer));
            },
            {
                './helper': 3,
                '@babel/runtime/helpers/instanceof': 19,
                '@babel/runtime/helpers/interopRequireDefault': 20,
                buffer: 24,
            },
        ],
        2: [
            function (require, module, exports) {
                'use strict';

                var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

                var _regenerator = _interopRequireDefault(
                    require('@babel/runtime/regenerator')
                );

                var _asyncToGenerator2 = _interopRequireDefault(
                    require('@babel/runtime/helpers/asyncToGenerator')
                );

                var queues = require('./resources/queues');

                var events = require('./resources/events');

                function sleep(ms) {
                    // TODO add jitter.
                    return new Promise(function (resolve) {
                        return setTimeout(resolve, ms);
                    });
                }

                function eventsWrapper(config) {
                    var z = {
                        queues: queues(config),
                        events: events(config),
                    };

                    function logError(error) {
                        console.log(
                            'zulip-js: Error while communicating with server:',
                            error
                        ); // eslint-disable-line no-console
                    }

                    function registerQueue() {
                        return _registerQueue.apply(this, arguments);
                    }

                    function _registerQueue() {
                        _registerQueue = (0, _asyncToGenerator2['default'])(
                            /*#__PURE__*/
                            _regenerator['default'].mark(function _callee() {
                                var eventTypes,
                                    res,
                                    params,
                                    _args = arguments;
                                return _regenerator['default'].wrap(
                                    function _callee$(_context) {
                                        while (1) {
                                            switch (
                                                (_context.prev = _context.next)
                                            ) {
                                                case 0:
                                                    eventTypes =
                                                        _args.length > 0 &&
                                                        _args[0] !== undefined
                                                            ? _args[0]
                                                            : null;

                                                case 1:
                                                    if (!true) {
                                                        _context.next = 21;
                                                        break;
                                                    }

                                                    _context.prev = 2;
                                                    params = {
                                                        eventTypes: eventTypes,
                                                    };
                                                    _context.next = 6;
                                                    return z.queues.register(
                                                        params
                                                    );

                                                case 6:
                                                    res = _context.sent;

                                                    if (
                                                        !(
                                                            res.result ===
                                                            'error'
                                                        )
                                                    ) {
                                                        _context.next = 13;
                                                        break;
                                                    }

                                                    logError(res.msg);
                                                    _context.next = 11;
                                                    return sleep(1000);

                                                case 11:
                                                    _context.next = 14;
                                                    break;

                                                case 13:
                                                    return _context.abrupt(
                                                        'return',
                                                        {
                                                            queueId:
                                                                res.queue_id,
                                                            lastEventId:
                                                                res.last_event_id,
                                                        }
                                                    );

                                                case 14:
                                                    _context.next = 19;
                                                    break;

                                                case 16:
                                                    _context.prev = 16;
                                                    _context.t0 = _context[
                                                        'catch'
                                                    ](2);
                                                    logError(_context.t0);

                                                case 19:
                                                    _context.next = 1;
                                                    break;

                                                case 21:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    },
                                    _callee,
                                    null,
                                    [[2, 16]]
                                );
                            })
                        );
                        return _registerQueue.apply(this, arguments);
                    }

                    function callOnEachEvent(_x) {
                        return _callOnEachEvent.apply(this, arguments);
                    }

                    function _callOnEachEvent() {
                        _callOnEachEvent = (0, _asyncToGenerator2['default'])(
                            /*#__PURE__*/
                            _regenerator['default'].mark(function _callee2(
                                callback
                            ) {
                                var eventTypes,
                                    queueId,
                                    lastEventId,
                                    handleEvent,
                                    queueData,
                                    res,
                                    _args2 = arguments;
                                return _regenerator['default'].wrap(
                                    function _callee2$(_context2) {
                                        while (1) {
                                            switch (
                                                (_context2.prev =
                                                    _context2.next)
                                            ) {
                                                case 0:
                                                    eventTypes =
                                                        _args2.length > 1 &&
                                                        _args2[1] !== undefined
                                                            ? _args2[1]
                                                            : null;
                                                    queueId = null;
                                                    lastEventId = -1;

                                                    handleEvent = function handleEvent(
                                                        event
                                                    ) {
                                                        lastEventId = Math.max(
                                                            lastEventId,
                                                            event.id
                                                        );
                                                        callback(event);
                                                    };

                                                case 4:
                                                    if (!true) {
                                                        _context2.next = 25;
                                                        break;
                                                    }

                                                    if (queueId) {
                                                        _context2.next = 11;
                                                        break;
                                                    }

                                                    _context2.next = 8;
                                                    return registerQueue(
                                                        eventTypes
                                                    );

                                                case 8:
                                                    queueData = _context2.sent; // eslint-disable-line no-await-in-loop

                                                    queueId = queueData.queueId;
                                                    lastEventId =
                                                        queueData.lastEventId;

                                                case 11:
                                                    _context2.prev = 11;
                                                    _context2.next = 14;
                                                    return z.events.retrieve({
                                                        // eslint-disable-line no-await-in-loop
                                                        queue_id: queueId,
                                                        last_event_id: lastEventId,
                                                        dont_block: false,
                                                    });

                                                case 14:
                                                    res = _context2.sent;

                                                    if (res.events) {
                                                        res.events.forEach(
                                                            handleEvent
                                                        );
                                                    }

                                                    _context2.next = 21;
                                                    break;

                                                case 18:
                                                    _context2.prev = 18;
                                                    _context2.t0 = _context2[
                                                        'catch'
                                                    ](11);
                                                    logError(_context2.t0);

                                                case 21:
                                                    _context2.next = 23;
                                                    return sleep(1000);

                                                case 23:
                                                    _context2.next = 4;
                                                    break;

                                                case 25:
                                                case 'end':
                                                    return _context2.stop();
                                            }
                                        }
                                    },
                                    _callee2,
                                    null,
                                    [[11, 18]]
                                );
                            })
                        );
                        return _callOnEachEvent.apply(this, arguments);
                    }

                    return callOnEachEvent;
                }

                module.exports = eventsWrapper;
            },
            {
                './resources/events': 7,
                './resources/queues': 10,
                '@babel/runtime/helpers/asyncToGenerator': 17,
                '@babel/runtime/helpers/interopRequireDefault': 20,
                '@babel/runtime/regenerator': 21,
            },
        ],
        3: [
            function (require, module, exports) {
                'use strict';

                var fetch = require('isomorphic-fetch');

                var FormData = require('isomorphic-form-data');

                module.exports = {
                    fetch: fetch,
                    FormData: FormData,
                };
            },
            { 'isomorphic-fetch': 27, 'isomorphic-form-data': 28 },
        ],
        4: [
            function (require, module, exports) {
                'use strict';

                var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

                var _defineProperty2 = _interopRequireDefault(
                    require('@babel/runtime/helpers/defineProperty')
                );

                var _zuliprc = _interopRequireDefault(require('./zuliprc'));

                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object);

                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object);
                        if (enumerableOnly)
                            symbols = symbols.filter(function (sym) {
                                return Object.getOwnPropertyDescriptor(
                                    object,
                                    sym
                                ).enumerable;
                            });
                        keys.push.apply(keys, symbols);
                    }

                    return keys;
                }

                function _objectSpread(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {};

                        if (i % 2) {
                            ownKeys(source, true).forEach(function (key) {
                                (0,
                                _defineProperty2[
                                    'default'
                                ])(target, key, source[key]);
                            });
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(
                                target,
                                Object.getOwnPropertyDescriptors(source)
                            );
                        } else {
                            ownKeys(source).forEach(function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            });
                        }
                    }

                    return target;
                }

                var api = require('./api');

                var accounts = require('./resources/accounts');

                var streams = require('./resources/streams');

                var messages = require('./resources/messages');

                var queues = require('./resources/queues');

                var events = require('./resources/events');

                var users = require('./resources/users');

                var emojis = require('./resources/emojis');

                var typing = require('./resources/typing');

                var reactions = require('./resources/reactions');

                var server = require('./resources/server');

                var filters = require('./resources/filters');

                var eventsWapper = require('./events_wrapper');

                function getCallEndpoint(config) {
                    return function callEndpoint(endpoint) {
                        var method =
                            arguments.length > 1 && arguments[1] !== undefined
                                ? arguments[1]
                                : 'GET';
                        var params =
                            arguments.length > 2 ? arguments[2] : undefined;

                        var myConfig = _objectSpread({}, config);

                        var finalendpoint = endpoint;

                        if (!endpoint.startsWith('/')) {
                            finalendpoint = '/'.concat(endpoint); // eslint-disable-line
                        }

                        var url = myConfig.apiURL + finalendpoint;
                        return api(url, myConfig, method, params);
                    };
                }

                function resources(config) {
                    return {
                        config: config,
                        callEndpoint: getCallEndpoint(config),
                        accounts: accounts(config),
                        streams: streams(config),
                        messages: messages(config),
                        queues: queues(config),
                        events: events(config),
                        users: users(config),
                        emojis: emojis(config),
                        typing: typing(config),
                        reactions: reactions(config),
                        server: server(config),
                        filters: filters(config),
                        callOnEachEvent: eventsWapper(config),
                    };
                }

                function zulip(initialConfig) {
                    if (initialConfig.zuliprc) {
                        return (0, _zuliprc['default'])(
                            initialConfig.zuliprc
                        ).then(function (config) {
                            return resources(config);
                        });
                    }

                    var config = initialConfig;

                    if (config.realm.endsWith('/api')) {
                        config.apiURL = ''.concat(config.realm, '/v1');
                    } else {
                        config.apiURL = ''.concat(config.realm, '/api/v1');
                    }

                    if (!config.apiKey) {
                        return accounts(config)
                            .retrieve()
                            .then(function (res) {
                                config.apiKey = res.api_key;
                                return resources(config);
                            });
                    }

                    return Promise.resolve(resources(config));
                }

                window.zulip = zulip;
            },
            {
                './api': 1,
                './events_wrapper': 2,
                './resources/accounts': 5,
                './resources/emojis': 6,
                './resources/events': 7,
                './resources/filters': 8,
                './resources/messages': 9,
                './resources/queues': 10,
                './resources/reactions': 11,
                './resources/server': 12,
                './resources/streams': 13,
                './resources/typing': 14,
                './resources/users': 15,
                './zuliprc': 16,
                '@babel/runtime/helpers/defineProperty': 18,
                '@babel/runtime/helpers/interopRequireDefault': 20,
            },
        ],
        5: [
            function (require, module, exports) {
                'use strict';

                var helper = require('../helper');

                function accounts(config) {
                    return {
                        retrieve: function retrieve() {
                            var url = ''.concat(
                                config.apiURL,
                                '/fetch_api_key'
                            );
                            var form = new helper.FormData();
                            form.append('username', config.username);
                            form.append('password', config.password);
                            return helper
                                .fetch(url, {
                                    method: 'POST',
                                    body: form,
                                })
                                .then(function (res) {
                                    return res.json();
                                });
                        },
                    };
                }

                module.exports = accounts;
            },
            { '../helper': 3 },
        ],
        6: [
            function (require, module, exports) {
                'use strict';

                var api = require('../api');

                function emojis(config) {
                    return {
                        retrieve: function retrieve(params) {
                            var url = ''.concat(config.apiURL, '/realm/emoji');
                            return api(url, config, 'GET', params);
                        },
                    };
                }

                module.exports = emojis;
            },
            { '../api': 1 },
        ],
        7: [
            function (require, module, exports) {
                'use strict';

                var api = require('../api');

                function events(config) {
                    return {
                        retrieve: function retrieve(params) {
                            var url = ''.concat(config.apiURL, '/events');
                            return api(url, config, 'GET', params);
                        },
                    };
                }

                module.exports = events;
            },
            { '../api': 1 },
        ],
        8: [
            function (require, module, exports) {
                'use strict';

                var api = require('../api');

                function filters(config) {
                    return {
                        retrieve: function retrieve(params) {
                            var url = ''.concat(
                                config.apiURL,
                                '/realm/filters'
                            );
                            return api(url, config, 'GET', params);
                        },
                    };
                }

                module.exports = filters;
            },
            { '../api': 1 },
        ],
        9: [
            function (require, module, exports) {
                'use strict';

                var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

                var _defineProperty2 = _interopRequireDefault(
                    require('@babel/runtime/helpers/defineProperty')
                );

                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object);

                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object);
                        if (enumerableOnly)
                            symbols = symbols.filter(function (sym) {
                                return Object.getOwnPropertyDescriptor(
                                    object,
                                    sym
                                ).enumerable;
                            });
                        keys.push.apply(keys, symbols);
                    }

                    return keys;
                }

                function _objectSpread(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {};

                        if (i % 2) {
                            ownKeys(source, true).forEach(function (key) {
                                (0,
                                _defineProperty2[
                                    'default'
                                ])(target, key, source[key]);
                            });
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(
                                target,
                                Object.getOwnPropertyDescriptors(source)
                            );
                        } else {
                            ownKeys(source).forEach(function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            });
                        }
                    }

                    return target;
                }

                var api = require('../api');

                function messages(config) {
                    var baseURL = ''.concat(config.apiURL, '/messages');
                    var flagsURL = ''.concat(baseURL, '/flags');
                    return {
                        retrieve: function retrieve(initialParams) {
                            var url = ''.concat(config.apiURL, '/messages');

                            var params = _objectSpread({}, initialParams);

                            if (params.narrow) {
                                params.narrow = JSON.stringify(params.narrow);
                            }

                            return api(url, config, 'GET', params);
                        },
                        send: function send(params) {
                            var url = ''.concat(config.apiURL, '/messages');
                            return api(url, config, 'POST', params);
                        },
                        render: function render(initialParams) {
                            var url = ''.concat(
                                config.apiURL,
                                '/messages/render'
                            );

                            var params = _objectSpread({}, initialParams);

                            if (typeof initialParams === 'string') {
                                params = {
                                    content: initialParams,
                                };
                            }

                            return api(url, config, 'POST', params);
                        },
                        update: function update(params) {
                            var url = ''
                                .concat(config.apiURL, '/messages/')
                                .concat(params.message_id);
                            return api(url, config, 'PATCH', params);
                        },
                        flags: {
                            add: function add(initialParams) {
                                // params.flag can be one of 'read', 'starred', 'mentioned',
                                // 'wildcard_mentioned', 'has_alert_word', 'historical',
                                var params = _objectSpread({}, initialParams);

                                params.op = 'add';

                                if (params.messages) {
                                    params.messages = JSON.stringify(
                                        params.messages
                                    );
                                }

                                return api(flagsURL, config, 'POST', params);
                            },
                            remove: function remove(initialParams) {
                                // params.flag can be one of 'read', 'starred', 'mentioned',
                                // 'wildcard_mentioned', 'has_alert_word', 'historical',
                                var params = _objectSpread({}, initialParams);

                                params.op = 'remove';

                                if (params.messages) {
                                    params.messages = JSON.stringify(
                                        params.messages
                                    );
                                }

                                return api(flagsURL, config, 'POST', params);
                            },
                        },
                        getById: function getById(params) {
                            var url = ''
                                .concat(config.apiURL, '/messages/')
                                .concat(params.message_id);
                            return api(url, config, 'GET', params);
                        },
                        getHistoryById: function getHistoryById(params) {
                            var url = ''
                                .concat(config.apiURL, '/messages/')
                                .concat(params.message_id, '/history');
                            return api(url, config, 'GET', params);
                        },
                        deleteReactionById: function deleteReactionById(
                            params
                        ) {
                            var url = ''
                                .concat(config.apiURL, '/messages/')
                                .concat(params.message_id, '/reactions');
                            return api(url, config, 'DELETE', params);
                        },
                        deleteById: function deleteById(params) {
                            var url = ''
                                .concat(config.apiURL, '/messages/')
                                .concat(params.message_id);
                            return api(url, config, 'DELETE', params);
                        },
                    };
                }

                module.exports = messages;
            },
            {
                '../api': 1,
                '@babel/runtime/helpers/defineProperty': 18,
                '@babel/runtime/helpers/interopRequireDefault': 20,
            },
        ],
        10: [
            function (require, module, exports) {
                'use strict';

                var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

                var _defineProperty2 = _interopRequireDefault(
                    require('@babel/runtime/helpers/defineProperty')
                );

                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object);

                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object);
                        if (enumerableOnly)
                            symbols = symbols.filter(function (sym) {
                                return Object.getOwnPropertyDescriptor(
                                    object,
                                    sym
                                ).enumerable;
                            });
                        keys.push.apply(keys, symbols);
                    }

                    return keys;
                }

                function _objectSpread(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {};

                        if (i % 2) {
                            ownKeys(source, true).forEach(function (key) {
                                (0,
                                _defineProperty2[
                                    'default'
                                ])(target, key, source[key]);
                            });
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(
                                target,
                                Object.getOwnPropertyDescriptors(source)
                            );
                        } else {
                            ownKeys(source).forEach(function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            });
                        }
                    }

                    return target;
                }

                var api = require('../api');

                function queues(config) {
                    return {
                        register: function register(initialParams) {
                            var url = ''.concat(config.apiURL, '/register');

                            var params = _objectSpread({}, initialParams);

                            if (params.event_types) {
                                params.event_types = JSON.stringify(
                                    params.event_types
                                );
                            }

                            return api(url, config, 'POST', params);
                        },
                        deregister: function deregister(params) {
                            var url = ''.concat(config.apiURL, '/events');
                            return api(url, config, 'DELETE', params);
                        },
                    };
                }

                module.exports = queues;
            },
            {
                '../api': 1,
                '@babel/runtime/helpers/defineProperty': 18,
                '@babel/runtime/helpers/interopRequireDefault': 20,
            },
        ],
        11: [
            function (require, module, exports) {
                'use strict';

                var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

                var _defineProperty2 = _interopRequireDefault(
                    require('@babel/runtime/helpers/defineProperty')
                );

                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object);

                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object);
                        if (enumerableOnly)
                            symbols = symbols.filter(function (sym) {
                                return Object.getOwnPropertyDescriptor(
                                    object,
                                    sym
                                ).enumerable;
                            });
                        keys.push.apply(keys, symbols);
                    }

                    return keys;
                }

                function _objectSpread(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {};

                        if (i % 2) {
                            ownKeys(source, true).forEach(function (key) {
                                (0,
                                _defineProperty2[
                                    'default'
                                ])(target, key, source[key]);
                            });
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(
                                target,
                                Object.getOwnPropertyDescriptors(source)
                            );
                        } else {
                            ownKeys(source).forEach(function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            });
                        }
                    }

                    return target;
                }

                var api = require('../api');

                function reactions(config) {
                    var url = function url(messageID) {
                        return ''
                            .concat(config.apiURL, '/messages/')
                            .concat(messageID, '/reactions');
                    };

                    var call = function call(method, initParams) {
                        var params = _objectSpread({}, initParams);

                        delete params.message_id;
                        return api(
                            url(initParams.message_id),
                            config,
                            method,
                            params
                        );
                    };

                    return {
                        add: function add(params) {
                            return call('POST', params);
                        },
                        remove: function remove(params) {
                            return call('DELETE', params);
                        },
                    };
                }

                module.exports = reactions;
            },
            {
                '../api': 1,
                '@babel/runtime/helpers/defineProperty': 18,
                '@babel/runtime/helpers/interopRequireDefault': 20,
            },
        ],
        12: [
            function (require, module, exports) {
                'use strict';

                var api = require('../api');

                function server(config) {
                    return {
                        settings: function settings(params) {
                            var url = ''.concat(
                                config.apiURL,
                                '/server_settings'
                            );
                            return api(url, config, 'GET', params);
                        },
                    };
                }

                module.exports = server;
            },
            { '../api': 1 },
        ],
        13: [
            function (require, module, exports) {
                'use strict';

                var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

                var _defineProperty2 = _interopRequireDefault(
                    require('@babel/runtime/helpers/defineProperty')
                );

                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object);

                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object);
                        if (enumerableOnly)
                            symbols = symbols.filter(function (sym) {
                                return Object.getOwnPropertyDescriptor(
                                    object,
                                    sym
                                ).enumerable;
                            });
                        keys.push.apply(keys, symbols);
                    }

                    return keys;
                }

                function _objectSpread(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {};

                        if (i % 2) {
                            ownKeys(source, true).forEach(function (key) {
                                (0,
                                _defineProperty2[
                                    'default'
                                ])(target, key, source[key]);
                            });
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(
                                target,
                                Object.getOwnPropertyDescriptors(source)
                            );
                        } else {
                            ownKeys(source).forEach(function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            });
                        }
                    }

                    return target;
                }

                var api = require('../api');

                function streams(config) {
                    return {
                        retrieve: function retrieve(params) {
                            var url = ''.concat(config.apiURL, '/streams');
                            return api(url, config, 'GET', params);
                        },
                        getStreamId: function getStreamId(initialParams) {
                            var url = ''.concat(
                                config.apiURL,
                                '/get_stream_id'
                            );

                            var params = _objectSpread({}, initialParams);

                            if (typeof initialParams === 'string') {
                                params = {
                                    stream: initialParams,
                                };
                            }

                            return api(url, config, 'GET', params);
                        },
                        subscriptions: {
                            retrieve: function retrieve(params) {
                                var url = ''.concat(
                                    config.apiURL,
                                    '/users/me/subscriptions'
                                );
                                return api(url, config, 'GET', params);
                            },
                        },
                        topics: {
                            retrieve: function retrieve(params) {
                                var url = ''
                                    .concat(config.apiURL, '/users/me/')
                                    .concat(params.stream_id, '/topics');
                                return api(url, config, 'GET');
                            },
                        },
                    };
                }

                module.exports = streams;
            },
            {
                '../api': 1,
                '@babel/runtime/helpers/defineProperty': 18,
                '@babel/runtime/helpers/interopRequireDefault': 20,
            },
        ],
        14: [
            function (require, module, exports) {
                'use strict';

                var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

                var _defineProperty2 = _interopRequireDefault(
                    require('@babel/runtime/helpers/defineProperty')
                );

                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object);

                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object);
                        if (enumerableOnly)
                            symbols = symbols.filter(function (sym) {
                                return Object.getOwnPropertyDescriptor(
                                    object,
                                    sym
                                ).enumerable;
                            });
                        keys.push.apply(keys, symbols);
                    }

                    return keys;
                }

                function _objectSpread(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {};

                        if (i % 2) {
                            ownKeys(source, true).forEach(function (key) {
                                (0,
                                _defineProperty2[
                                    'default'
                                ])(target, key, source[key]);
                            });
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(
                                target,
                                Object.getOwnPropertyDescriptors(source)
                            );
                        } else {
                            ownKeys(source).forEach(function (key) {
                                Object.defineProperty(
                                    target,
                                    key,
                                    Object.getOwnPropertyDescriptor(source, key)
                                );
                            });
                        }
                    }

                    return target;
                }

                var api = require('../api');

                function typing(config) {
                    return {
                        send: function send(initialParams) {
                            var url = ''.concat(config.apiURL, '/typing');

                            var params = _objectSpread({}, initialParams);

                            if (params.to.length > 1) {
                                params.to = JSON.stringify(params.to);
                            }

                            return api(url, config, 'POST', params);
                        },
                    };
                }

                module.exports = typing;
            },
            {
                '../api': 1,
                '@babel/runtime/helpers/defineProperty': 18,
                '@babel/runtime/helpers/interopRequireDefault': 20,
            },
        ],
        15: [
            function (require, module, exports) {
                'use strict';

                var api = require('../api');

                function users(config) {
                    return {
                        retrieve: function retrieve(params) {
                            var url = ''.concat(config.apiURL, '/users');
                            return api(url, config, 'GET', params);
                        },
                        create: function create(params) {
                            var url = ''.concat(config.apiURL, '/users');
                            return api(url, config, 'POST', params);
                        },
                        me: {
                            pointer: {
                                retrieve: function retrieve(params) {
                                    var url = ''.concat(
                                        config.apiURL,
                                        '/users/me/pointer'
                                    );
                                    return api(url, config, 'GET', params);
                                },
                                update: function update(id) {
                                    var url = ''.concat(
                                        config.apiURL,
                                        '/users/me/pointer'
                                    );
                                    return api(url, config, 'POST', {
                                        pointer: id,
                                    });
                                },
                            },
                            getProfile: function getProfile() {
                                var url = ''.concat(config.apiURL, '/users/me');
                                return api(url, config, 'GET');
                            },
                            subscriptions: {
                                add: function add(params) {
                                    var url = ''.concat(
                                        config.apiURL,
                                        '/users/me/subscriptions'
                                    );
                                    return api(url, config, 'POST', params);
                                },
                                remove: function remove(params) {
                                    var url = ''.concat(
                                        config.apiURL,
                                        '/users/me/subscriptions'
                                    );
                                    return api(url, config, 'DELETE', params);
                                },
                            },
                            alertWords: {
                                retrieve: function retrieve(params) {
                                    var url = ''.concat(
                                        config.apiURL,
                                        '/users/me/alert_words'
                                    );
                                    return api(url, config, 'GET', params);
                                },
                            },
                        },
                    };
                }

                module.exports = users;
            },
            { '../api': 1 },
        ],
        16: [
            function (require, module, exports) {
                'use strict';

                var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

                Object.defineProperty(exports, '__esModule', {
                    value: true,
                });
                exports['default'] = void 0;

                var _fsReadfilePromise = _interopRequireDefault(
                    require('fs-readfile-promise')
                );

                var _ini = require('ini');

                function parseConfigFile(filename) {
                    return (0, _fsReadfilePromise['default'])(filename)
                        .then(function (buf) {
                            return buf.toString();
                        })
                        .then(_ini.parse)
                        .then(function (parsedConfig) {
                            var config = {
                                realm: parsedConfig.api.site,
                                username: parsedConfig.api.email,
                                apiKey: parsedConfig.api.key,
                            };
                            config.apiURL = ''.concat(
                                parsedConfig.api.site,
                                '/api/v1'
                            );
                            return config;
                        });
                }

                var _default = parseConfigFile;
                exports['default'] = _default;
            },
            {
                '@babel/runtime/helpers/interopRequireDefault': 20,
                'fs-readfile-promise': 23,
                ini: 26,
            },
        ],
        17: [
            function (require, module, exports) {
                function asyncGeneratorStep(
                    gen,
                    resolve,
                    reject,
                    _next,
                    _throw,
                    key,
                    arg
                ) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        Promise.resolve(value).then(_next, _throw);
                    }
                }

                function _asyncToGenerator(fn) {
                    return function () {
                        var self = this,
                            args = arguments;
                        return new Promise(function (resolve, reject) {
                            var gen = fn.apply(self, args);

                            function _next(value) {
                                asyncGeneratorStep(
                                    gen,
                                    resolve,
                                    reject,
                                    _next,
                                    _throw,
                                    'next',
                                    value
                                );
                            }

                            function _throw(err) {
                                asyncGeneratorStep(
                                    gen,
                                    resolve,
                                    reject,
                                    _next,
                                    _throw,
                                    'throw',
                                    err
                                );
                            }

                            _next(undefined);
                        });
                    };
                }

                module.exports = _asyncToGenerator;
            },
            {},
        ],
        18: [
            function (require, module, exports) {
                function _defineProperty(obj, key, value) {
                    if (key in obj) {
                        Object.defineProperty(obj, key, {
                            value: value,
                            enumerable: true,
                            configurable: true,
                            writable: true,
                        });
                    } else {
                        obj[key] = value;
                    }

                    return obj;
                }

                module.exports = _defineProperty;
            },
            {},
        ],
        19: [
            function (require, module, exports) {
                function _instanceof(left, right) {
                    if (
                        right != null &&
                        typeof Symbol !== 'undefined' &&
                        right[Symbol.hasInstance]
                    ) {
                        return !!right[Symbol.hasInstance](left);
                    } else {
                        return left instanceof right;
                    }
                }

                module.exports = _instanceof;
            },
            {},
        ],
        20: [
            function (require, module, exports) {
                function _interopRequireDefault(obj) {
                    return obj && obj.__esModule
                        ? obj
                        : {
                              default: obj,
                          };
                }

                module.exports = _interopRequireDefault;
            },
            {},
        ],
        21: [
            function (require, module, exports) {
                module.exports = require('regenerator-runtime');
            },
            { 'regenerator-runtime': 30 },
        ],
        22: [
            function (require, module, exports) {
                'use strict';

                exports.byteLength = byteLength;
                exports.toByteArray = toByteArray;
                exports.fromByteArray = fromByteArray;

                var lookup = [];
                var revLookup = [];
                var Arr =
                    typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

                var code =
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                for (var i = 0, len = code.length; i < len; ++i) {
                    lookup[i] = code[i];
                    revLookup[code.charCodeAt(i)] = i;
                }

                // Support decoding URL-safe base64 strings, as Node.js does.
                // See: https://en.wikipedia.org/wiki/Base64#URL_applications
                revLookup['-'.charCodeAt(0)] = 62;
                revLookup['_'.charCodeAt(0)] = 63;

                function getLens(b64) {
                    var len = b64.length;

                    if (len % 4 > 0) {
                        throw new Error(
                            'Invalid string. Length must be a multiple of 4'
                        );
                    }

                    // Trim off extra bytes after placeholder bytes are found
                    // See: https://github.com/beatgammit/base64-js/issues/42
                    var validLen = b64.indexOf('=');
                    if (validLen === -1) validLen = len;

                    var placeHoldersLen =
                        validLen === len ? 0 : 4 - (validLen % 4);

                    return [validLen, placeHoldersLen];
                }

                // base64 is 4/3 + up to two characters of the original data
                function byteLength(b64) {
                    var lens = getLens(b64);
                    var validLen = lens[0];
                    var placeHoldersLen = lens[1];
                    return (
                        ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
                    );
                }

                function _byteLength(b64, validLen, placeHoldersLen) {
                    return (
                        ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
                    );
                }

                function toByteArray(b64) {
                    var tmp;
                    var lens = getLens(b64);
                    var validLen = lens[0];
                    var placeHoldersLen = lens[1];

                    var arr = new Arr(
                        _byteLength(b64, validLen, placeHoldersLen)
                    );

                    var curByte = 0;

                    // if there are placeholders, only get up to the last complete 4 chars
                    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;

                    var i;
                    for (i = 0; i < len; i += 4) {
                        tmp =
                            (revLookup[b64.charCodeAt(i)] << 18) |
                            (revLookup[b64.charCodeAt(i + 1)] << 12) |
                            (revLookup[b64.charCodeAt(i + 2)] << 6) |
                            revLookup[b64.charCodeAt(i + 3)];
                        arr[curByte++] = (tmp >> 16) & 0xff;
                        arr[curByte++] = (tmp >> 8) & 0xff;
                        arr[curByte++] = tmp & 0xff;
                    }

                    if (placeHoldersLen === 2) {
                        tmp =
                            (revLookup[b64.charCodeAt(i)] << 2) |
                            (revLookup[b64.charCodeAt(i + 1)] >> 4);
                        arr[curByte++] = tmp & 0xff;
                    }

                    if (placeHoldersLen === 1) {
                        tmp =
                            (revLookup[b64.charCodeAt(i)] << 10) |
                            (revLookup[b64.charCodeAt(i + 1)] << 4) |
                            (revLookup[b64.charCodeAt(i + 2)] >> 2);
                        arr[curByte++] = (tmp >> 8) & 0xff;
                        arr[curByte++] = tmp & 0xff;
                    }

                    return arr;
                }

                function tripletToBase64(num) {
                    return (
                        lookup[(num >> 18) & 0x3f] +
                        lookup[(num >> 12) & 0x3f] +
                        lookup[(num >> 6) & 0x3f] +
                        lookup[num & 0x3f]
                    );
                }

                function encodeChunk(uint8, start, end) {
                    var tmp;
                    var output = [];
                    for (var i = start; i < end; i += 3) {
                        tmp =
                            ((uint8[i] << 16) & 0xff0000) +
                            ((uint8[i + 1] << 8) & 0xff00) +
                            (uint8[i + 2] & 0xff);
                        output.push(tripletToBase64(tmp));
                    }
                    return output.join('');
                }

                function fromByteArray(uint8) {
                    var tmp;
                    var len = uint8.length;
                    var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
                    var parts = [];
                    var maxChunkLength = 16383; // must be multiple of 3

                    // go through the array every three bytes, we'll deal with trailing stuff later
                    for (
                        var i = 0, len2 = len - extraBytes;
                        i < len2;
                        i += maxChunkLength
                    ) {
                        parts.push(
                            encodeChunk(
                                uint8,
                                i,
                                i + maxChunkLength > len2
                                    ? len2
                                    : i + maxChunkLength
                            )
                        );
                    }

                    // pad the end with zeros, but make sure to not forget the extra bytes
                    if (extraBytes === 1) {
                        tmp = uint8[len - 1];
                        parts.push(
                            lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3f] + '=='
                        );
                    } else if (extraBytes === 2) {
                        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
                        parts.push(
                            lookup[tmp >> 10] +
                                lookup[(tmp >> 4) & 0x3f] +
                                lookup[(tmp << 2) & 0x3f] +
                                '='
                        );
                    }

                    return parts.join('');
                }
            },
            {},
        ],
        23: [function (require, module, exports) {}, {}],
        24: [
            function (require, module, exports) {
                (function (Buffer) {
                    /*!
                     * The buffer module from node.js, for the browser.
                     *
                     * @author   Feross Aboukhadijeh <https://feross.org>
                     * @license  MIT
                     */
                    /* eslint-disable no-proto */

                    'use strict';

                    var base64 = require('base64-js');
                    var ieee754 = require('ieee754');

                    exports.Buffer = Buffer;
                    exports.SlowBuffer = SlowBuffer;
                    exports.INSPECT_MAX_BYTES = 50;

                    var K_MAX_LENGTH = 0x7fffffff;
                    exports.kMaxLength = K_MAX_LENGTH;

                    /**
                     * If `Buffer.TYPED_ARRAY_SUPPORT`:
                     *   === true    Use Uint8Array implementation (fastest)
                     *   === false   Print warning and recommend using `buffer` v4.x which has an Object
                     *               implementation (most compatible, even IE6)
                     *
                     * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
                     * Opera 11.6+, iOS 4.2+.
                     *
                     * We report that the browser does not support typed arrays if the are not subclassable
                     * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
                     * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
                     * for __proto__ and has a buggy typed array implementation.
                     */
                    Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

                    if (
                        !Buffer.TYPED_ARRAY_SUPPORT &&
                        typeof console !== 'undefined' &&
                        typeof console.error === 'function'
                    ) {
                        console.error(
                            'This browser lacks typed array (Uint8Array) support which is required by ' +
                                '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
                        );
                    }

                    function typedArraySupport() {
                        // Can typed array instances can be augmented?
                        try {
                            var arr = new Uint8Array(1);
                            arr.__proto__ = {
                                __proto__: Uint8Array.prototype,
                                foo: function () {
                                    return 42;
                                },
                            };
                            return arr.foo() === 42;
                        } catch (e) {
                            return false;
                        }
                    }

                    Object.defineProperty(Buffer.prototype, 'parent', {
                        enumerable: true,
                        get: function () {
                            if (!Buffer.isBuffer(this)) return undefined;
                            return this.buffer;
                        },
                    });

                    Object.defineProperty(Buffer.prototype, 'offset', {
                        enumerable: true,
                        get: function () {
                            if (!Buffer.isBuffer(this)) return undefined;
                            return this.byteOffset;
                        },
                    });

                    function createBuffer(length) {
                        if (length > K_MAX_LENGTH) {
                            throw new RangeError(
                                'The value "' +
                                    length +
                                    '" is invalid for option "size"'
                            );
                        }
                        // Return an augmented `Uint8Array` instance
                        var buf = new Uint8Array(length);
                        buf.__proto__ = Buffer.prototype;
                        return buf;
                    }

                    /**
                     * The Buffer constructor returns instances of `Uint8Array` that have their
                     * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
                     * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
                     * and the `Uint8Array` methods. Square bracket notation works as expected -- it
                     * returns a single octet.
                     *
                     * The `Uint8Array` prototype remains unmodified.
                     */

                    function Buffer(arg, encodingOrOffset, length) {
                        // Common case.
                        if (typeof arg === 'number') {
                            if (typeof encodingOrOffset === 'string') {
                                throw new TypeError(
                                    'The "string" argument must be of type string. Received type number'
                                );
                            }
                            return allocUnsafe(arg);
                        }
                        return from(arg, encodingOrOffset, length);
                    }

                    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
                    if (
                        typeof Symbol !== 'undefined' &&
                        Symbol.species != null &&
                        Buffer[Symbol.species] === Buffer
                    ) {
                        Object.defineProperty(Buffer, Symbol.species, {
                            value: null,
                            configurable: true,
                            enumerable: false,
                            writable: false,
                        });
                    }

                    Buffer.poolSize = 8192; // not used by this implementation

                    function from(value, encodingOrOffset, length) {
                        if (typeof value === 'string') {
                            return fromString(value, encodingOrOffset);
                        }

                        if (ArrayBuffer.isView(value)) {
                            return fromArrayLike(value);
                        }

                        if (value == null) {
                            throw TypeError(
                                'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
                                    'or Array-like Object. Received type ' +
                                    typeof value
                            );
                        }

                        if (
                            isInstance(value, ArrayBuffer) ||
                            (value && isInstance(value.buffer, ArrayBuffer))
                        ) {
                            return fromArrayBuffer(
                                value,
                                encodingOrOffset,
                                length
                            );
                        }

                        if (typeof value === 'number') {
                            throw new TypeError(
                                'The "value" argument must not be of type number. Received type number'
                            );
                        }

                        var valueOf = value.valueOf && value.valueOf();
                        if (valueOf != null && valueOf !== value) {
                            return Buffer.from(
                                valueOf,
                                encodingOrOffset,
                                length
                            );
                        }

                        var b = fromObject(value);
                        if (b) return b;

                        if (
                            typeof Symbol !== 'undefined' &&
                            Symbol.toPrimitive != null &&
                            typeof value[Symbol.toPrimitive] === 'function'
                        ) {
                            return Buffer.from(
                                value[Symbol.toPrimitive]('string'),
                                encodingOrOffset,
                                length
                            );
                        }

                        throw new TypeError(
                            'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
                                'or Array-like Object. Received type ' +
                                typeof value
                        );
                    }

                    /**
                     * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
                     * if value is a number.
                     * Buffer.from(str[, encoding])
                     * Buffer.from(array)
                     * Buffer.from(buffer)
                     * Buffer.from(arrayBuffer[, byteOffset[, length]])
                     **/
                    Buffer.from = function (value, encodingOrOffset, length) {
                        return from(value, encodingOrOffset, length);
                    };

                    // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
                    // https://github.com/feross/buffer/pull/148
                    Buffer.prototype.__proto__ = Uint8Array.prototype;
                    Buffer.__proto__ = Uint8Array;

                    function assertSize(size) {
                        if (typeof size !== 'number') {
                            throw new TypeError(
                                '"size" argument must be of type number'
                            );
                        } else if (size < 0) {
                            throw new RangeError(
                                'The value "' +
                                    size +
                                    '" is invalid for option "size"'
                            );
                        }
                    }

                    function alloc(size, fill, encoding) {
                        assertSize(size);
                        if (size <= 0) {
                            return createBuffer(size);
                        }
                        if (fill !== undefined) {
                            // Only pay attention to encoding if it's a string. This
                            // prevents accidentally sending in a number that would
                            // be interpretted as a start offset.
                            return typeof encoding === 'string'
                                ? createBuffer(size).fill(fill, encoding)
                                : createBuffer(size).fill(fill);
                        }
                        return createBuffer(size);
                    }

                    /**
                     * Creates a new filled Buffer instance.
                     * alloc(size[, fill[, encoding]])
                     **/
                    Buffer.alloc = function (size, fill, encoding) {
                        return alloc(size, fill, encoding);
                    };

                    function allocUnsafe(size) {
                        assertSize(size);
                        return createBuffer(size < 0 ? 0 : checked(size) | 0);
                    }

                    /**
                     * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
                     * */
                    Buffer.allocUnsafe = function (size) {
                        return allocUnsafe(size);
                    };
                    /**
                     * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
                     */
                    Buffer.allocUnsafeSlow = function (size) {
                        return allocUnsafe(size);
                    };

                    function fromString(string, encoding) {
                        if (typeof encoding !== 'string' || encoding === '') {
                            encoding = 'utf8';
                        }

                        if (!Buffer.isEncoding(encoding)) {
                            throw new TypeError(
                                'Unknown encoding: ' + encoding
                            );
                        }

                        var length = byteLength(string, encoding) | 0;
                        var buf = createBuffer(length);

                        var actual = buf.write(string, encoding);

                        if (actual !== length) {
                            // Writing a hex string, for example, that contains invalid characters will
                            // cause everything after the first invalid character to be ignored. (e.g.
                            // 'abxxcd' will be treated as 'ab')
                            buf = buf.slice(0, actual);
                        }

                        return buf;
                    }

                    function fromArrayLike(array) {
                        var length =
                            array.length < 0 ? 0 : checked(array.length) | 0;
                        var buf = createBuffer(length);
                        for (var i = 0; i < length; i += 1) {
                            buf[i] = array[i] & 255;
                        }
                        return buf;
                    }

                    function fromArrayBuffer(array, byteOffset, length) {
                        if (byteOffset < 0 || array.byteLength < byteOffset) {
                            throw new RangeError(
                                '"offset" is outside of buffer bounds'
                            );
                        }

                        if (array.byteLength < byteOffset + (length || 0)) {
                            throw new RangeError(
                                '"length" is outside of buffer bounds'
                            );
                        }

                        var buf;
                        if (byteOffset === undefined && length === undefined) {
                            buf = new Uint8Array(array);
                        } else if (length === undefined) {
                            buf = new Uint8Array(array, byteOffset);
                        } else {
                            buf = new Uint8Array(array, byteOffset, length);
                        }

                        // Return an augmented `Uint8Array` instance
                        buf.__proto__ = Buffer.prototype;
                        return buf;
                    }

                    function fromObject(obj) {
                        if (Buffer.isBuffer(obj)) {
                            var len = checked(obj.length) | 0;
                            var buf = createBuffer(len);

                            if (buf.length === 0) {
                                return buf;
                            }

                            obj.copy(buf, 0, 0, len);
                            return buf;
                        }

                        if (obj.length !== undefined) {
                            if (
                                typeof obj.length !== 'number' ||
                                numberIsNaN(obj.length)
                            ) {
                                return createBuffer(0);
                            }
                            return fromArrayLike(obj);
                        }

                        if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
                            return fromArrayLike(obj.data);
                        }
                    }

                    function checked(length) {
                        // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
                        // length is NaN (which is otherwise coerced to zero.)
                        if (length >= K_MAX_LENGTH) {
                            throw new RangeError(
                                'Attempt to allocate Buffer larger than maximum ' +
                                    'size: 0x' +
                                    K_MAX_LENGTH.toString(16) +
                                    ' bytes'
                            );
                        }
                        return length | 0;
                    }

                    function SlowBuffer(length) {
                        if (+length != length) {
                            // eslint-disable-line eqeqeq
                            length = 0;
                        }
                        return Buffer.alloc(+length);
                    }

                    Buffer.isBuffer = function isBuffer(b) {
                        return (
                            b != null &&
                            b._isBuffer === true &&
                            b !== Buffer.prototype
                        ); // so Buffer.isBuffer(Buffer.prototype) will be false
                    };

                    Buffer.compare = function compare(a, b) {
                        if (isInstance(a, Uint8Array))
                            a = Buffer.from(a, a.offset, a.byteLength);
                        if (isInstance(b, Uint8Array))
                            b = Buffer.from(b, b.offset, b.byteLength);
                        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                            throw new TypeError(
                                'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
                            );
                        }

                        if (a === b) return 0;

                        var x = a.length;
                        var y = b.length;

                        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                            if (a[i] !== b[i]) {
                                x = a[i];
                                y = b[i];
                                break;
                            }
                        }

                        if (x < y) return -1;
                        if (y < x) return 1;
                        return 0;
                    };

                    Buffer.isEncoding = function isEncoding(encoding) {
                        switch (String(encoding).toLowerCase()) {
                            case 'hex':
                            case 'utf8':
                            case 'utf-8':
                            case 'ascii':
                            case 'latin1':
                            case 'binary':
                            case 'base64':
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return true;
                            default:
                                return false;
                        }
                    };

                    Buffer.concat = function concat(list, length) {
                        if (!Array.isArray(list)) {
                            throw new TypeError(
                                '"list" argument must be an Array of Buffers'
                            );
                        }

                        if (list.length === 0) {
                            return Buffer.alloc(0);
                        }

                        var i;
                        if (length === undefined) {
                            length = 0;
                            for (i = 0; i < list.length; ++i) {
                                length += list[i].length;
                            }
                        }

                        var buffer = Buffer.allocUnsafe(length);
                        var pos = 0;
                        for (i = 0; i < list.length; ++i) {
                            var buf = list[i];
                            if (isInstance(buf, Uint8Array)) {
                                buf = Buffer.from(buf);
                            }
                            if (!Buffer.isBuffer(buf)) {
                                throw new TypeError(
                                    '"list" argument must be an Array of Buffers'
                                );
                            }
                            buf.copy(buffer, pos);
                            pos += buf.length;
                        }
                        return buffer;
                    };

                    function byteLength(string, encoding) {
                        if (Buffer.isBuffer(string)) {
                            return string.length;
                        }
                        if (
                            ArrayBuffer.isView(string) ||
                            isInstance(string, ArrayBuffer)
                        ) {
                            return string.byteLength;
                        }
                        if (typeof string !== 'string') {
                            throw new TypeError(
                                'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
                                    'Received type ' +
                                    typeof string
                            );
                        }

                        var len = string.length;
                        var mustMatch =
                            arguments.length > 2 && arguments[2] === true;
                        if (!mustMatch && len === 0) return 0;

                        // Use a for loop to avoid recursion
                        var loweredCase = false;
                        for (;;) {
                            switch (encoding) {
                                case 'ascii':
                                case 'latin1':
                                case 'binary':
                                    return len;
                                case 'utf8':
                                case 'utf-8':
                                    return utf8ToBytes(string).length;
                                case 'ucs2':
                                case 'ucs-2':
                                case 'utf16le':
                                case 'utf-16le':
                                    return len * 2;
                                case 'hex':
                                    return len >>> 1;
                                case 'base64':
                                    return base64ToBytes(string).length;
                                default:
                                    if (loweredCase) {
                                        return mustMatch
                                            ? -1
                                            : utf8ToBytes(string).length; // assume utf8
                                    }
                                    encoding = ('' + encoding).toLowerCase();
                                    loweredCase = true;
                            }
                        }
                    }
                    Buffer.byteLength = byteLength;

                    function slowToString(encoding, start, end) {
                        var loweredCase = false;

                        // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
                        // property of a typed array.

                        // This behaves neither like String nor Uint8Array in that we set start/end
                        // to their upper/lower bounds if the value passed is out of range.
                        // undefined is handled specially as per ECMA-262 6th Edition,
                        // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
                        if (start === undefined || start < 0) {
                            start = 0;
                        }
                        // Return early if start > this.length. Done here to prevent potential uint32
                        // coercion fail below.
                        if (start > this.length) {
                            return '';
                        }

                        if (end === undefined || end > this.length) {
                            end = this.length;
                        }

                        if (end <= 0) {
                            return '';
                        }

                        // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
                        end >>>= 0;
                        start >>>= 0;

                        if (end <= start) {
                            return '';
                        }

                        if (!encoding) encoding = 'utf8';

                        while (true) {
                            switch (encoding) {
                                case 'hex':
                                    return hexSlice(this, start, end);

                                case 'utf8':
                                case 'utf-8':
                                    return utf8Slice(this, start, end);

                                case 'ascii':
                                    return asciiSlice(this, start, end);

                                case 'latin1':
                                case 'binary':
                                    return latin1Slice(this, start, end);

                                case 'base64':
                                    return base64Slice(this, start, end);

                                case 'ucs2':
                                case 'ucs-2':
                                case 'utf16le':
                                case 'utf-16le':
                                    return utf16leSlice(this, start, end);

                                default:
                                    if (loweredCase)
                                        throw new TypeError(
                                            'Unknown encoding: ' + encoding
                                        );
                                    encoding = (encoding + '').toLowerCase();
                                    loweredCase = true;
                            }
                        }
                    }

                    // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
                    // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
                    // reliably in a browserify context because there could be multiple different
                    // copies of the 'buffer' package in use. This method works even for Buffer
                    // instances that were created from another copy of the `buffer` package.
                    // See: https://github.com/feross/buffer/issues/154
                    Buffer.prototype._isBuffer = true;

                    function swap(b, n, m) {
                        var i = b[n];
                        b[n] = b[m];
                        b[m] = i;
                    }

                    Buffer.prototype.swap16 = function swap16() {
                        var len = this.length;
                        if (len % 2 !== 0) {
                            throw new RangeError(
                                'Buffer size must be a multiple of 16-bits'
                            );
                        }
                        for (var i = 0; i < len; i += 2) {
                            swap(this, i, i + 1);
                        }
                        return this;
                    };

                    Buffer.prototype.swap32 = function swap32() {
                        var len = this.length;
                        if (len % 4 !== 0) {
                            throw new RangeError(
                                'Buffer size must be a multiple of 32-bits'
                            );
                        }
                        for (var i = 0; i < len; i += 4) {
                            swap(this, i, i + 3);
                            swap(this, i + 1, i + 2);
                        }
                        return this;
                    };

                    Buffer.prototype.swap64 = function swap64() {
                        var len = this.length;
                        if (len % 8 !== 0) {
                            throw new RangeError(
                                'Buffer size must be a multiple of 64-bits'
                            );
                        }
                        for (var i = 0; i < len; i += 8) {
                            swap(this, i, i + 7);
                            swap(this, i + 1, i + 6);
                            swap(this, i + 2, i + 5);
                            swap(this, i + 3, i + 4);
                        }
                        return this;
                    };

                    Buffer.prototype.toString = function toString() {
                        var length = this.length;
                        if (length === 0) return '';
                        if (arguments.length === 0)
                            return utf8Slice(this, 0, length);
                        return slowToString.apply(this, arguments);
                    };

                    Buffer.prototype.toLocaleString = Buffer.prototype.toString;

                    Buffer.prototype.equals = function equals(b) {
                        if (!Buffer.isBuffer(b))
                            throw new TypeError('Argument must be a Buffer');
                        if (this === b) return true;
                        return Buffer.compare(this, b) === 0;
                    };

                    Buffer.prototype.inspect = function inspect() {
                        var str = '';
                        var max = exports.INSPECT_MAX_BYTES;
                        str = this.toString('hex', 0, max)
                            .replace(/(.{2})/g, '$1 ')
                            .trim();
                        if (this.length > max) str += ' ... ';
                        return '<Buffer ' + str + '>';
                    };

                    Buffer.prototype.compare = function compare(
                        target,
                        start,
                        end,
                        thisStart,
                        thisEnd
                    ) {
                        if (isInstance(target, Uint8Array)) {
                            target = Buffer.from(
                                target,
                                target.offset,
                                target.byteLength
                            );
                        }
                        if (!Buffer.isBuffer(target)) {
                            throw new TypeError(
                                'The "target" argument must be one of type Buffer or Uint8Array. ' +
                                    'Received type ' +
                                    typeof target
                            );
                        }

                        if (start === undefined) {
                            start = 0;
                        }
                        if (end === undefined) {
                            end = target ? target.length : 0;
                        }
                        if (thisStart === undefined) {
                            thisStart = 0;
                        }
                        if (thisEnd === undefined) {
                            thisEnd = this.length;
                        }

                        if (
                            start < 0 ||
                            end > target.length ||
                            thisStart < 0 ||
                            thisEnd > this.length
                        ) {
                            throw new RangeError('out of range index');
                        }

                        if (thisStart >= thisEnd && start >= end) {
                            return 0;
                        }
                        if (thisStart >= thisEnd) {
                            return -1;
                        }
                        if (start >= end) {
                            return 1;
                        }

                        start >>>= 0;
                        end >>>= 0;
                        thisStart >>>= 0;
                        thisEnd >>>= 0;

                        if (this === target) return 0;

                        var x = thisEnd - thisStart;
                        var y = end - start;
                        var len = Math.min(x, y);

                        var thisCopy = this.slice(thisStart, thisEnd);
                        var targetCopy = target.slice(start, end);

                        for (var i = 0; i < len; ++i) {
                            if (thisCopy[i] !== targetCopy[i]) {
                                x = thisCopy[i];
                                y = targetCopy[i];
                                break;
                            }
                        }

                        if (x < y) return -1;
                        if (y < x) return 1;
                        return 0;
                    };

                    // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
                    // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
                    //
                    // Arguments:
                    // - buffer - a Buffer to search
                    // - val - a string, Buffer, or number
                    // - byteOffset - an index into `buffer`; will be clamped to an int32
                    // - encoding - an optional encoding, relevant is val is a string
                    // - dir - true for indexOf, false for lastIndexOf
                    function bidirectionalIndexOf(
                        buffer,
                        val,
                        byteOffset,
                        encoding,
                        dir
                    ) {
                        // Empty buffer means no match
                        if (buffer.length === 0) return -1;

                        // Normalize byteOffset
                        if (typeof byteOffset === 'string') {
                            encoding = byteOffset;
                            byteOffset = 0;
                        } else if (byteOffset > 0x7fffffff) {
                            byteOffset = 0x7fffffff;
                        } else if (byteOffset < -0x80000000) {
                            byteOffset = -0x80000000;
                        }
                        byteOffset = +byteOffset; // Coerce to Number.
                        if (numberIsNaN(byteOffset)) {
                            // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
                            byteOffset = dir ? 0 : buffer.length - 1;
                        }

                        // Normalize byteOffset: negative offsets start from the end of the buffer
                        if (byteOffset < 0)
                            byteOffset = buffer.length + byteOffset;
                        if (byteOffset >= buffer.length) {
                            if (dir) return -1;
                            else byteOffset = buffer.length - 1;
                        } else if (byteOffset < 0) {
                            if (dir) byteOffset = 0;
                            else return -1;
                        }

                        // Normalize val
                        if (typeof val === 'string') {
                            val = Buffer.from(val, encoding);
                        }

                        // Finally, search either indexOf (if dir is true) or lastIndexOf
                        if (Buffer.isBuffer(val)) {
                            // Special case: looking for empty string/buffer always fails
                            if (val.length === 0) {
                                return -1;
                            }
                            return arrayIndexOf(
                                buffer,
                                val,
                                byteOffset,
                                encoding,
                                dir
                            );
                        } else if (typeof val === 'number') {
                            val = val & 0xff; // Search for a byte value [0-255]
                            if (
                                typeof Uint8Array.prototype.indexOf ===
                                'function'
                            ) {
                                if (dir) {
                                    return Uint8Array.prototype.indexOf.call(
                                        buffer,
                                        val,
                                        byteOffset
                                    );
                                } else {
                                    return Uint8Array.prototype.lastIndexOf.call(
                                        buffer,
                                        val,
                                        byteOffset
                                    );
                                }
                            }
                            return arrayIndexOf(
                                buffer,
                                [val],
                                byteOffset,
                                encoding,
                                dir
                            );
                        }

                        throw new TypeError(
                            'val must be string, number or Buffer'
                        );
                    }

                    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                        var indexSize = 1;
                        var arrLength = arr.length;
                        var valLength = val.length;

                        if (encoding !== undefined) {
                            encoding = String(encoding).toLowerCase();
                            if (
                                encoding === 'ucs2' ||
                                encoding === 'ucs-2' ||
                                encoding === 'utf16le' ||
                                encoding === 'utf-16le'
                            ) {
                                if (arr.length < 2 || val.length < 2) {
                                    return -1;
                                }
                                indexSize = 2;
                                arrLength /= 2;
                                valLength /= 2;
                                byteOffset /= 2;
                            }
                        }

                        function read(buf, i) {
                            if (indexSize === 1) {
                                return buf[i];
                            } else {
                                return buf.readUInt16BE(i * indexSize);
                            }
                        }

                        var i;
                        if (dir) {
                            var foundIndex = -1;
                            for (i = byteOffset; i < arrLength; i++) {
                                if (
                                    read(arr, i) ===
                                    read(
                                        val,
                                        foundIndex === -1 ? 0 : i - foundIndex
                                    )
                                ) {
                                    if (foundIndex === -1) foundIndex = i;
                                    if (i - foundIndex + 1 === valLength)
                                        return foundIndex * indexSize;
                                } else {
                                    if (foundIndex !== -1) i -= i - foundIndex;
                                    foundIndex = -1;
                                }
                            }
                        } else {
                            if (byteOffset + valLength > arrLength)
                                byteOffset = arrLength - valLength;
                            for (i = byteOffset; i >= 0; i--) {
                                var found = true;
                                for (var j = 0; j < valLength; j++) {
                                    if (read(arr, i + j) !== read(val, j)) {
                                        found = false;
                                        break;
                                    }
                                }
                                if (found) return i;
                            }
                        }

                        return -1;
                    }

                    Buffer.prototype.includes = function includes(
                        val,
                        byteOffset,
                        encoding
                    ) {
                        return this.indexOf(val, byteOffset, encoding) !== -1;
                    };

                    Buffer.prototype.indexOf = function indexOf(
                        val,
                        byteOffset,
                        encoding
                    ) {
                        return bidirectionalIndexOf(
                            this,
                            val,
                            byteOffset,
                            encoding,
                            true
                        );
                    };

                    Buffer.prototype.lastIndexOf = function lastIndexOf(
                        val,
                        byteOffset,
                        encoding
                    ) {
                        return bidirectionalIndexOf(
                            this,
                            val,
                            byteOffset,
                            encoding,
                            false
                        );
                    };

                    function hexWrite(buf, string, offset, length) {
                        offset = Number(offset) || 0;
                        var remaining = buf.length - offset;
                        if (!length) {
                            length = remaining;
                        } else {
                            length = Number(length);
                            if (length > remaining) {
                                length = remaining;
                            }
                        }

                        var strLen = string.length;

                        if (length > strLen / 2) {
                            length = strLen / 2;
                        }
                        for (var i = 0; i < length; ++i) {
                            var parsed = parseInt(string.substr(i * 2, 2), 16);
                            if (numberIsNaN(parsed)) return i;
                            buf[offset + i] = parsed;
                        }
                        return i;
                    }

                    function utf8Write(buf, string, offset, length) {
                        return blitBuffer(
                            utf8ToBytes(string, buf.length - offset),
                            buf,
                            offset,
                            length
                        );
                    }

                    function asciiWrite(buf, string, offset, length) {
                        return blitBuffer(
                            asciiToBytes(string),
                            buf,
                            offset,
                            length
                        );
                    }

                    function latin1Write(buf, string, offset, length) {
                        return asciiWrite(buf, string, offset, length);
                    }

                    function base64Write(buf, string, offset, length) {
                        return blitBuffer(
                            base64ToBytes(string),
                            buf,
                            offset,
                            length
                        );
                    }

                    function ucs2Write(buf, string, offset, length) {
                        return blitBuffer(
                            utf16leToBytes(string, buf.length - offset),
                            buf,
                            offset,
                            length
                        );
                    }

                    Buffer.prototype.write = function write(
                        string,
                        offset,
                        length,
                        encoding
                    ) {
                        // Buffer#write(string)
                        if (offset === undefined) {
                            encoding = 'utf8';
                            length = this.length;
                            offset = 0;
                            // Buffer#write(string, encoding)
                        } else if (
                            length === undefined &&
                            typeof offset === 'string'
                        ) {
                            encoding = offset;
                            length = this.length;
                            offset = 0;
                            // Buffer#write(string, offset[, length][, encoding])
                        } else if (isFinite(offset)) {
                            offset = offset >>> 0;
                            if (isFinite(length)) {
                                length = length >>> 0;
                                if (encoding === undefined) encoding = 'utf8';
                            } else {
                                encoding = length;
                                length = undefined;
                            }
                        } else {
                            throw new Error(
                                'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                            );
                        }

                        var remaining = this.length - offset;
                        if (length === undefined || length > remaining)
                            length = remaining;

                        if (
                            (string.length > 0 && (length < 0 || offset < 0)) ||
                            offset > this.length
                        ) {
                            throw new RangeError(
                                'Attempt to write outside buffer bounds'
                            );
                        }

                        if (!encoding) encoding = 'utf8';

                        var loweredCase = false;
                        for (;;) {
                            switch (encoding) {
                                case 'hex':
                                    return hexWrite(
                                        this,
                                        string,
                                        offset,
                                        length
                                    );

                                case 'utf8':
                                case 'utf-8':
                                    return utf8Write(
                                        this,
                                        string,
                                        offset,
                                        length
                                    );

                                case 'ascii':
                                    return asciiWrite(
                                        this,
                                        string,
                                        offset,
                                        length
                                    );

                                case 'latin1':
                                case 'binary':
                                    return latin1Write(
                                        this,
                                        string,
                                        offset,
                                        length
                                    );

                                case 'base64':
                                    // Warning: maxLength not taken into account in base64Write
                                    return base64Write(
                                        this,
                                        string,
                                        offset,
                                        length
                                    );

                                case 'ucs2':
                                case 'ucs-2':
                                case 'utf16le':
                                case 'utf-16le':
                                    return ucs2Write(
                                        this,
                                        string,
                                        offset,
                                        length
                                    );

                                default:
                                    if (loweredCase)
                                        throw new TypeError(
                                            'Unknown encoding: ' + encoding
                                        );
                                    encoding = ('' + encoding).toLowerCase();
                                    loweredCase = true;
                            }
                        }
                    };

                    Buffer.prototype.toJSON = function toJSON() {
                        return {
                            type: 'Buffer',
                            data: Array.prototype.slice.call(
                                this._arr || this,
                                0
                            ),
                        };
                    };

                    function base64Slice(buf, start, end) {
                        if (start === 0 && end === buf.length) {
                            return base64.fromByteArray(buf);
                        } else {
                            return base64.fromByteArray(buf.slice(start, end));
                        }
                    }

                    function utf8Slice(buf, start, end) {
                        end = Math.min(buf.length, end);
                        var res = [];

                        var i = start;
                        while (i < end) {
                            var firstByte = buf[i];
                            var codePoint = null;
                            var bytesPerSequence =
                                firstByte > 0xef
                                    ? 4
                                    : firstByte > 0xdf
                                    ? 3
                                    : firstByte > 0xbf
                                    ? 2
                                    : 1;

                            if (i + bytesPerSequence <= end) {
                                var secondByte,
                                    thirdByte,
                                    fourthByte,
                                    tempCodePoint;

                                switch (bytesPerSequence) {
                                    case 1:
                                        if (firstByte < 0x80) {
                                            codePoint = firstByte;
                                        }
                                        break;
                                    case 2:
                                        secondByte = buf[i + 1];
                                        if ((secondByte & 0xc0) === 0x80) {
                                            tempCodePoint =
                                                ((firstByte & 0x1f) << 0x6) |
                                                (secondByte & 0x3f);
                                            if (tempCodePoint > 0x7f) {
                                                codePoint = tempCodePoint;
                                            }
                                        }
                                        break;
                                    case 3:
                                        secondByte = buf[i + 1];
                                        thirdByte = buf[i + 2];
                                        if (
                                            (secondByte & 0xc0) === 0x80 &&
                                            (thirdByte & 0xc0) === 0x80
                                        ) {
                                            tempCodePoint =
                                                ((firstByte & 0xf) << 0xc) |
                                                ((secondByte & 0x3f) << 0x6) |
                                                (thirdByte & 0x3f);
                                            if (
                                                tempCodePoint > 0x7ff &&
                                                (tempCodePoint < 0xd800 ||
                                                    tempCodePoint > 0xdfff)
                                            ) {
                                                codePoint = tempCodePoint;
                                            }
                                        }
                                        break;
                                    case 4:
                                        secondByte = buf[i + 1];
                                        thirdByte = buf[i + 2];
                                        fourthByte = buf[i + 3];
                                        if (
                                            (secondByte & 0xc0) === 0x80 &&
                                            (thirdByte & 0xc0) === 0x80 &&
                                            (fourthByte & 0xc0) === 0x80
                                        ) {
                                            tempCodePoint =
                                                ((firstByte & 0xf) << 0x12) |
                                                ((secondByte & 0x3f) << 0xc) |
                                                ((thirdByte & 0x3f) << 0x6) |
                                                (fourthByte & 0x3f);
                                            if (
                                                tempCodePoint > 0xffff &&
                                                tempCodePoint < 0x110000
                                            ) {
                                                codePoint = tempCodePoint;
                                            }
                                        }
                                }
                            }

                            if (codePoint === null) {
                                // we did not generate a valid codePoint so insert a
                                // replacement char (U+FFFD) and advance only 1 byte
                                codePoint = 0xfffd;
                                bytesPerSequence = 1;
                            } else if (codePoint > 0xffff) {
                                // encode to utf16 (surrogate pair dance)
                                codePoint -= 0x10000;
                                res.push(((codePoint >>> 10) & 0x3ff) | 0xd800);
                                codePoint = 0xdc00 | (codePoint & 0x3ff);
                            }

                            res.push(codePoint);
                            i += bytesPerSequence;
                        }

                        return decodeCodePointsArray(res);
                    }

                    // Based on http://stackoverflow.com/a/22747272/680742, the browser with
                    // the lowest limit is Chrome, with 0x10000 args.
                    // We go 1 magnitude less, for safety
                    var MAX_ARGUMENTS_LENGTH = 0x1000;

                    function decodeCodePointsArray(codePoints) {
                        var len = codePoints.length;
                        if (len <= MAX_ARGUMENTS_LENGTH) {
                            return String.fromCharCode.apply(
                                String,
                                codePoints
                            ); // avoid extra slice()
                        }

                        // Decode in chunks to avoid "call stack size exceeded".
                        var res = '';
                        var i = 0;
                        while (i < len) {
                            res += String.fromCharCode.apply(
                                String,
                                codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH))
                            );
                        }
                        return res;
                    }

                    function asciiSlice(buf, start, end) {
                        var ret = '';
                        end = Math.min(buf.length, end);

                        for (var i = start; i < end; ++i) {
                            ret += String.fromCharCode(buf[i] & 0x7f);
                        }
                        return ret;
                    }

                    function latin1Slice(buf, start, end) {
                        var ret = '';
                        end = Math.min(buf.length, end);

                        for (var i = start; i < end; ++i) {
                            ret += String.fromCharCode(buf[i]);
                        }
                        return ret;
                    }

                    function hexSlice(buf, start, end) {
                        var len = buf.length;

                        if (!start || start < 0) start = 0;
                        if (!end || end < 0 || end > len) end = len;

                        var out = '';
                        for (var i = start; i < end; ++i) {
                            out += toHex(buf[i]);
                        }
                        return out;
                    }

                    function utf16leSlice(buf, start, end) {
                        var bytes = buf.slice(start, end);
                        var res = '';
                        for (var i = 0; i < bytes.length; i += 2) {
                            res += String.fromCharCode(
                                bytes[i] + bytes[i + 1] * 256
                            );
                        }
                        return res;
                    }

                    Buffer.prototype.slice = function slice(start, end) {
                        var len = this.length;
                        start = ~~start;
                        end = end === undefined ? len : ~~end;

                        if (start < 0) {
                            start += len;
                            if (start < 0) start = 0;
                        } else if (start > len) {
                            start = len;
                        }

                        if (end < 0) {
                            end += len;
                            if (end < 0) end = 0;
                        } else if (end > len) {
                            end = len;
                        }

                        if (end < start) end = start;

                        var newBuf = this.subarray(start, end);
                        // Return an augmented `Uint8Array` instance
                        newBuf.__proto__ = Buffer.prototype;
                        return newBuf;
                    };

                    /*
                     * Need to make sure that buffer isn't trying to write out of bounds.
                     */
                    function checkOffset(offset, ext, length) {
                        if (offset % 1 !== 0 || offset < 0)
                            throw new RangeError('offset is not uint');
                        if (offset + ext > length)
                            throw new RangeError(
                                'Trying to access beyond buffer length'
                            );
                    }

                    Buffer.prototype.readUIntLE = function readUIntLE(
                        offset,
                        byteLength,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        byteLength = byteLength >>> 0;
                        if (!noAssert)
                            checkOffset(offset, byteLength, this.length);

                        var val = this[offset];
                        var mul = 1;
                        var i = 0;
                        while (++i < byteLength && (mul *= 0x100)) {
                            val += this[offset + i] * mul;
                        }

                        return val;
                    };

                    Buffer.prototype.readUIntBE = function readUIntBE(
                        offset,
                        byteLength,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        byteLength = byteLength >>> 0;
                        if (!noAssert) {
                            checkOffset(offset, byteLength, this.length);
                        }

                        var val = this[offset + --byteLength];
                        var mul = 1;
                        while (byteLength > 0 && (mul *= 0x100)) {
                            val += this[offset + --byteLength] * mul;
                        }

                        return val;
                    };

                    Buffer.prototype.readUInt8 = function readUInt8(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 1, this.length);
                        return this[offset];
                    };

                    Buffer.prototype.readUInt16LE = function readUInt16LE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 2, this.length);
                        return this[offset] | (this[offset + 1] << 8);
                    };

                    Buffer.prototype.readUInt16BE = function readUInt16BE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 2, this.length);
                        return (this[offset] << 8) | this[offset + 1];
                    };

                    Buffer.prototype.readUInt32LE = function readUInt32LE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 4, this.length);

                        return (
                            (this[offset] |
                                (this[offset + 1] << 8) |
                                (this[offset + 2] << 16)) +
                            this[offset + 3] * 0x1000000
                        );
                    };

                    Buffer.prototype.readUInt32BE = function readUInt32BE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 4, this.length);

                        return (
                            this[offset] * 0x1000000 +
                            ((this[offset + 1] << 16) |
                                (this[offset + 2] << 8) |
                                this[offset + 3])
                        );
                    };

                    Buffer.prototype.readIntLE = function readIntLE(
                        offset,
                        byteLength,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        byteLength = byteLength >>> 0;
                        if (!noAssert)
                            checkOffset(offset, byteLength, this.length);

                        var val = this[offset];
                        var mul = 1;
                        var i = 0;
                        while (++i < byteLength && (mul *= 0x100)) {
                            val += this[offset + i] * mul;
                        }
                        mul *= 0x80;

                        if (val >= mul) val -= Math.pow(2, 8 * byteLength);

                        return val;
                    };

                    Buffer.prototype.readIntBE = function readIntBE(
                        offset,
                        byteLength,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        byteLength = byteLength >>> 0;
                        if (!noAssert)
                            checkOffset(offset, byteLength, this.length);

                        var i = byteLength;
                        var mul = 1;
                        var val = this[offset + --i];
                        while (i > 0 && (mul *= 0x100)) {
                            val += this[offset + --i] * mul;
                        }
                        mul *= 0x80;

                        if (val >= mul) val -= Math.pow(2, 8 * byteLength);

                        return val;
                    };

                    Buffer.prototype.readInt8 = function readInt8(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 1, this.length);
                        if (!(this[offset] & 0x80)) return this[offset];
                        return (0xff - this[offset] + 1) * -1;
                    };

                    Buffer.prototype.readInt16LE = function readInt16LE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 2, this.length);
                        var val = this[offset] | (this[offset + 1] << 8);
                        return val & 0x8000 ? val | 0xffff0000 : val;
                    };

                    Buffer.prototype.readInt16BE = function readInt16BE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 2, this.length);
                        var val = this[offset + 1] | (this[offset] << 8);
                        return val & 0x8000 ? val | 0xffff0000 : val;
                    };

                    Buffer.prototype.readInt32LE = function readInt32LE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 4, this.length);

                        return (
                            this[offset] |
                            (this[offset + 1] << 8) |
                            (this[offset + 2] << 16) |
                            (this[offset + 3] << 24)
                        );
                    };

                    Buffer.prototype.readInt32BE = function readInt32BE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 4, this.length);

                        return (
                            (this[offset] << 24) |
                            (this[offset + 1] << 16) |
                            (this[offset + 2] << 8) |
                            this[offset + 3]
                        );
                    };

                    Buffer.prototype.readFloatLE = function readFloatLE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 4, this.length);
                        return ieee754.read(this, offset, true, 23, 4);
                    };

                    Buffer.prototype.readFloatBE = function readFloatBE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 4, this.length);
                        return ieee754.read(this, offset, false, 23, 4);
                    };

                    Buffer.prototype.readDoubleLE = function readDoubleLE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 8, this.length);
                        return ieee754.read(this, offset, true, 52, 8);
                    };

                    Buffer.prototype.readDoubleBE = function readDoubleBE(
                        offset,
                        noAssert
                    ) {
                        offset = offset >>> 0;
                        if (!noAssert) checkOffset(offset, 8, this.length);
                        return ieee754.read(this, offset, false, 52, 8);
                    };

                    function checkInt(buf, value, offset, ext, max, min) {
                        if (!Buffer.isBuffer(buf))
                            throw new TypeError(
                                '"buffer" argument must be a Buffer instance'
                            );
                        if (value > max || value < min)
                            throw new RangeError(
                                '"value" argument is out of bounds'
                            );
                        if (offset + ext > buf.length)
                            throw new RangeError('Index out of range');
                    }

                    Buffer.prototype.writeUIntLE = function writeUIntLE(
                        value,
                        offset,
                        byteLength,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        byteLength = byteLength >>> 0;
                        if (!noAssert) {
                            var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                            checkInt(
                                this,
                                value,
                                offset,
                                byteLength,
                                maxBytes,
                                0
                            );
                        }

                        var mul = 1;
                        var i = 0;
                        this[offset] = value & 0xff;
                        while (++i < byteLength && (mul *= 0x100)) {
                            this[offset + i] = (value / mul) & 0xff;
                        }

                        return offset + byteLength;
                    };

                    Buffer.prototype.writeUIntBE = function writeUIntBE(
                        value,
                        offset,
                        byteLength,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        byteLength = byteLength >>> 0;
                        if (!noAssert) {
                            var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                            checkInt(
                                this,
                                value,
                                offset,
                                byteLength,
                                maxBytes,
                                0
                            );
                        }

                        var i = byteLength - 1;
                        var mul = 1;
                        this[offset + i] = value & 0xff;
                        while (--i >= 0 && (mul *= 0x100)) {
                            this[offset + i] = (value / mul) & 0xff;
                        }

                        return offset + byteLength;
                    };

                    Buffer.prototype.writeUInt8 = function writeUInt8(
                        value,
                        offset,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 1, 0xff, 0);
                        this[offset] = value & 0xff;
                        return offset + 1;
                    };

                    Buffer.prototype.writeUInt16LE = function writeUInt16LE(
                        value,
                        offset,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 2, 0xffff, 0);
                        this[offset] = value & 0xff;
                        this[offset + 1] = value >>> 8;
                        return offset + 2;
                    };

                    Buffer.prototype.writeUInt16BE = function writeUInt16BE(
                        value,
                        offset,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 2, 0xffff, 0);
                        this[offset] = value >>> 8;
                        this[offset + 1] = value & 0xff;
                        return offset + 2;
                    };

                    Buffer.prototype.writeUInt32LE = function writeUInt32LE(
                        value,
                        offset,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 4, 0xffffffff, 0);
                        this[offset + 3] = value >>> 24;
                        this[offset + 2] = value >>> 16;
                        this[offset + 1] = value >>> 8;
                        this[offset] = value & 0xff;
                        return offset + 4;
                    };

                    Buffer.prototype.writeUInt32BE = function writeUInt32BE(
                        value,
                        offset,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 4, 0xffffffff, 0);
                        this[offset] = value >>> 24;
                        this[offset + 1] = value >>> 16;
                        this[offset + 2] = value >>> 8;
                        this[offset + 3] = value & 0xff;
                        return offset + 4;
                    };

                    Buffer.prototype.writeIntLE = function writeIntLE(
                        value,
                        offset,
                        byteLength,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert) {
                            var limit = Math.pow(2, 8 * byteLength - 1);

                            checkInt(
                                this,
                                value,
                                offset,
                                byteLength,
                                limit - 1,
                                -limit
                            );
                        }

                        var i = 0;
                        var mul = 1;
                        var sub = 0;
                        this[offset] = value & 0xff;
                        while (++i < byteLength && (mul *= 0x100)) {
                            if (
                                value < 0 &&
                                sub === 0 &&
                                this[offset + i - 1] !== 0
                            ) {
                                sub = 1;
                            }
                            this[offset + i] =
                                (((value / mul) >> 0) - sub) & 0xff;
                        }

                        return offset + byteLength;
                    };

                    Buffer.prototype.writeIntBE = function writeIntBE(
                        value,
                        offset,
                        byteLength,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert) {
                            var limit = Math.pow(2, 8 * byteLength - 1);

                            checkInt(
                                this,
                                value,
                                offset,
                                byteLength,
                                limit - 1,
                                -limit
                            );
                        }

                        var i = byteLength - 1;
                        var mul = 1;
                        var sub = 0;
                        this[offset + i] = value & 0xff;
                        while (--i >= 0 && (mul *= 0x100)) {
                            if (
                                value < 0 &&
                                sub === 0 &&
                                this[offset + i + 1] !== 0
                            ) {
                                sub = 1;
                            }
                            this[offset + i] =
                                (((value / mul) >> 0) - sub) & 0xff;
                        }

                        return offset + byteLength;
                    };

                    Buffer.prototype.writeInt8 = function writeInt8(
                        value,
                        offset,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 1, 0x7f, -0x80);
                        if (value < 0) value = 0xff + value + 1;
                        this[offset] = value & 0xff;
                        return offset + 1;
                    };

                    Buffer.prototype.writeInt16LE = function writeInt16LE(
                        value,
                        offset,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 2, 0x7fff, -0x8000);
                        this[offset] = value & 0xff;
                        this[offset + 1] = value >>> 8;
                        return offset + 2;
                    };

                    Buffer.prototype.writeInt16BE = function writeInt16BE(
                        value,
                        offset,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert)
                            checkInt(this, value, offset, 2, 0x7fff, -0x8000);
                        this[offset] = value >>> 8;
                        this[offset + 1] = value & 0xff;
                        return offset + 2;
                    };

                    Buffer.prototype.writeInt32LE = function writeInt32LE(
                        value,
                        offset,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert)
                            checkInt(
                                this,
                                value,
                                offset,
                                4,
                                0x7fffffff,
                                -0x80000000
                            );
                        this[offset] = value & 0xff;
                        this[offset + 1] = value >>> 8;
                        this[offset + 2] = value >>> 16;
                        this[offset + 3] = value >>> 24;
                        return offset + 4;
                    };

                    Buffer.prototype.writeInt32BE = function writeInt32BE(
                        value,
                        offset,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert)
                            checkInt(
                                this,
                                value,
                                offset,
                                4,
                                0x7fffffff,
                                -0x80000000
                            );
                        if (value < 0) value = 0xffffffff + value + 1;
                        this[offset] = value >>> 24;
                        this[offset + 1] = value >>> 16;
                        this[offset + 2] = value >>> 8;
                        this[offset + 3] = value & 0xff;
                        return offset + 4;
                    };

                    function checkIEEE754(buf, value, offset, ext, max, min) {
                        if (offset + ext > buf.length)
                            throw new RangeError('Index out of range');
                        if (offset < 0)
                            throw new RangeError('Index out of range');
                    }

                    function writeFloat(
                        buf,
                        value,
                        offset,
                        littleEndian,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert) {
                            checkIEEE754(
                                buf,
                                value,
                                offset,
                                4,
                                3.4028234663852886e38,
                                -3.4028234663852886e38
                            );
                        }
                        ieee754.write(buf, value, offset, littleEndian, 23, 4);
                        return offset + 4;
                    }

                    Buffer.prototype.writeFloatLE = function writeFloatLE(
                        value,
                        offset,
                        noAssert
                    ) {
                        return writeFloat(this, value, offset, true, noAssert);
                    };

                    Buffer.prototype.writeFloatBE = function writeFloatBE(
                        value,
                        offset,
                        noAssert
                    ) {
                        return writeFloat(this, value, offset, false, noAssert);
                    };

                    function writeDouble(
                        buf,
                        value,
                        offset,
                        littleEndian,
                        noAssert
                    ) {
                        value = +value;
                        offset = offset >>> 0;
                        if (!noAssert) {
                            checkIEEE754(
                                buf,
                                value,
                                offset,
                                8,
                                1.7976931348623157e308,
                                -1.7976931348623157e308
                            );
                        }
                        ieee754.write(buf, value, offset, littleEndian, 52, 8);
                        return offset + 8;
                    }

                    Buffer.prototype.writeDoubleLE = function writeDoubleLE(
                        value,
                        offset,
                        noAssert
                    ) {
                        return writeDouble(this, value, offset, true, noAssert);
                    };

                    Buffer.prototype.writeDoubleBE = function writeDoubleBE(
                        value,
                        offset,
                        noAssert
                    ) {
                        return writeDouble(
                            this,
                            value,
                            offset,
                            false,
                            noAssert
                        );
                    };

                    // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
                    Buffer.prototype.copy = function copy(
                        target,
                        targetStart,
                        start,
                        end
                    ) {
                        if (!Buffer.isBuffer(target))
                            throw new TypeError('argument should be a Buffer');
                        if (!start) start = 0;
                        if (!end && end !== 0) end = this.length;
                        if (targetStart >= target.length)
                            targetStart = target.length;
                        if (!targetStart) targetStart = 0;
                        if (end > 0 && end < start) end = start;

                        // Copy 0 bytes; we're done
                        if (end === start) return 0;
                        if (target.length === 0 || this.length === 0) return 0;

                        // Fatal error conditions
                        if (targetStart < 0) {
                            throw new RangeError('targetStart out of bounds');
                        }
                        if (start < 0 || start >= this.length)
                            throw new RangeError('Index out of range');
                        if (end < 0)
                            throw new RangeError('sourceEnd out of bounds');

                        // Are we oob?
                        if (end > this.length) end = this.length;
                        if (target.length - targetStart < end - start) {
                            end = target.length - targetStart + start;
                        }

                        var len = end - start;

                        if (
                            this === target &&
                            typeof Uint8Array.prototype.copyWithin ===
                                'function'
                        ) {
                            // Use built-in when available, missing from IE11
                            this.copyWithin(targetStart, start, end);
                        } else if (
                            this === target &&
                            start < targetStart &&
                            targetStart < end
                        ) {
                            // descending copy from end
                            for (var i = len - 1; i >= 0; --i) {
                                target[i + targetStart] = this[i + start];
                            }
                        } else {
                            Uint8Array.prototype.set.call(
                                target,
                                this.subarray(start, end),
                                targetStart
                            );
                        }

                        return len;
                    };

                    // Usage:
                    //    buffer.fill(number[, offset[, end]])
                    //    buffer.fill(buffer[, offset[, end]])
                    //    buffer.fill(string[, offset[, end]][, encoding])
                    Buffer.prototype.fill = function fill(
                        val,
                        start,
                        end,
                        encoding
                    ) {
                        // Handle string cases:
                        if (typeof val === 'string') {
                            if (typeof start === 'string') {
                                encoding = start;
                                start = 0;
                                end = this.length;
                            } else if (typeof end === 'string') {
                                encoding = end;
                                end = this.length;
                            }
                            if (
                                encoding !== undefined &&
                                typeof encoding !== 'string'
                            ) {
                                throw new TypeError(
                                    'encoding must be a string'
                                );
                            }
                            if (
                                typeof encoding === 'string' &&
                                !Buffer.isEncoding(encoding)
                            ) {
                                throw new TypeError(
                                    'Unknown encoding: ' + encoding
                                );
                            }
                            if (val.length === 1) {
                                var code = val.charCodeAt(0);
                                if (
                                    (encoding === 'utf8' && code < 128) ||
                                    encoding === 'latin1'
                                ) {
                                    // Fast path: If `val` fits into a single byte, use that numeric value.
                                    val = code;
                                }
                            }
                        } else if (typeof val === 'number') {
                            val = val & 255;
                        }

                        // Invalid ranges are not set to a default, so can range check early.
                        if (
                            start < 0 ||
                            this.length < start ||
                            this.length < end
                        ) {
                            throw new RangeError('Out of range index');
                        }

                        if (end <= start) {
                            return this;
                        }

                        start = start >>> 0;
                        end = end === undefined ? this.length : end >>> 0;

                        if (!val) val = 0;

                        var i;
                        if (typeof val === 'number') {
                            for (i = start; i < end; ++i) {
                                this[i] = val;
                            }
                        } else {
                            var bytes = Buffer.isBuffer(val)
                                ? val
                                : Buffer.from(val, encoding);
                            var len = bytes.length;
                            if (len === 0) {
                                throw new TypeError(
                                    'The value "' +
                                        val +
                                        '" is invalid for argument "value"'
                                );
                            }
                            for (i = 0; i < end - start; ++i) {
                                this[i + start] = bytes[i % len];
                            }
                        }

                        return this;
                    };

                    // HELPER FUNCTIONS
                    // ================

                    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

                    function base64clean(str) {
                        // Node takes equal signs as end of the Base64 encoding
                        str = str.split('=')[0];
                        // Node strips out invalid characters like \n and \t from the string, base64-js does not
                        str = str.trim().replace(INVALID_BASE64_RE, '');
                        // Node converts strings with length < 2 to ''
                        if (str.length < 2) return '';
                        // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
                        while (str.length % 4 !== 0) {
                            str = str + '=';
                        }
                        return str;
                    }

                    function toHex(n) {
                        if (n < 16) return '0' + n.toString(16);
                        return n.toString(16);
                    }

                    function utf8ToBytes(string, units) {
                        units = units || Infinity;
                        var codePoint;
                        var length = string.length;
                        var leadSurrogate = null;
                        var bytes = [];

                        for (var i = 0; i < length; ++i) {
                            codePoint = string.charCodeAt(i);

                            // is surrogate component
                            if (codePoint > 0xd7ff && codePoint < 0xe000) {
                                // last char was a lead
                                if (!leadSurrogate) {
                                    // no lead yet
                                    if (codePoint > 0xdbff) {
                                        // unexpected trail
                                        if ((units -= 3) > -1)
                                            bytes.push(0xef, 0xbf, 0xbd);
                                        continue;
                                    } else if (i + 1 === length) {
                                        // unpaired lead
                                        if ((units -= 3) > -1)
                                            bytes.push(0xef, 0xbf, 0xbd);
                                        continue;
                                    }

                                    // valid lead
                                    leadSurrogate = codePoint;

                                    continue;
                                }

                                // 2 leads in a row
                                if (codePoint < 0xdc00) {
                                    if ((units -= 3) > -1)
                                        bytes.push(0xef, 0xbf, 0xbd);
                                    leadSurrogate = codePoint;
                                    continue;
                                }

                                // valid surrogate pair
                                codePoint =
                                    (((leadSurrogate - 0xd800) << 10) |
                                        (codePoint - 0xdc00)) +
                                    0x10000;
                            } else if (leadSurrogate) {
                                // valid bmp char, but last char was a lead
                                if ((units -= 3) > -1)
                                    bytes.push(0xef, 0xbf, 0xbd);
                            }

                            leadSurrogate = null;

                            // encode utf8
                            if (codePoint < 0x80) {
                                if ((units -= 1) < 0) break;
                                bytes.push(codePoint);
                            } else if (codePoint < 0x800) {
                                if ((units -= 2) < 0) break;
                                bytes.push(
                                    (codePoint >> 0x6) | 0xc0,
                                    (codePoint & 0x3f) | 0x80
                                );
                            } else if (codePoint < 0x10000) {
                                if ((units -= 3) < 0) break;
                                bytes.push(
                                    (codePoint >> 0xc) | 0xe0,
                                    ((codePoint >> 0x6) & 0x3f) | 0x80,
                                    (codePoint & 0x3f) | 0x80
                                );
                            } else if (codePoint < 0x110000) {
                                if ((units -= 4) < 0) break;
                                bytes.push(
                                    (codePoint >> 0x12) | 0xf0,
                                    ((codePoint >> 0xc) & 0x3f) | 0x80,
                                    ((codePoint >> 0x6) & 0x3f) | 0x80,
                                    (codePoint & 0x3f) | 0x80
                                );
                            } else {
                                throw new Error('Invalid code point');
                            }
                        }

                        return bytes;
                    }

                    function asciiToBytes(str) {
                        var byteArray = [];
                        for (var i = 0; i < str.length; ++i) {
                            // Node's code seems to be doing this and not & 0x7F..
                            byteArray.push(str.charCodeAt(i) & 0xff);
                        }
                        return byteArray;
                    }

                    function utf16leToBytes(str, units) {
                        var c, hi, lo;
                        var byteArray = [];
                        for (var i = 0; i < str.length; ++i) {
                            if ((units -= 2) < 0) break;

                            c = str.charCodeAt(i);
                            hi = c >> 8;
                            lo = c % 256;
                            byteArray.push(lo);
                            byteArray.push(hi);
                        }

                        return byteArray;
                    }

                    function base64ToBytes(str) {
                        return base64.toByteArray(base64clean(str));
                    }

                    function blitBuffer(src, dst, offset, length) {
                        for (var i = 0; i < length; ++i) {
                            if (i + offset >= dst.length || i >= src.length)
                                break;
                            dst[i + offset] = src[i];
                        }
                        return i;
                    }

                    // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
                    // the `instanceof` check but they should be treated as of that type.
                    // See: https://github.com/feross/buffer/issues/166
                    function isInstance(obj, type) {
                        return (
                            obj instanceof type ||
                            (obj != null &&
                                obj.constructor != null &&
                                obj.constructor.name != null &&
                                obj.constructor.name === type.name)
                        );
                    }
                    function numberIsNaN(obj) {
                        // For IE11 support
                        return obj !== obj; // eslint-disable-line no-self-compare
                    }
                }.call(this, require('buffer').Buffer));
            },
            { 'base64-js': 22, buffer: 24, ieee754: 25 },
        ],
        25: [
            function (require, module, exports) {
                exports.read = function (buffer, offset, isLE, mLen, nBytes) {
                    var e, m;
                    var eLen = nBytes * 8 - mLen - 1;
                    var eMax = (1 << eLen) - 1;
                    var eBias = eMax >> 1;
                    var nBits = -7;
                    var i = isLE ? nBytes - 1 : 0;
                    var d = isLE ? -1 : 1;
                    var s = buffer[offset + i];

                    i += d;

                    e = s & ((1 << -nBits) - 1);
                    s >>= -nBits;
                    nBits += eLen;
                    for (
                        ;
                        nBits > 0;
                        e = e * 256 + buffer[offset + i], i += d, nBits -= 8
                    ) {}

                    m = e & ((1 << -nBits) - 1);
                    e >>= -nBits;
                    nBits += mLen;
                    for (
                        ;
                        nBits > 0;
                        m = m * 256 + buffer[offset + i], i += d, nBits -= 8
                    ) {}

                    if (e === 0) {
                        e = 1 - eBias;
                    } else if (e === eMax) {
                        return m ? NaN : (s ? -1 : 1) * Infinity;
                    } else {
                        m = m + Math.pow(2, mLen);
                        e = e - eBias;
                    }
                    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
                };

                exports.write = function (
                    buffer,
                    value,
                    offset,
                    isLE,
                    mLen,
                    nBytes
                ) {
                    var e, m, c;
                    var eLen = nBytes * 8 - mLen - 1;
                    var eMax = (1 << eLen) - 1;
                    var eBias = eMax >> 1;
                    var rt =
                        mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                    var i = isLE ? 0 : nBytes - 1;
                    var d = isLE ? 1 : -1;
                    var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

                    value = Math.abs(value);

                    if (isNaN(value) || value === Infinity) {
                        m = isNaN(value) ? 1 : 0;
                        e = eMax;
                    } else {
                        e = Math.floor(Math.log(value) / Math.LN2);
                        if (value * (c = Math.pow(2, -e)) < 1) {
                            e--;
                            c *= 2;
                        }
                        if (e + eBias >= 1) {
                            value += rt / c;
                        } else {
                            value += rt * Math.pow(2, 1 - eBias);
                        }
                        if (value * c >= 2) {
                            e++;
                            c /= 2;
                        }

                        if (e + eBias >= eMax) {
                            m = 0;
                            e = eMax;
                        } else if (e + eBias >= 1) {
                            m = (value * c - 1) * Math.pow(2, mLen);
                            e = e + eBias;
                        } else {
                            m =
                                value *
                                Math.pow(2, eBias - 1) *
                                Math.pow(2, mLen);
                            e = 0;
                        }
                    }

                    for (
                        ;
                        mLen >= 8;
                        buffer[offset + i] = m & 0xff,
                            i += d,
                            m /= 256,
                            mLen -= 8
                    ) {}

                    e = (e << mLen) | m;
                    eLen += mLen;
                    for (
                        ;
                        eLen > 0;
                        buffer[offset + i] = e & 0xff,
                            i += d,
                            e /= 256,
                            eLen -= 8
                    ) {}

                    buffer[offset + i - d] |= s * 128;
                };
            },
            {},
        ],
        26: [
            function (require, module, exports) {
                (function (process) {
                    exports.parse = exports.decode = decode;

                    exports.stringify = exports.encode = encode;

                    exports.safe = safe;
                    exports.unsafe = unsafe;

                    var eol =
                        typeof process !== 'undefined' &&
                        process.platform === 'win32'
                            ? '\r\n'
                            : '\n';

                    function encode(obj, opt) {
                        var children = [];
                        var out = '';

                        if (typeof opt === 'string') {
                            opt = {
                                section: opt,
                                whitespace: false,
                            };
                        } else {
                            opt = opt || {};
                            opt.whitespace = opt.whitespace === true;
                        }

                        var separator = opt.whitespace ? ' = ' : '=';

                        Object.keys(obj).forEach(function (k, _, __) {
                            var val = obj[k];
                            if (val && Array.isArray(val)) {
                                val.forEach(function (item) {
                                    out +=
                                        safe(k + '[]') +
                                        separator +
                                        safe(item) +
                                        '\n';
                                });
                            } else if (val && typeof val === 'object') {
                                children.push(k);
                            } else {
                                out += safe(k) + separator + safe(val) + eol;
                            }
                        });

                        if (opt.section && out.length) {
                            out = '[' + safe(opt.section) + ']' + eol + out;
                        }

                        children.forEach(function (k, _, __) {
                            var nk = dotSplit(k).join('\\.');
                            var section =
                                (opt.section ? opt.section + '.' : '') + nk;
                            var child = encode(obj[k], {
                                section: section,
                                whitespace: opt.whitespace,
                            });
                            if (out.length && child.length) {
                                out += eol;
                            }
                            out += child;
                        });

                        return out;
                    }

                    function dotSplit(str) {
                        return str
                            .replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
                            .replace(/\\\./g, '\u0001')
                            .split(/\./)
                            .map(function (part) {
                                return part
                                    .replace(/\1/g, '\\.')
                                    .replace(
                                        /\2LITERAL\\1LITERAL\2/g,
                                        '\u0001'
                                    );
                            });
                    }

                    function decode(str) {
                        var out = {};
                        var p = out;
                        var section = null;
                        //          section     |key      = value
                        var re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i;
                        var lines = str.split(/[\r\n]+/g);

                        lines.forEach(function (line, _, __) {
                            if (!line || line.match(/^\s*[;#]/)) return;
                            var match = line.match(re);
                            if (!match) return;
                            if (match[1] !== undefined) {
                                section = unsafe(match[1]);
                                p = out[section] = out[section] || {};
                                return;
                            }
                            var key = unsafe(match[2]);
                            var value = match[3] ? unsafe(match[4]) : true;
                            switch (value) {
                                case 'true':
                                case 'false':
                                case 'null':
                                    value = JSON.parse(value);
                            }

                            // Convert keys with '[]' suffix to an array
                            if (key.length > 2 && key.slice(-2) === '[]') {
                                key = key.substring(0, key.length - 2);
                                if (!p[key]) {
                                    p[key] = [];
                                } else if (!Array.isArray(p[key])) {
                                    p[key] = [p[key]];
                                }
                            }

                            // safeguard against resetting a previously defined
                            // array by accidentally forgetting the brackets
                            if (Array.isArray(p[key])) {
                                p[key].push(value);
                            } else {
                                p[key] = value;
                            }
                        });

                        // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
                        // use a filter to return the keys that have to be deleted.
                        Object.keys(out)
                            .filter(function (k, _, __) {
                                if (
                                    !out[k] ||
                                    typeof out[k] !== 'object' ||
                                    Array.isArray(out[k])
                                ) {
                                    return false;
                                }
                                // see if the parent section is also an object.
                                // if so, add it to that, and mark this one for deletion
                                var parts = dotSplit(k);
                                var p = out;
                                var l = parts.pop();
                                var nl = l.replace(/\\\./g, '.');
                                parts.forEach(function (part, _, __) {
                                    if (!p[part] || typeof p[part] !== 'object')
                                        p[part] = {};
                                    p = p[part];
                                });
                                if (p === out && nl === l) {
                                    return false;
                                }
                                p[nl] = out[k];
                                return true;
                            })
                            .forEach(function (del, _, __) {
                                delete out[del];
                            });

                        return out;
                    }

                    function isQuoted(val) {
                        return (
                            (val.charAt(0) === '"' && val.slice(-1) === '"') ||
                            (val.charAt(0) === "'" && val.slice(-1) === "'")
                        );
                    }

                    function safe(val) {
                        return typeof val !== 'string' ||
                            val.match(/[=\r\n]/) ||
                            val.match(/^\[/) ||
                            (val.length > 1 && isQuoted(val)) ||
                            val !== val.trim()
                            ? JSON.stringify(val)
                            : val.replace(/;/g, '\\;').replace(/#/g, '\\#');
                    }

                    function unsafe(val, doUnesc) {
                        val = (val || '').trim();
                        if (isQuoted(val)) {
                            // remove the single quotes before calling JSON.parse
                            if (val.charAt(0) === "'") {
                                val = val.substr(1, val.length - 2);
                            }
                            try {
                                val = JSON.parse(val);
                            } catch (_) {}
                        } else {
                            // walk the val to find the first not-escaped ; character
                            var esc = false;
                            var unesc = '';
                            for (var i = 0, l = val.length; i < l; i++) {
                                var c = val.charAt(i);
                                if (esc) {
                                    if ('\\;#'.indexOf(c) !== -1) {
                                        unesc += c;
                                    } else {
                                        unesc += '\\' + c;
                                    }
                                    esc = false;
                                } else if (';#'.indexOf(c) !== -1) {
                                    break;
                                } else if (c === '\\') {
                                    esc = true;
                                } else {
                                    unesc += c;
                                }
                            }
                            if (esc) {
                                unesc += '\\';
                            }
                            return unesc.trim();
                        }
                        return val;
                    }
                }.call(this, require('_process')));
            },
            { _process: 29 },
        ],
        27: [
            function (require, module, exports) {
                // the whatwg-fetch polyfill installs the fetch() function
                // on the global object (window or self)
                //
                // Return that as the export for use in Webpack, Browserify etc.
                require('whatwg-fetch');
                module.exports = self.fetch.bind(self);
            },
            { 'whatwg-fetch': 31 },
        ],
        28: [
            function (require, module, exports) {
                module.exports = window.FormData;
            },
            {},
        ],
        29: [
            function (require, module, exports) {
                // shim for using process in browser
                var process = (module.exports = {});

                // cached from whatever global is present so that test runners that stub it
                // don't break things.  But we need to wrap it in a try catch in case it is
                // wrapped in strict mode code which doesn't define any globals.  It's inside a
                // function because try/catches deoptimize in certain engines.

                var cachedSetTimeout;
                var cachedClearTimeout;

                function defaultSetTimout() {
                    throw new Error('setTimeout has not been defined');
                }
                function defaultClearTimeout() {
                    throw new Error('clearTimeout has not been defined');
                }
                (function () {
                    try {
                        if (typeof setTimeout === 'function') {
                            cachedSetTimeout = setTimeout;
                        } else {
                            cachedSetTimeout = defaultSetTimout;
                        }
                    } catch (e) {
                        cachedSetTimeout = defaultSetTimout;
                    }
                    try {
                        if (typeof clearTimeout === 'function') {
                            cachedClearTimeout = clearTimeout;
                        } else {
                            cachedClearTimeout = defaultClearTimeout;
                        }
                    } catch (e) {
                        cachedClearTimeout = defaultClearTimeout;
                    }
                })();
                function runTimeout(fun) {
                    if (cachedSetTimeout === setTimeout) {
                        //normal enviroments in sane situations
                        return setTimeout(fun, 0);
                    }
                    // if setTimeout wasn't available but was latter defined
                    if (
                        (cachedSetTimeout === defaultSetTimout ||
                            !cachedSetTimeout) &&
                        setTimeout
                    ) {
                        cachedSetTimeout = setTimeout;
                        return setTimeout(fun, 0);
                    }
                    try {
                        // when when somebody has screwed with setTimeout but no I.E. maddness
                        return cachedSetTimeout(fun, 0);
                    } catch (e) {
                        try {
                            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                            return cachedSetTimeout.call(null, fun, 0);
                        } catch (e) {
                            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                            return cachedSetTimeout.call(this, fun, 0);
                        }
                    }
                }
                function runClearTimeout(marker) {
                    if (cachedClearTimeout === clearTimeout) {
                        //normal enviroments in sane situations
                        return clearTimeout(marker);
                    }
                    // if clearTimeout wasn't available but was latter defined
                    if (
                        (cachedClearTimeout === defaultClearTimeout ||
                            !cachedClearTimeout) &&
                        clearTimeout
                    ) {
                        cachedClearTimeout = clearTimeout;
                        return clearTimeout(marker);
                    }
                    try {
                        // when when somebody has screwed with setTimeout but no I.E. maddness
                        return cachedClearTimeout(marker);
                    } catch (e) {
                        try {
                            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                            return cachedClearTimeout.call(null, marker);
                        } catch (e) {
                            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                            return cachedClearTimeout.call(this, marker);
                        }
                    }
                }
                var queue = [];
                var draining = false;
                var currentQueue;
                var queueIndex = -1;

                function cleanUpNextTick() {
                    if (!draining || !currentQueue) {
                        return;
                    }
                    draining = false;
                    if (currentQueue.length) {
                        queue = currentQueue.concat(queue);
                    } else {
                        queueIndex = -1;
                    }
                    if (queue.length) {
                        drainQueue();
                    }
                }

                function drainQueue() {
                    if (draining) {
                        return;
                    }
                    var timeout = runTimeout(cleanUpNextTick);
                    draining = true;

                    var len = queue.length;
                    while (len) {
                        currentQueue = queue;
                        queue = [];
                        while (++queueIndex < len) {
                            if (currentQueue) {
                                currentQueue[queueIndex].run();
                            }
                        }
                        queueIndex = -1;
                        len = queue.length;
                    }
                    currentQueue = null;
                    draining = false;
                    runClearTimeout(timeout);
                }

                process.nextTick = function (fun) {
                    var args = new Array(arguments.length - 1);
                    if (arguments.length > 1) {
                        for (var i = 1; i < arguments.length; i++) {
                            args[i - 1] = arguments[i];
                        }
                    }
                    queue.push(new Item(fun, args));
                    if (queue.length === 1 && !draining) {
                        runTimeout(drainQueue);
                    }
                };

                // v8 likes predictible objects
                function Item(fun, array) {
                    this.fun = fun;
                    this.array = array;
                }
                Item.prototype.run = function () {
                    this.fun.apply(null, this.array);
                };
                process.title = 'browser';
                process.browser = true;
                process.env = {};
                process.argv = [];
                process.version = ''; // empty string to avoid regexp issues
                process.versions = {};

                function noop() {}

                process.on = noop;
                process.addListener = noop;
                process.once = noop;
                process.off = noop;
                process.removeListener = noop;
                process.removeAllListeners = noop;
                process.emit = noop;
                process.prependListener = noop;
                process.prependOnceListener = noop;

                process.listeners = function (name) {
                    return [];
                };

                process.binding = function (name) {
                    throw new Error('process.binding is not supported');
                };

                process.cwd = function () {
                    return '/';
                };
                process.chdir = function (dir) {
                    throw new Error('process.chdir is not supported');
                };
                process.umask = function () {
                    return 0;
                };
            },
            {},
        ],
        30: [
            function (require, module, exports) {
                /**
                 * Copyright (c) 2014-present, Facebook, Inc.
                 *
                 * This source code is licensed under the MIT license found in the
                 * LICENSE file in the root directory of this source tree.
                 */

                var runtime = (function (exports) {
                    'use strict';

                    var Op = Object.prototype;
                    var hasOwn = Op.hasOwnProperty;
                    var undefined; // More compressible than void 0.
                    var $Symbol = typeof Symbol === 'function' ? Symbol : {};
                    var iteratorSymbol = $Symbol.iterator || '@@iterator';
                    var asyncIteratorSymbol =
                        $Symbol.asyncIterator || '@@asyncIterator';
                    var toStringTagSymbol =
                        $Symbol.toStringTag || '@@toStringTag';

                    function wrap(innerFn, outerFn, self, tryLocsList) {
                        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
                        var protoGenerator =
                            outerFn && outerFn.prototype instanceof Generator
                                ? outerFn
                                : Generator;
                        var generator = Object.create(protoGenerator.prototype);
                        var context = new Context(tryLocsList || []);

                        // The ._invoke method unifies the implementations of the .next,
                        // .throw, and .return methods.
                        generator._invoke = makeInvokeMethod(
                            innerFn,
                            self,
                            context
                        );

                        return generator;
                    }
                    exports.wrap = wrap;

                    // Try/catch helper to minimize deoptimizations. Returns a completion
                    // record like context.tryEntries[i].completion. This interface could
                    // have been (and was previously) designed to take a closure to be
                    // invoked without arguments, but in all the cases we care about we
                    // already have an existing method we want to call, so there's no need
                    // to create a new function object. We can even get away with assuming
                    // the method takes exactly one argument, since that happens to be true
                    // in every case, so we don't have to touch the arguments object. The
                    // only additional allocation required is the completion record, which
                    // has a stable shape and so hopefully should be cheap to allocate.
                    function tryCatch(fn, obj, arg) {
                        try {
                            return { type: 'normal', arg: fn.call(obj, arg) };
                        } catch (err) {
                            return { type: 'throw', arg: err };
                        }
                    }

                    var GenStateSuspendedStart = 'suspendedStart';
                    var GenStateSuspendedYield = 'suspendedYield';
                    var GenStateExecuting = 'executing';
                    var GenStateCompleted = 'completed';

                    // Returning this object from the innerFn has the same effect as
                    // breaking out of the dispatch switch statement.
                    var ContinueSentinel = {};

                    // Dummy constructor functions that we use as the .constructor and
                    // .constructor.prototype properties for functions that return Generator
                    // objects. For full spec compliance, you may wish to configure your
                    // minifier not to mangle the names of these two functions.
                    function Generator() {}
                    function GeneratorFunction() {}
                    function GeneratorFunctionPrototype() {}

                    // This is a polyfill for %IteratorPrototype% for environments that
                    // don't natively support it.
                    var IteratorPrototype = {};
                    IteratorPrototype[iteratorSymbol] = function () {
                        return this;
                    };

                    var getProto = Object.getPrototypeOf;
                    var NativeIteratorPrototype =
                        getProto && getProto(getProto(values([])));
                    if (
                        NativeIteratorPrototype &&
                        NativeIteratorPrototype !== Op &&
                        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
                    ) {
                        // This environment has a native %IteratorPrototype%; use it instead
                        // of the polyfill.
                        IteratorPrototype = NativeIteratorPrototype;
                    }

                    var Gp = (GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(
                        IteratorPrototype
                    ));
                    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
                    GeneratorFunctionPrototype.constructor = GeneratorFunction;
                    GeneratorFunctionPrototype[
                        toStringTagSymbol
                    ] = GeneratorFunction.displayName = 'GeneratorFunction';

                    // Helper for defining the .next, .throw, and .return methods of the
                    // Iterator interface in terms of a single ._invoke method.
                    function defineIteratorMethods(prototype) {
                        ['next', 'throw', 'return'].forEach(function (method) {
                            prototype[method] = function (arg) {
                                return this._invoke(method, arg);
                            };
                        });
                    }

                    exports.isGeneratorFunction = function (genFun) {
                        var ctor =
                            typeof genFun === 'function' && genFun.constructor;
                        return ctor
                            ? ctor === GeneratorFunction ||
                                  // For the native GeneratorFunction constructor, the best we can
                                  // do is to check its .name property.
                                  (ctor.displayName || ctor.name) ===
                                      'GeneratorFunction'
                            : false;
                    };

                    exports.mark = function (genFun) {
                        if (Object.setPrototypeOf) {
                            Object.setPrototypeOf(
                                genFun,
                                GeneratorFunctionPrototype
                            );
                        } else {
                            genFun.__proto__ = GeneratorFunctionPrototype;
                            if (!(toStringTagSymbol in genFun)) {
                                genFun[toStringTagSymbol] = 'GeneratorFunction';
                            }
                        }
                        genFun.prototype = Object.create(Gp);
                        return genFun;
                    };

                    // Within the body of any async function, `await x` is transformed to
                    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
                    // `hasOwn.call(value, "__await")` to determine if the yielded value is
                    // meant to be awaited.
                    exports.awrap = function (arg) {
                        return { __await: arg };
                    };

                    function AsyncIterator(generator) {
                        function invoke(method, arg, resolve, reject) {
                            var record = tryCatch(
                                generator[method],
                                generator,
                                arg
                            );
                            if (record.type === 'throw') {
                                reject(record.arg);
                            } else {
                                var result = record.arg;
                                var value = result.value;
                                if (
                                    value &&
                                    typeof value === 'object' &&
                                    hasOwn.call(value, '__await')
                                ) {
                                    return Promise.resolve(value.__await).then(
                                        function (value) {
                                            invoke(
                                                'next',
                                                value,
                                                resolve,
                                                reject
                                            );
                                        },
                                        function (err) {
                                            invoke(
                                                'throw',
                                                err,
                                                resolve,
                                                reject
                                            );
                                        }
                                    );
                                }

                                return Promise.resolve(value).then(
                                    function (unwrapped) {
                                        // When a yielded Promise is resolved, its final value becomes
                                        // the .value of the Promise<{value,done}> result for the
                                        // current iteration.
                                        result.value = unwrapped;
                                        resolve(result);
                                    },
                                    function (error) {
                                        // If a rejected Promise was yielded, throw the rejection back
                                        // into the async generator function so it can be handled there.
                                        return invoke(
                                            'throw',
                                            error,
                                            resolve,
                                            reject
                                        );
                                    }
                                );
                            }
                        }

                        var previousPromise;

                        function enqueue(method, arg) {
                            function callInvokeWithMethodAndArg() {
                                return new Promise(function (resolve, reject) {
                                    invoke(method, arg, resolve, reject);
                                });
                            }

                            return (previousPromise =
                                // If enqueue has been called before, then we want to wait until
                                // all previous Promises have been resolved before calling invoke,
                                // so that results are always delivered in the correct order. If
                                // enqueue has not been called before, then it is important to
                                // call invoke immediately, without waiting on a callback to fire,
                                // so that the async generator function has the opportunity to do
                                // any necessary setup in a predictable way. This predictability
                                // is why the Promise constructor synchronously invokes its
                                // executor callback, and why async functions synchronously
                                // execute code before the first await. Since we implement simple
                                // async functions in terms of async generators, it is especially
                                // important to get this right, even though it requires care.
                                previousPromise
                                    ? previousPromise.then(
                                          callInvokeWithMethodAndArg,
                                          // Avoid propagating failures to Promises returned by later
                                          // invocations of the iterator.
                                          callInvokeWithMethodAndArg
                                      )
                                    : callInvokeWithMethodAndArg());
                        }

                        // Define the unified helper method that is used to implement .next,
                        // .throw, and .return (see defineIteratorMethods).
                        this._invoke = enqueue;
                    }

                    defineIteratorMethods(AsyncIterator.prototype);
                    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
                        return this;
                    };
                    exports.AsyncIterator = AsyncIterator;

                    // Note that simple async functions are implemented on top of
                    // AsyncIterator objects; they just return a Promise for the value of
                    // the final result produced by the iterator.
                    exports.async = function (
                        innerFn,
                        outerFn,
                        self,
                        tryLocsList
                    ) {
                        var iter = new AsyncIterator(
                            wrap(innerFn, outerFn, self, tryLocsList)
                        );

                        return exports.isGeneratorFunction(outerFn)
                            ? iter // If outerFn is a generator, return the full iterator.
                            : iter.next().then(function (result) {
                                  return result.done
                                      ? result.value
                                      : iter.next();
                              });
                    };

                    function makeInvokeMethod(innerFn, self, context) {
                        var state = GenStateSuspendedStart;

                        return function invoke(method, arg) {
                            if (state === GenStateExecuting) {
                                throw new Error('Generator is already running');
                            }

                            if (state === GenStateCompleted) {
                                if (method === 'throw') {
                                    throw arg;
                                }

                                // Be forgiving, per 25.3.3.3.3 of the spec:
                                // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
                                return doneResult();
                            }

                            context.method = method;
                            context.arg = arg;

                            while (true) {
                                var delegate = context.delegate;
                                if (delegate) {
                                    var delegateResult = maybeInvokeDelegate(
                                        delegate,
                                        context
                                    );
                                    if (delegateResult) {
                                        if (delegateResult === ContinueSentinel)
                                            continue;
                                        return delegateResult;
                                    }
                                }

                                if (context.method === 'next') {
                                    // Setting context._sent for legacy support of Babel's
                                    // function.sent implementation.
                                    context.sent = context._sent = context.arg;
                                } else if (context.method === 'throw') {
                                    if (state === GenStateSuspendedStart) {
                                        state = GenStateCompleted;
                                        throw context.arg;
                                    }

                                    context.dispatchException(context.arg);
                                } else if (context.method === 'return') {
                                    context.abrupt('return', context.arg);
                                }

                                state = GenStateExecuting;

                                var record = tryCatch(innerFn, self, context);
                                if (record.type === 'normal') {
                                    // If an exception is thrown from innerFn, we leave state ===
                                    // GenStateExecuting and loop back for another invocation.
                                    state = context.done
                                        ? GenStateCompleted
                                        : GenStateSuspendedYield;

                                    if (record.arg === ContinueSentinel) {
                                        continue;
                                    }

                                    return {
                                        value: record.arg,
                                        done: context.done,
                                    };
                                } else if (record.type === 'throw') {
                                    state = GenStateCompleted;
                                    // Dispatch the exception by looping back around to the
                                    // context.dispatchException(context.arg) call above.
                                    context.method = 'throw';
                                    context.arg = record.arg;
                                }
                            }
                        };
                    }

                    // Call delegate.iterator[context.method](context.arg) and handle the
                    // result, either by returning a { value, done } result from the
                    // delegate iterator, or by modifying context.method and context.arg,
                    // setting context.delegate to null, and returning the ContinueSentinel.
                    function maybeInvokeDelegate(delegate, context) {
                        var method = delegate.iterator[context.method];
                        if (method === undefined) {
                            // A .throw or .return when the delegate iterator has no .throw
                            // method always terminates the yield* loop.
                            context.delegate = null;

                            if (context.method === 'throw') {
                                // Note: ["return"] must be used for ES3 parsing compatibility.
                                if (delegate.iterator['return']) {
                                    // If the delegate iterator has a return method, give it a
                                    // chance to clean up.
                                    context.method = 'return';
                                    context.arg = undefined;
                                    maybeInvokeDelegate(delegate, context);

                                    if (context.method === 'throw') {
                                        // If maybeInvokeDelegate(context) changed context.method from
                                        // "return" to "throw", let that override the TypeError below.
                                        return ContinueSentinel;
                                    }
                                }

                                context.method = 'throw';
                                context.arg = new TypeError(
                                    "The iterator does not provide a 'throw' method"
                                );
                            }

                            return ContinueSentinel;
                        }

                        var record = tryCatch(
                            method,
                            delegate.iterator,
                            context.arg
                        );

                        if (record.type === 'throw') {
                            context.method = 'throw';
                            context.arg = record.arg;
                            context.delegate = null;
                            return ContinueSentinel;
                        }

                        var info = record.arg;

                        if (!info) {
                            context.method = 'throw';
                            context.arg = new TypeError(
                                'iterator result is not an object'
                            );
                            context.delegate = null;
                            return ContinueSentinel;
                        }

                        if (info.done) {
                            // Assign the result of the finished delegate to the temporary
                            // variable specified by delegate.resultName (see delegateYield).
                            context[delegate.resultName] = info.value;

                            // Resume execution at the desired location (see delegateYield).
                            context.next = delegate.nextLoc;

                            // If context.method was "throw" but the delegate handled the
                            // exception, let the outer generator proceed normally. If
                            // context.method was "next", forget context.arg since it has been
                            // "consumed" by the delegate iterator. If context.method was
                            // "return", allow the original .return call to continue in the
                            // outer generator.
                            if (context.method !== 'return') {
                                context.method = 'next';
                                context.arg = undefined;
                            }
                        } else {
                            // Re-yield the result returned by the delegate method.
                            return info;
                        }

                        // The delegate iterator is finished, so forget it and continue with
                        // the outer generator.
                        context.delegate = null;
                        return ContinueSentinel;
                    }

                    // Define Generator.prototype.{next,throw,return} in terms of the
                    // unified ._invoke helper method.
                    defineIteratorMethods(Gp);

                    Gp[toStringTagSymbol] = 'Generator';

                    // A Generator should always return itself as the iterator object when the
                    // @@iterator function is called on it. Some browsers' implementations of the
                    // iterator prototype chain incorrectly implement this, causing the Generator
                    // object to not be returned from this call. This ensures that doesn't happen.
                    // See https://github.com/facebook/regenerator/issues/274 for more details.
                    Gp[iteratorSymbol] = function () {
                        return this;
                    };

                    Gp.toString = function () {
                        return '[object Generator]';
                    };

                    function pushTryEntry(locs) {
                        var entry = { tryLoc: locs[0] };

                        if (1 in locs) {
                            entry.catchLoc = locs[1];
                        }

                        if (2 in locs) {
                            entry.finallyLoc = locs[2];
                            entry.afterLoc = locs[3];
                        }

                        this.tryEntries.push(entry);
                    }

                    function resetTryEntry(entry) {
                        var record = entry.completion || {};
                        record.type = 'normal';
                        delete record.arg;
                        entry.completion = record;
                    }

                    function Context(tryLocsList) {
                        // The root entry object (effectively a try statement without a catch
                        // or a finally block) gives us a place to store values thrown from
                        // locations where there is no enclosing try statement.
                        this.tryEntries = [{ tryLoc: 'root' }];
                        tryLocsList.forEach(pushTryEntry, this);
                        this.reset(true);
                    }

                    exports.keys = function (object) {
                        var keys = [];
                        for (var key in object) {
                            keys.push(key);
                        }
                        keys.reverse();

                        // Rather than returning an object with a next method, we keep
                        // things simple and return the next function itself.
                        return function next() {
                            while (keys.length) {
                                var key = keys.pop();
                                if (key in object) {
                                    next.value = key;
                                    next.done = false;
                                    return next;
                                }
                            }

                            // To avoid creating an additional object, we just hang the .value
                            // and .done properties off the next function object itself. This
                            // also ensures that the minifier will not anonymize the function.
                            next.done = true;
                            return next;
                        };
                    };

                    function values(iterable) {
                        if (iterable) {
                            var iteratorMethod = iterable[iteratorSymbol];
                            if (iteratorMethod) {
                                return iteratorMethod.call(iterable);
                            }

                            if (typeof iterable.next === 'function') {
                                return iterable;
                            }

                            if (!isNaN(iterable.length)) {
                                var i = -1,
                                    next = function next() {
                                        while (++i < iterable.length) {
                                            if (hasOwn.call(iterable, i)) {
                                                next.value = iterable[i];
                                                next.done = false;
                                                return next;
                                            }
                                        }

                                        next.value = undefined;
                                        next.done = true;

                                        return next;
                                    };

                                return (next.next = next);
                            }
                        }

                        // Return an iterator with no values.
                        return { next: doneResult };
                    }
                    exports.values = values;

                    function doneResult() {
                        return { value: undefined, done: true };
                    }

                    Context.prototype = {
                        constructor: Context,

                        reset: function (skipTempReset) {
                            this.prev = 0;
                            this.next = 0;
                            // Resetting context._sent for legacy support of Babel's
                            // function.sent implementation.
                            this.sent = this._sent = undefined;
                            this.done = false;
                            this.delegate = null;

                            this.method = 'next';
                            this.arg = undefined;

                            this.tryEntries.forEach(resetTryEntry);

                            if (!skipTempReset) {
                                for (var name in this) {
                                    // Not sure about the optimal order of these conditions:
                                    if (
                                        name.charAt(0) === 't' &&
                                        hasOwn.call(this, name) &&
                                        !isNaN(+name.slice(1))
                                    ) {
                                        this[name] = undefined;
                                    }
                                }
                            }
                        },

                        stop: function () {
                            this.done = true;

                            var rootEntry = this.tryEntries[0];
                            var rootRecord = rootEntry.completion;
                            if (rootRecord.type === 'throw') {
                                throw rootRecord.arg;
                            }

                            return this.rval;
                        },

                        dispatchException: function (exception) {
                            if (this.done) {
                                throw exception;
                            }

                            var context = this;
                            function handle(loc, caught) {
                                record.type = 'throw';
                                record.arg = exception;
                                context.next = loc;

                                if (caught) {
                                    // If the dispatched exception was caught by a catch block,
                                    // then let that catch block handle the exception normally.
                                    context.method = 'next';
                                    context.arg = undefined;
                                }

                                return !!caught;
                            }

                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
                                var entry = this.tryEntries[i];
                                var record = entry.completion;

                                if (entry.tryLoc === 'root') {
                                    // Exception thrown outside of any try block that could handle
                                    // it, so set the completion value of the entire function to
                                    // throw the exception.
                                    return handle('end');
                                }

                                if (entry.tryLoc <= this.prev) {
                                    var hasCatch = hasOwn.call(
                                        entry,
                                        'catchLoc'
                                    );
                                    var hasFinally = hasOwn.call(
                                        entry,
                                        'finallyLoc'
                                    );

                                    if (hasCatch && hasFinally) {
                                        if (this.prev < entry.catchLoc) {
                                            return handle(entry.catchLoc, true);
                                        } else if (
                                            this.prev < entry.finallyLoc
                                        ) {
                                            return handle(entry.finallyLoc);
                                        }
                                    } else if (hasCatch) {
                                        if (this.prev < entry.catchLoc) {
                                            return handle(entry.catchLoc, true);
                                        }
                                    } else if (hasFinally) {
                                        if (this.prev < entry.finallyLoc) {
                                            return handle(entry.finallyLoc);
                                        }
                                    } else {
                                        throw new Error(
                                            'try statement without catch or finally'
                                        );
                                    }
                                }
                            }
                        },

                        abrupt: function (type, arg) {
                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
                                var entry = this.tryEntries[i];
                                if (
                                    entry.tryLoc <= this.prev &&
                                    hasOwn.call(entry, 'finallyLoc') &&
                                    this.prev < entry.finallyLoc
                                ) {
                                    var finallyEntry = entry;
                                    break;
                                }
                            }

                            if (
                                finallyEntry &&
                                (type === 'break' || type === 'continue') &&
                                finallyEntry.tryLoc <= arg &&
                                arg <= finallyEntry.finallyLoc
                            ) {
                                // Ignore the finally entry if control is not jumping to a
                                // location outside the try/catch block.
                                finallyEntry = null;
                            }

                            var record = finallyEntry
                                ? finallyEntry.completion
                                : {};
                            record.type = type;
                            record.arg = arg;

                            if (finallyEntry) {
                                this.method = 'next';
                                this.next = finallyEntry.finallyLoc;
                                return ContinueSentinel;
                            }

                            return this.complete(record);
                        },

                        complete: function (record, afterLoc) {
                            if (record.type === 'throw') {
                                throw record.arg;
                            }

                            if (
                                record.type === 'break' ||
                                record.type === 'continue'
                            ) {
                                this.next = record.arg;
                            } else if (record.type === 'return') {
                                this.rval = this.arg = record.arg;
                                this.method = 'return';
                                this.next = 'end';
                            } else if (record.type === 'normal' && afterLoc) {
                                this.next = afterLoc;
                            }

                            return ContinueSentinel;
                        },

                        finish: function (finallyLoc) {
                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
                                var entry = this.tryEntries[i];
                                if (entry.finallyLoc === finallyLoc) {
                                    this.complete(
                                        entry.completion,
                                        entry.afterLoc
                                    );
                                    resetTryEntry(entry);
                                    return ContinueSentinel;
                                }
                            }
                        },

                        catch: function (tryLoc) {
                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
                                var entry = this.tryEntries[i];
                                if (entry.tryLoc === tryLoc) {
                                    var record = entry.completion;
                                    if (record.type === 'throw') {
                                        var thrown = record.arg;
                                        resetTryEntry(entry);
                                    }
                                    return thrown;
                                }
                            }

                            // The context.catch method must only be called with a location
                            // argument that corresponds to a known catch block.
                            throw new Error('illegal catch attempt');
                        },

                        delegateYield: function (
                            iterable,
                            resultName,
                            nextLoc
                        ) {
                            this.delegate = {
                                iterator: values(iterable),
                                resultName: resultName,
                                nextLoc: nextLoc,
                            };

                            if (this.method === 'next') {
                                // Deliberately forget the last sent value so that we don't
                                // accidentally pass it on to the delegate.
                                this.arg = undefined;
                            }

                            return ContinueSentinel;
                        },
                    };

                    // Regardless of whether this script is executing as a CommonJS module
                    // or not, return the runtime object so that we can declare the variable
                    // regeneratorRuntime in the outer scope, which allows this module to be
                    // injected easily by `bin/regenerator --include-runtime script.js`.
                    return exports;
                })(
                    // If this script is executing as a CommonJS module, use module.exports
                    // as the regeneratorRuntime namespace. Otherwise create a new empty
                    // object. Either way, the resulting object will be used to initialize
                    // the regeneratorRuntime variable at the top of this file.
                    typeof module === 'object' ? module.exports : {}
                );

                try {
                    regeneratorRuntime = runtime;
                } catch (accidentalStrictMode) {
                    // This module should not be running in strict mode, so the above
                    // assignment should always work unless something is misconfigured. Just
                    // in case runtime.js accidentally runs in strict mode, we can escape
                    // strict mode using a global Function call. This could conceivably fail
                    // if a Content Security Policy forbids using Function, but in that case
                    // the proper solution is to fix the accidental strict mode problem. If
                    // you've misconfigured your bundler to force strict mode and applied a
                    // CSP to forbid Function, and you're not willing to fix either of those
                    // problems, please detail your unique predicament in a GitHub issue.
                    Function('r', 'regeneratorRuntime = r')(runtime);
                }
            },
            {},
        ],
        31: [
            function (require, module, exports) {
                (function (self) {
                    'use strict';

                    if (self.fetch) {
                        return;
                    }

                    var support = {
                        searchParams: 'URLSearchParams' in self,
                        iterable: 'Symbol' in self && 'iterator' in Symbol,
                        blob:
                            'FileReader' in self &&
                            'Blob' in self &&
                            (function () {
                                try {
                                    new Blob();
                                    return true;
                                } catch (e) {
                                    return false;
                                }
                            })(),
                        formData: 'FormData' in self,
                        arrayBuffer: 'ArrayBuffer' in self,
                    };

                    if (support.arrayBuffer) {
                        var viewClasses = [
                            '[object Int8Array]',
                            '[object Uint8Array]',
                            '[object Uint8ClampedArray]',
                            '[object Int16Array]',
                            '[object Uint16Array]',
                            '[object Int32Array]',
                            '[object Uint32Array]',
                            '[object Float32Array]',
                            '[object Float64Array]',
                        ];

                        var isDataView = function (obj) {
                            return obj && DataView.prototype.isPrototypeOf(obj);
                        };

                        var isArrayBufferView =
                            ArrayBuffer.isView ||
                            function (obj) {
                                return (
                                    obj &&
                                    viewClasses.indexOf(
                                        Object.prototype.toString.call(obj)
                                    ) > -1
                                );
                            };
                    }

                    function normalizeName(name) {
                        if (typeof name !== 'string') {
                            name = String(name);
                        }
                        if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
                            throw new TypeError(
                                'Invalid character in header field name'
                            );
                        }
                        return name.toLowerCase();
                    }

                    function normalizeValue(value) {
                        if (typeof value !== 'string') {
                            value = String(value);
                        }
                        return value;
                    }

                    // Build a destructive iterator for the value list
                    function iteratorFor(items) {
                        var iterator = {
                            next: function () {
                                var value = items.shift();
                                return {
                                    done: value === undefined,
                                    value: value,
                                };
                            },
                        };

                        if (support.iterable) {
                            iterator[Symbol.iterator] = function () {
                                return iterator;
                            };
                        }

                        return iterator;
                    }

                    function Headers(headers) {
                        this.map = {};

                        if (headers instanceof Headers) {
                            headers.forEach(function (value, name) {
                                this.append(name, value);
                            }, this);
                        } else if (Array.isArray(headers)) {
                            headers.forEach(function (header) {
                                this.append(header[0], header[1]);
                            }, this);
                        } else if (headers) {
                            Object.getOwnPropertyNames(headers).forEach(
                                function (name) {
                                    this.append(name, headers[name]);
                                },
                                this
                            );
                        }
                    }

                    Headers.prototype.append = function (name, value) {
                        name = normalizeName(name);
                        value = normalizeValue(value);
                        var oldValue = this.map[name];
                        this.map[name] = oldValue
                            ? oldValue + ',' + value
                            : value;
                    };

                    Headers.prototype['delete'] = function (name) {
                        delete this.map[normalizeName(name)];
                    };

                    Headers.prototype.get = function (name) {
                        name = normalizeName(name);
                        return this.has(name) ? this.map[name] : null;
                    };

                    Headers.prototype.has = function (name) {
                        return this.map.hasOwnProperty(normalizeName(name));
                    };

                    Headers.prototype.set = function (name, value) {
                        this.map[normalizeName(name)] = normalizeValue(value);
                    };

                    Headers.prototype.forEach = function (callback, thisArg) {
                        for (var name in this.map) {
                            if (this.map.hasOwnProperty(name)) {
                                callback.call(
                                    thisArg,
                                    this.map[name],
                                    name,
                                    this
                                );
                            }
                        }
                    };

                    Headers.prototype.keys = function () {
                        var items = [];
                        this.forEach(function (value, name) {
                            items.push(name);
                        });
                        return iteratorFor(items);
                    };

                    Headers.prototype.values = function () {
                        var items = [];
                        this.forEach(function (value) {
                            items.push(value);
                        });
                        return iteratorFor(items);
                    };

                    Headers.prototype.entries = function () {
                        var items = [];
                        this.forEach(function (value, name) {
                            items.push([name, value]);
                        });
                        return iteratorFor(items);
                    };

                    if (support.iterable) {
                        Headers.prototype[Symbol.iterator] =
                            Headers.prototype.entries;
                    }

                    function consumed(body) {
                        if (body.bodyUsed) {
                            return Promise.reject(
                                new TypeError('Already read')
                            );
                        }
                        body.bodyUsed = true;
                    }

                    function fileReaderReady(reader) {
                        return new Promise(function (resolve, reject) {
                            reader.onload = function () {
                                resolve(reader.result);
                            };
                            reader.onerror = function () {
                                reject(reader.error);
                            };
                        });
                    }

                    function readBlobAsArrayBuffer(blob) {
                        var reader = new FileReader();
                        var promise = fileReaderReady(reader);
                        reader.readAsArrayBuffer(blob);
                        return promise;
                    }

                    function readBlobAsText(blob) {
                        var reader = new FileReader();
                        var promise = fileReaderReady(reader);
                        reader.readAsText(blob);
                        return promise;
                    }

                    function readArrayBufferAsText(buf) {
                        var view = new Uint8Array(buf);
                        var chars = new Array(view.length);

                        for (var i = 0; i < view.length; i++) {
                            chars[i] = String.fromCharCode(view[i]);
                        }
                        return chars.join('');
                    }

                    function bufferClone(buf) {
                        if (buf.slice) {
                            return buf.slice(0);
                        } else {
                            var view = new Uint8Array(buf.byteLength);
                            view.set(new Uint8Array(buf));
                            return view.buffer;
                        }
                    }

                    function Body() {
                        this.bodyUsed = false;

                        this._initBody = function (body) {
                            this._bodyInit = body;
                            if (!body) {
                                this._bodyText = '';
                            } else if (typeof body === 'string') {
                                this._bodyText = body;
                            } else if (
                                support.blob &&
                                Blob.prototype.isPrototypeOf(body)
                            ) {
                                this._bodyBlob = body;
                            } else if (
                                support.formData &&
                                FormData.prototype.isPrototypeOf(body)
                            ) {
                                this._bodyFormData = body;
                            } else if (
                                support.searchParams &&
                                URLSearchParams.prototype.isPrototypeOf(body)
                            ) {
                                this._bodyText = body.toString();
                            } else if (
                                support.arrayBuffer &&
                                support.blob &&
                                isDataView(body)
                            ) {
                                this._bodyArrayBuffer = bufferClone(
                                    body.buffer
                                );
                                // IE 10-11 can't handle a DataView body.
                                this._bodyInit = new Blob([
                                    this._bodyArrayBuffer,
                                ]);
                            } else if (
                                support.arrayBuffer &&
                                (ArrayBuffer.prototype.isPrototypeOf(body) ||
                                    isArrayBufferView(body))
                            ) {
                                this._bodyArrayBuffer = bufferClone(body);
                            } else {
                                throw new Error('unsupported BodyInit type');
                            }

                            if (!this.headers.get('content-type')) {
                                if (typeof body === 'string') {
                                    this.headers.set(
                                        'content-type',
                                        'text/plain;charset=UTF-8'
                                    );
                                } else if (
                                    this._bodyBlob &&
                                    this._bodyBlob.type
                                ) {
                                    this.headers.set(
                                        'content-type',
                                        this._bodyBlob.type
                                    );
                                } else if (
                                    support.searchParams &&
                                    URLSearchParams.prototype.isPrototypeOf(
                                        body
                                    )
                                ) {
                                    this.headers.set(
                                        'content-type',
                                        'application/x-www-form-urlencoded;charset=UTF-8'
                                    );
                                }
                            }
                        };

                        if (support.blob) {
                            this.blob = function () {
                                var rejected = consumed(this);
                                if (rejected) {
                                    return rejected;
                                }

                                if (this._bodyBlob) {
                                    return Promise.resolve(this._bodyBlob);
                                } else if (this._bodyArrayBuffer) {
                                    return Promise.resolve(
                                        new Blob([this._bodyArrayBuffer])
                                    );
                                } else if (this._bodyFormData) {
                                    throw new Error(
                                        'could not read FormData body as blob'
                                    );
                                } else {
                                    return Promise.resolve(
                                        new Blob([this._bodyText])
                                    );
                                }
                            };

                            this.arrayBuffer = function () {
                                if (this._bodyArrayBuffer) {
                                    return (
                                        consumed(this) ||
                                        Promise.resolve(this._bodyArrayBuffer)
                                    );
                                } else {
                                    return this.blob().then(
                                        readBlobAsArrayBuffer
                                    );
                                }
                            };
                        }

                        this.text = function () {
                            var rejected = consumed(this);
                            if (rejected) {
                                return rejected;
                            }

                            if (this._bodyBlob) {
                                return readBlobAsText(this._bodyBlob);
                            } else if (this._bodyArrayBuffer) {
                                return Promise.resolve(
                                    readArrayBufferAsText(this._bodyArrayBuffer)
                                );
                            } else if (this._bodyFormData) {
                                throw new Error(
                                    'could not read FormData body as text'
                                );
                            } else {
                                return Promise.resolve(this._bodyText);
                            }
                        };

                        if (support.formData) {
                            this.formData = function () {
                                return this.text().then(decode);
                            };
                        }

                        this.json = function () {
                            return this.text().then(JSON.parse);
                        };

                        return this;
                    }

                    // HTTP methods whose capitalization should be normalized
                    var methods = [
                        'DELETE',
                        'GET',
                        'HEAD',
                        'OPTIONS',
                        'POST',
                        'PUT',
                    ];

                    function normalizeMethod(method) {
                        var upcased = method.toUpperCase();
                        return methods.indexOf(upcased) > -1 ? upcased : method;
                    }

                    function Request(input, options) {
                        options = options || {};
                        var body = options.body;

                        if (input instanceof Request) {
                            if (input.bodyUsed) {
                                throw new TypeError('Already read');
                            }
                            this.url = input.url;
                            this.credentials = input.credentials;
                            if (!options.headers) {
                                this.headers = new Headers(input.headers);
                            }
                            this.method = input.method;
                            this.mode = input.mode;
                            if (!body && input._bodyInit != null) {
                                body = input._bodyInit;
                                input.bodyUsed = true;
                            }
                        } else {
                            this.url = String(input);
                        }

                        this.credentials =
                            options.credentials || this.credentials || 'omit';
                        if (options.headers || !this.headers) {
                            this.headers = new Headers(options.headers);
                        }
                        this.method = normalizeMethod(
                            options.method || this.method || 'GET'
                        );
                        this.mode = options.mode || this.mode || null;
                        this.referrer = null;

                        if (
                            (this.method === 'GET' || this.method === 'HEAD') &&
                            body
                        ) {
                            throw new TypeError(
                                'Body not allowed for GET or HEAD requests'
                            );
                        }
                        this._initBody(body);
                    }

                    Request.prototype.clone = function () {
                        return new Request(this, { body: this._bodyInit });
                    };

                    function decode(body) {
                        var form = new FormData();
                        body.trim()
                            .split('&')
                            .forEach(function (bytes) {
                                if (bytes) {
                                    var split = bytes.split('=');
                                    var name = split
                                        .shift()
                                        .replace(/\+/g, ' ');
                                    var value = split
                                        .join('=')
                                        .replace(/\+/g, ' ');
                                    form.append(
                                        decodeURIComponent(name),
                                        decodeURIComponent(value)
                                    );
                                }
                            });
                        return form;
                    }

                    function parseHeaders(rawHeaders) {
                        var headers = new Headers();
                        rawHeaders.split(/\r?\n/).forEach(function (line) {
                            var parts = line.split(':');
                            var key = parts.shift().trim();
                            if (key) {
                                var value = parts.join(':').trim();
                                headers.append(key, value);
                            }
                        });
                        return headers;
                    }

                    Body.call(Request.prototype);

                    function Response(bodyInit, options) {
                        if (!options) {
                            options = {};
                        }

                        this.type = 'default';
                        this.status =
                            'status' in options ? options.status : 200;
                        this.ok = this.status >= 200 && this.status < 300;
                        this.statusText =
                            'statusText' in options ? options.statusText : 'OK';
                        this.headers = new Headers(options.headers);
                        this.url = options.url || '';
                        this._initBody(bodyInit);
                    }

                    Body.call(Response.prototype);

                    Response.prototype.clone = function () {
                        return new Response(this._bodyInit, {
                            status: this.status,
                            statusText: this.statusText,
                            headers: new Headers(this.headers),
                            url: this.url,
                        });
                    };

                    Response.error = function () {
                        var response = new Response(null, {
                            status: 0,
                            statusText: '',
                        });
                        response.type = 'error';
                        return response;
                    };

                    var redirectStatuses = [301, 302, 303, 307, 308];

                    Response.redirect = function (url, status) {
                        if (redirectStatuses.indexOf(status) === -1) {
                            throw new RangeError('Invalid status code');
                        }

                        return new Response(null, {
                            status: status,
                            headers: { location: url },
                        });
                    };

                    self.Headers = Headers;
                    self.Request = Request;
                    self.Response = Response;

                    self.fetch = function (input, init) {
                        return new Promise(function (resolve, reject) {
                            var request = new Request(input, init);
                            var xhr = new XMLHttpRequest();

                            xhr.onload = function () {
                                var options = {
                                    status: xhr.status,
                                    statusText: xhr.statusText,
                                    headers: parseHeaders(
                                        xhr.getAllResponseHeaders() || ''
                                    ),
                                };
                                options.url =
                                    'responseURL' in xhr
                                        ? xhr.responseURL
                                        : options.headers.get('X-Request-URL');
                                var body =
                                    'response' in xhr
                                        ? xhr.response
                                        : xhr.responseText;
                                resolve(new Response(body, options));
                            };

                            xhr.onerror = function () {
                                reject(new TypeError('Network request failed'));
                            };

                            xhr.ontimeout = function () {
                                reject(new TypeError('Network request failed'));
                            };

                            xhr.open(request.method, request.url, true);

                            if (request.credentials === 'include') {
                                xhr.withCredentials = true;
                            }

                            if ('responseType' in xhr && support.blob) {
                                xhr.responseType = 'blob';
                            }

                            request.headers.forEach(function (value, name) {
                                xhr.setRequestHeader(name, value);
                            });

                            xhr.send(
                                typeof request._bodyInit === 'undefined'
                                    ? null
                                    : request._bodyInit
                            );
                        });
                    };
                    self.fetch.polyfill = true;
                })(typeof self !== 'undefined' ? self : this);
            },
            {},
        ],
    },
    {},
    [4]
);
