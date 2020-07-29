const Zulip = require('zulip-js');
const config = require('../config');
module.exports = async () => {
    const zulip = await Zulip(config);
    return zulip;
};
