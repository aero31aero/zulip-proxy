const assert = require('assert');
global.window = {};
global.deepmerge = require('deepmerge');
const model = require('../public/model');

// Get the model.
let m = model();

assert(typeof m === 'object');
assert(Array.isArray(m.users));

// Update the model.
m = model({ streams: [{ id: 1 }] });

assert(m.users.length === 0);
assert(m.streams[0].id === 1);

// Set the model to this object
m = model({ streams: [{ id: 2 }] }, true);

assert(m.users === undefined);
assert(m.streams[0].id === 2);

// Add something to an array, ensure it doesn't wipe existing array.
m = model({ streams: [{ id: 3, name: 'my_stream' }] });

assert(m.streams.length === 2);
assert(m.streams[0].id === 2);
assert(m.streams[1].name === 'my_stream');

assert.throws(
    () => {
        // Give invalid data to the model.
        model('gibberish');
    },
    {
        name: 'Error',
        message: 'Invalid data: Expected Object',
    }
);

console.log('model: Passed tests');
