window.model = (() => {
    // base_model is used to check the structure of any incoming data

    // For example, if we try to give the data: users: [{user_id: true}],
    // it will cause a mismatch because we want user_id to be an integer.

    // Some additional constraints are in the code to merge new data into
    // existing data; see the merge function a bit below in the file.
    const base_model = {
        users: [
            {
                user_id: 1,
            },
        ],
        messages: [
            {
                id: 1,
                content: 'string',
            },
        ],
        state: {
            user_id: 1,
            server: 'string',
            queue_id: 'string',
        },
    };

    let model = {
        users: [],
        messages: [],
        state: {
            user_id: null,
            queue_id: null,
        },
    };

    const is_object = (value) => {
        return typeof value === 'object' && !Array.isArray(value);
    };

    const has_same_structure = (new_model, base) => {
        for (const [key, value] of Object.entries(new_model)) {
            if (base[key]) {
                const type_check = typeof base[key] === typeof value;
                const array_check =
                    Array.isArray(base[key]) === Array.isArray(value);
                if (!type_check) {
                    throw new Error(
                        `Invalid data: "${key}: ${value}" should be ${typeof base[
                            key
                        ]} but is ${typeof value}`,
                        new_model
                    );
                } else if (!array_check) {
                    throw new Error(
                        `Invalid data: "${key}: ${value}" should ${
                            Array.isArray(base[key]) ? '' : 'not '
                        }be an Array`,
                        new_model
                    );
                }
                if (is_object(value)) {
                    has_same_structure(value, base[key]);
                }
                if (Array.isArray(value) && base[key][0] !== undefined) {
                    value.forEach((e) => {
                        has_same_structure(e, base[key][0]);
                    });
                }
            }
        }
    };

    const verify = (new_model) => {
        if (!is_object(new_model))
            throw new Error('Invalid data: Expected Object');
        has_same_structure(new_model, base_model);
    };

    const merge = (new_model) => {
        const merge_messages = (a, b) => {
            // for conflicts: overwrite local message with one from server.
            b.forEach((m) => {
                const idx = a.findIndex((e) => e.id === m.id);
                if (idx === -1) {
                    a.push(m);
                } else {
                    // merge the two messages.
                    // we do this to handle message updates and update_message
                    // events don't contain all the information about the message.
                    a[idx] = Object.assign(a[idx], m);
                }
            });
            return a;
        };

        const opts = {
            customMerge: (key) => {
                if (key === 'messages') {
                    return merge_messages;
                }
            },
        };
        model = deepmerge(model, new_model, opts);
        return model;
    };

    const main = (new_model, overwrite = false) => {
        if (new_model) {
            verify(new_model);
            if (overwrite) {
                model = new_model;
            } else {
                model = merge(new_model);
            }
        }
        return model;
    };

    class Stream {
        constructor(data) {
            // fields from Zulip's API
            this.name = data.name;
            this.stream_id = data.stream_id;
            this.date_created = data.date_created;
            this.description = data.description;
            this.first_message_id = data.first_message_id;
            this.history_public_to_subscribers =
                data.history_public_to_subscribers;
            this.invite_only = data.invite_only;
            this.is_announcement_only = data.is_announcement_only;
            this.is_web_public = data.is_web_public;
            this.message_retention_days = data.message_retention_days;
            this.rendered_description = data.rendered_description;
            this.stream_post_policy = data.stream_post_policy;
            this.subscribers = data.subscribers;

            // our fields
            this.topics = [];
        }
    }
    const streams = {}; // id, data pairs

    const Streams = {
        add: function (data) {
            if (streams[data.stream_id]) {
                throw new Error(
                    `Stream with id ${data.stream_id} already added!`
                );
            }
            streams[data.stream_id] = new Stream(data);
        },
        by_id: function (id) {
            const stream = streams[id];
            if (!stream) {
                throw new Error(`Stream with id ${id} not found!`);
            }
            return stream;
        },
        by_name: function (name) {
            for (key in streams) {
                if (streams[key].name === name) {
                    return streams[key];
                }
            }
            throw new Error(`Stream with name ${name} not found!`);
        },
        filter: function (fn) {
            const results = [];
            fn = fn || (() => true); // return all by default;
            for (key in streams) {
                if (fn(streams[key]) === true) {
                    results.push(streams[key]);
                }
            }
            return results;
        },
    };

    return {
        main,
        Streams,
    };
})();

if (typeof module !== 'undefined') {
    module.exports = window.model;
}
