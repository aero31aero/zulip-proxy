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
};
