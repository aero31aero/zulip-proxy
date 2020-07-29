console.log('Hello World');

const sendParams = {
    to: 'test here',
    type: 'stream',
    subject: 'Testing zulip-js',
    content: 'Something is wrong....',
};

const main = async () => {
    const client = await zulip({
        username: 'random',
        apiKey: 'random',
        realm: '/proxy', // This should make zulipjs send requests to our express app.
    });
    const reply = await client.messages.send(sendParams);
    console.log('Reply', reply);
};

main();
