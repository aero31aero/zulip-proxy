let data;

async function get_user_data() {
    if (data === undefined) {
        const response = await fetch("/z/users");
        data = await response.json();
    }

    return data;
}

async function render() {
    const data = await get_user_data();
    const members = data.members;

    members.sort((a, b) => a.full_name.localeCompare(b.full_name));

    const users_table = $("<table>");
    for (const user of members) {
        const tr = $("<tr>");
        tr.append($("<td>").text(user.user_id));
        tr.append($("<td>").text(user.full_name));
        users_table.append(tr);
    }

    return users_table;
}

window.users = {
    render: render,
};
