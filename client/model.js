window.model = (() => {
    // The legacy model, now just an object that the developers are responsible
    // for maintaining the consistency of. For any serious data, we write dedicated
    // models using Classes.
    const main = {};

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

    classes.message = class Message {
        constructor(data) {
            this.id = data.id;
            this.sender_id = data.sender_id;
            this.content = data.content;
            this.recipient_id = data.recipient_id;
            this.timestamp = data.timestamp;
            this.client = data.client;
            this.subject = data.subject;
            this.topic_links = data.topic_links;
            this.is_me_message = data.is_me_message;
            this.reactions = data.reactions;
            this.submessages = data.submessages;
            this.sender_full_name = data.sender_full_name;
            this.sender_email = data.sender_email;
            this.sender_realm_str = data.sender_realm_str;
            this.display_recipient = data.display_recipient;
            this.type = data.type;
            this.avatar_url = data.avatar_url;
            this.content_type = data.content_type;
        }
    };

    const users = {};
    const streams = {}; // id, data pairs
    const messages = {}; // id, data pairs

    const ZulipAccessor = function (type, data_obj) {
        return {
            add: function (data) {
                let key = `${type}_id`;
                if (data[key] === undefined) {
                    key = 'id'; // messages don't have message_id but streams and users do.
                }

                if (data_obj[data[key]]) {
                    throw new Error(
                        `${type} with id ${data[key]} already added!`
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
            by_id_maybe: function (id) {
                return data_obj[id];
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
    const Messages = ZulipAccessor('message', messages);
    Messages.update_message = (id, content) => {
        try {
            Messages.by_id(id).content = content;
        } catch (error) {
            // message is likely missing from our local data; ignore.
            console.error(error);
        }
    };

    return {
        main,
        Streams,
        Users,
        Messages,
    };
})();

if (typeof module !== 'undefined') {
    module.exports = window.model;
}
