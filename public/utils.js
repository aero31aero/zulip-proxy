window._ = {
    get_user_by_id: (id) => model().users.find((e) => e.user_id === id),
    me: () => _.get_user_by_id(model().state.user_id),
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
    fetch_streams: async () => {
        let streams = model().streams;
        if (streams.length === 0) {
            const response = await fetch('/z/users/me/subscriptions');
            const data = await response.json();
            const subs = data.subscriptions;
            subs.sort((a, b) => a.name.localeCompare(b.name));
            streams = model({ streams: subs }).streams;
        }
        return streams;
    },
    find_pms_with: (user_id) => {
        let messages = model().messages;
        return messages.filter((m) => {
            if (m.type !== 'private') {
                return false;
            }
            if (m.display_recipient.findIndex((e) => e.id === user_id) !== -1) {
                return true;
            }
            return false;
        });
    },
};
