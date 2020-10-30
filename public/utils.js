window._ = {
    get_user_by_id: (id) => model().users.find((e) => e.user_id === id),
    me: () => _.get_user_by_id(model().state.user_id),
    is_me: (user_id) => _.me().user_id === user_id,

    fetch_users: async () => {
        let users = model().users;
        if (users.length === 0) {
            const response = await fetch('/z/users');
            const data = await response.json();
            const members = data.members;
            members.sort((a, b) => a.full_name.localeCompare(b.full_name));
            users = model({ users: members }).users;
        }
        return users;
    },

    fetch_messages: async () => {
        const params = $.param({
            narrow: JSON.stringify([{ operator: 'is', operand: 'private' }]),
            num_before: 300,
            num_after: 0,
            anchor: 'newest',
        });
        const url = `/z/messages?${params}`;
        const response = await fetch(url);
        const data = await response.json();
        console.info('first message fetched', data.messages[0]);
        model({ messages: data.messages });
    },

    find_pms_with: (user_id) => {
        let messages = model().messages;
        return messages.filter((m) => {
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

    redraw: () => {
        $(document).trigger('zulipRedrawEverything');
    },
};
