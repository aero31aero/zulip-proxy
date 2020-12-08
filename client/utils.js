window._ = {
    get_user_by_id: (id) => model.Users.by_id(id),
    me: () => _.get_user_by_id(model.main.user_id),
    is_me: (user_id) => _.me().user_id === user_id,

    fetch_users: async () => {
        const response = await fetch('/z/users');
        const data = await response.json();
        data.members.forEach((e) => {
            if (!e.user_id) {
                console.log(e);
            }
            model.Users.add(e);
        });
    },

    fetch_messages: async () => {
        const params = $.param({
            // narrow: JSON.stringify([{ operator: 'is', operand: 'private' }]),
            num_before: 500,
            num_after: 0,
            anchor: 'newest',
        });
        const url = `/z/messages?${params}`;
        const response = await fetch(url);
        const data = await response.json();
        data.messages.forEach((message) => {
            model.Messages.add(message);
        });
    },

    fetch_streams: async () => {
        const params = $.param({
            include_subscribers: false,
        });
        const url = `z/users/me/subscriptions?${params}`;
        const response = await fetch(url);
        const data = await response.json();
        data.subscriptions.forEach((e) => {
            model.Streams.add(e);
        });
    },

    find_pms_with: (user_id) => {
        return model.Messages.filter((m) => {
            if (m.type !== 'private') {
                return false;
            }
            let recp = m.display_recipient;
            if (_.is_me(user_id)) {
                if (recp.length === 1) {
                    return true;
                }
                return false;
            }
            if (recp.length > 2) {
                // Group PMs. We don't support Group PMs.
                return false;
            }
            if (recp.findIndex((e) => e.id === user_id) !== -1) {
                return true;
            }
            return false;
        });
    },

    find_topics_for: (stream_id) => {
        const topics = new Set();

        for (const m of model.Messages.list()) {
            if (m.type !== 'stream') {
                continue;
            }

            if (m.stream_id.toString() === stream_id.toString()) {
                topics.add(m.subject);
            }
        }

        return Array.from(topics);
    },

    set_pane_title: (title, element) => {
        // sometimes elements aren't rendered; use a timeout so the element has been
        // rendered before we try to look up the tree for the pane wrapper.
        setTimeout(() => {
            element
                .closest('.pane-wrapper')
                .find('.controls-wrapper .title')
                .text(title);
        }, 0);
    },

    redraw: () => {
        $(document).trigger('zulipRedrawEverything');
    },
};
