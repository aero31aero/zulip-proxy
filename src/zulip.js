const axios = require('axios');
const qs = require('qs');

exports.make = function (opts) {
    const app_url = opts.app_url;
    const oauth_prefix = 'o';

    async function get_access_token(form) {
        const token_resp = await axios.post(
            `${app_url}/${oauth_prefix}/token/`,
            form,
            {
                headers: form.getHeaders(),
            }
        );
        return token_resp;
    }

    function url(short_url) {
        return `${app_url}/api/v1/${short_url}`;
    }

    function get_helper(session) {
        const access_token = session.access_token;

        if (!access_token) {
            throw Error('Access token is undefined!');
        }

        const helper = {};
        const headers = { Bearer: access_token };

        helper.get = async (short_url, data) => {
            const resp = await axios({
                method: 'get',
                url: url(short_url),
                params: data,
                headers: headers,
            });
            return resp.data;
        };

        helper.pipe = async (short_url, data, res) => {
            const resp = await axios({
                method: 'get',
                url: `${app_url}/${short_url}`,
                params: data,
                headers: headers,
                responseType: 'stream',
            });
            resp.data.pipe(res);
        };

        helper.post = async (short_url, data) => {
            const resp = await axios({
                method: 'post',
                url: url(short_url),
                data: qs.stringify(data),
                headers: headers,
            });
            return resp.data;
        };

        return helper;
    }

    async function get_current_user(session) {
        const helper = get_helper(session);
        const get = helper.get;

        const me = await get('users/me');
        return me;
    }

    async function api_get(req, res, url) {
        const helper = get_helper(req.session);
        const get = helper.get;

        const result = await get(url, req.query);
        res.json(result);
    }

    async function api_post(req, res, url) {
        const helper = get_helper(req.session);
        const post = helper.post;

        const result = await post(url, req.body);
        res.json(result);
    }

    async function handle_user_uploads(req, res) {
        const helper = get_helper(req.session);
        const pipe = helper.pipe;
        const url = req.path;
        await pipe(url, req.query, res);
    }

    function get_raw_methods(session) {
        const helper = get_helper(session);
        return helper;
    }

    return {
        api_get: api_get,
        api_post: api_post,
        get_access_token: get_access_token,
        get_current_user: get_current_user,
        handle_user_uploads: handle_user_uploads,
        oauth_prefix: oauth_prefix,
        get_raw_methods: get_raw_methods,
    };
};
