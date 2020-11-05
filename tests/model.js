const assert = require('assert');
global.window = {};
global.deepmerge = require('deepmerge');
const model = require('../public/model');

// Get the model.
let m = model.main();

assert(typeof m === 'object');
assert(Array.isArray(m.users));

// Update the model.
m = model.main({ messages: [{ id: 1 }] });

assert(m.users.length === 0);
assert(m.messages[0].id === 1);

// Set the model to this object
m = model.main({ messages: [{ id: 2 }] }, true);

assert(m.users === undefined);
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

assert.throws(
    () => {
        // A user's user_id should be a number.
        model.main({
            users: [
                {
                    user_id: 1,
                    full_name: 'Jane Doe',
                },
                {
                    user_id: 'gibberish',
                    full_name: 'John Smith',
                },
            ],
        });
    },
    {
        name: 'Error',
        message:
            'Invalid data: "user_id: gibberish" should be number but is string',
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

console.log('model: Passed tests');
