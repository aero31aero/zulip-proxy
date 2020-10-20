let data;

async function get_user_data() {
    if (data === undefined) {
        const response = await fetch('/z/users');
        data = await response.json();
    }

    return data;
}

function build_user_view(user) {
    return () => {
        return $('<pre>').text(`user id: ${user.user_id}`);
    };
}

async function render() {
    const data = await get_user_data();
    const members = data.members;

    members.sort((a, b) => a.full_name.localeCompare(b.full_name));

    const conf = members.map((user) => ({
        label: user.full_name,
        view: build_user_view(user),
    }));

    const pane = await split_pane.render(conf);

    return pane;
}

window.users = {
    render: render,
};
