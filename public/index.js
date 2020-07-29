console.log('Hello World');

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
    const reply = await client.messages.send(sendParams);
    console.log('Reply', reply);
    window.z = client;
};

main();
