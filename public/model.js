window.model = (() => {
    // base_model is used to check the structure of any incoming data

    // For example, if we try to give the data: users: [{user_id: true}],
    // it will cause a mismatch because we want user_id to be an integer.

    // Some additional constraints are in the code to merge new data into
    // existing data; see the merge function a bit below in the file.
    const base_model = {
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

    const classes = {};

    classes.user = class User {
        constructor(data) {
            // fields from Zulip's API
            this.avatar_url = data.avatar_url;
            this.avatar_version = data.avatar_version;
            this.date_joined = data.date_joined;
            this.email = data.email;
            this.full_name = data.full_name;
            this.is_active = data.is_active;
            this.is_admin = data.is_admin;
            this.is_bot = data.is_bot;
            this.is_guest = data.is_guest;
            this.is_owner = data.is_owner;
            this.timezone = data.timezone;
            this.user_id = data.user_id;
        }

        get name() {
            return this.full_name;
        }
        set name(name) {
            this.full_name = name;
        }
        get id() {
            return this.user_id;
        }
        set id(id) {
            this.user_id = id;
        }
    };

    classes.stream = class Stream {
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
        }

        get id() {
            return this.stream_id;
        }
        set id(id) {
            this.stream_id = id;
        }

        get subs() {
            const subs = [];
            // This is an O(n^2) operation. Let's make the server return subs with user_ids
            // instead of emails so we can easily make this O(n).
            this.subscribers.forEach((sub) => {
                try {
                    subs.push(Users.filter((user) => user.email === sub)[0]);
                } catch (err) {
                    // probably the user isn't loaded yet; ignore
                    console.warn(err);
                }
            });
            return subs;
        }
    };

    const users = {};
    const streams = {}; // id, data pairs

    const ZulipAccessor = function (type, data_obj) {
        return {
            add: function (data) {
                // this part might cause issues with messages later.
                const key = `${type}_id`;

                if (data_obj[data[key]]) {
                    throw new Error(
                        `${type} with id ${data.id} already added!`
                    );
                }
                data_obj[data[key]] = new classes[type](data);
            },
            by_id: function (id) {
                const item = data_obj[id];
                if (!item) {
                    throw new Error(`${type} with id ${id} not found!`);
                }
                return item;
            },
            by_name: function (name) {
                for (key in data_obj) {
                    if (data_obj[key].name === name) {
                        return data_obj[key];
                    }
                }
                throw new Error(`${type} with name ${name} not found!`);
            },
            clone: function () {
                return Object.assign({}, data_obj);
            },
            filter: function (fn) {
                const results = [];
                fn = fn || (() => true); // return all by default;
                for (key in data_obj) {
                    if (fn(data_obj[key]) === true) {
                        results.push(data_obj[key]);
                    }
                }
                return results;
            },
            list: function () {
                return this.filter();
            },
        };
    };

    const Streams = ZulipAccessor('stream', streams);
    const Users = ZulipAccessor('user', users);

    return {
        main,
        Streams,
        Users,
    };
})();

if (typeof module !== 'undefined') {
    module.exports = window.model;
}
