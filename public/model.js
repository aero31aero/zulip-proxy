window.model = (() => {
    const base_model = {
        users: [{}],
        streams: [{}],
        messages: [{}],
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
            }
        }
    };

    const verify = (new_model) => {
        if (!is_object(new_model))
            throw new Error('Invalid data: Expected Object');
        has_same_structure(new_model, base_model);
    };

    const main = (new_model, overwrite = false) => {
        if (new_model) {
            verify(new_model);
            if (overwrite) {
                model = new_model;
            } else {
                model = deepmerge(model, new_model);
            }
        }
        return model;
    };
    return main;
})();

if (typeof module !== 'undefined') {
    module.exports = window.model;
}
