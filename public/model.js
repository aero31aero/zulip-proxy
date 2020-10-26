window.model = (() => {
    const base_model = {
        users: [
            {
                user_id: 1,
            },
        ],
        streams: [{}],
        messages: [
            {
                id: 1,
                content: 'string',
            },
        ],
        state: {
            user_id: 1,
            server: 'string',
        },
    };

    let model = {
        users: [],
        streams: [],
        messages: [],
        state: {
            user_id: null,
        },
    };

    const is_object = (value) => {
        return typeof value === 'object' && !Array.isArray(value);
    };

    const has_same_structure = (new_model, base) => {
        for (const [key, value] of Object.entries(new_model)) {
            if (base[key]) {
                const type_check = typeof base[key] === typeof value;
                const array_check =
                    Array.isArray(base[key]) === Array.isArray(value);
                if (!type_check) {
                    throw new Error(
                        `Invalid data: "${key}: ${value}" should be ${typeof base[
                            key
                        ]} but is ${typeof value}`,
                        new_model
                    );
                } else if (!array_check) {
                    throw new Error(
                        `Invalid data: "${key}: ${value}" should ${
                            Array.isArray(base[key]) ? '' : 'not '
                        }be an Array`,
                        new_model
                    );
                }
                if (is_object(value)) {
                    has_same_structure(value, base[key]);
                }
                if (Array.isArray(value) && base[key][0] !== undefined) {
                    value.forEach((e) => {
                        has_same_structure(e, base[key][0]);
                    });
                }
            }
        }
    };

    const verify = (new_model) => {
        if (!is_object(new_model))
            throw new Error('Invalid data: Expected Object');
        has_same_structure(new_model, base_model);
    };

    const merge = (new_model) => {
        const merge_messages = (a, b) => {
            // for conflicts: overwrite local message with one from server.
            b.forEach((m) => {
                const idx = a.findIndex((e) => e.id === m.id);
                if (idx === -1) {
                    a.push(m);
                } else {
                    a[idx] = m;
                }
            });
            return a;
        };

        const opts = {
            customMerge: (key) => {
                if (key === 'messages') {
                    return merge_messages;
                }
            },
        };
        model = deepmerge(model, new_model, opts);
        return model;
    };

    const main = (new_model, overwrite = false) => {
        if (new_model) {
            verify(new_model);
            if (overwrite) {
                model = new_model;
            } else {
                model = merge(new_model);
            }
        }
        return model;
    };
    return main;
})();

if (typeof module !== 'undefined') {
    module.exports = window.model;
}
