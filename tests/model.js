const assert = require('assert');
global.window = {};
global.deepmerge = require('deepmerge');
const model = require('../public/model');

// Get the model.
let m = model.main();

assert(typeof m === 'object');

// Update the model.
m = model.main({ messages: [{ id: 1 }] });

assert(m.messages[0].id === 1);

// Set the model to this object
m = model.main({ messages: [{ id: 2 }] }, true);

assert(m.messages[0].id === 2);

// Add something to an array, ensure it doesn't wipe existing array.
m = model.main({ messages: [{ id: 3, name: 'my_stream' }] });

assert(m.messages.length === 2);
assert(m.messages[0].id === 2);
assert(m.messages[1].name === 'my_stream');

assert.throws(
    () => {
        // Give invalid data to the model.
        model.main('gibberish');
    },
    {
        name: 'Error',
        message: 'Invalid data: Expected Object',
    }
);

// If we try to add a message with the same id as an existing message,
// overwrite the existing message instead of adding a new one.

m = model.main({ messages: [{ id: 1, content: 'one' }] }, true);
assert(m.messages.length === 1);
assert(m.messages[0].content === 'one');

m = model.main({ messages: [{ id: 2, content: 'two' }] });
assert(m.messages.length === 2);
assert(m.messages[1].content === 'two');

m = model.main({ messages: [{ id: 1, content: 'one-edited' }] });
assert(m.messages.length === 2);
assert(m.messages[0].content === 'one-edited');

// Tests for ZulipAccessor based models.

assert(model.Users.list().length === 0);
model.Users.add({
    user_id: 1,
    full_name: 'Test User',
    email: 'test@example.com',
});
let test_user = model.Users.by_id(1);
// property mappings
assert(test_user.id === test_user.user_id);
test_user.id = 2;
assert(test_user.id === test_user.user_id);
assert(test_user.name === test_user.full_name);
test_user.name = 'Testing User';
assert(test_user.name === test_user.full_name);

assert(model.Streams.list().length === 0);
model.Streams.add({
    stream_id: 1,
    name: 'Test Stream',
    subscribers: ['test@example.com'],
});
let test_stream = model.Streams.by_id(1);
assert(test_stream.id === test_stream.stream_id);
test_stream.id = 2;
assert(test_stream.id === test_stream.stream_id);

// nested properties
assert(test_stream.subs[0] === test_user);

console.log('model: Passed tests');
