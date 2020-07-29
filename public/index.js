const sendParams = {
    to: 'zulip-proxy',
    type: 'stream',
    subject: 'test',
    content: 'Something is wrong....(automated)',
};

const main = async () => {
    const client = await zulip({
        username: 'random',
        apiKey: 'random',
        realm: '/proxy', // This should make zulipjs send requests to our express app.
    });
    const server_info = await client.callEndpoint('/server_settings');
    const my_info = await client.callEndpoint('/users/me');
    console.log(server_info, my_info);
    window.z = client;
};

main();
