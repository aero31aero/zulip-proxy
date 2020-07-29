const main = async () => {
    const z = await zulip({
        username: 'random',
        apiKey: 'random',
        realm: '/proxy', // This should make zulipjs send requests to our express app.
    });
    const server_info = await z.callEndpoint('/server_settings');
    const my_info = await z.callEndpoint('/users/me');
    console.log(server_info, my_info);
    window.z = z;
    return {
        server: server_info,
        user: my_info,
    };
};

$(document).ready(async () => {
    const info = await main();
    $('#realm .avatar').attr('src', info.server.realm_icon);
    $('#realm .name').text(info.server.realm_name);
    $('#realm .url').text(info.server.realm_uri);
    $('#realm .url').attr('href', info.server.realm_uri);
    $('#realm .version').text(info.server.zulip_version);
    $('#user .avatar').attr('src', info.user.avatar_url);
    $('#user .name').text(info.user.full_name);
    $('#user .email').text(info.user.email);

    const handleEvent = async (event) => {
        if (event.type === 'presence') {
            console.info('ignore presence event', event);
            return;
        }

        $('#event-log').append(
            `======================================\n${JSON.stringify(
                event,
                0,
                4
            )}\n`
        );
    };
    z.callOnEachEvent(handleEvent, ['message']);
});

$('#send-message').on('click', () => {
    const data = {
        type: 'stream',
        to: $('#stream').val(),
        subject: $('#topic').val(),
        content: $('#content').val(),
    };
    z.messages.send(data).then(console.log);
});
