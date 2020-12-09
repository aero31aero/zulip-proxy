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
        const helper = {};

        let headers;
        let user_info;

        if (session.access_token) {
            headers = { Bearer: session.access_token };
            user_info = `oauth user ${session.user_id}`;
        } else if (session.api_key) {
            if (!session.email) {
                throw Error('No email was provided in session.');
            }

            const auth = Buffer.from(
                `${session.email}:${session.api_key}`
            ).toString('base64');
            const auth_header = `Basic ${auth}`;
            user_info = session.email;

            headers = { Authorization: auth_header };
        } else {
            console.log(session);
            throw Error('No access token or api key is available!');
        }

        helper.get = async (short_url, params) => {
            console.log(user_info, 'get', short_url);
            const resp = await axios({
                method: 'get',
                url: url(short_url),
                params: params,
                headers: headers,
            });
            return resp.data;
        };

        helper.pipe = async (short_url, data, res) => {
            console.log(user_info, 'pipe', short_url);
            const resp = await axios({
                method: 'get',
                url: `${app_url}/${short_url}`,
                params: data,
                headers: headers,
                responseType: 'stream',
            });
            resp.data.pipe(res);
        };

        helper.post = async (short_url, data, params = {}) => {
            console.log(user_info, 'post', short_url);
            const resp = await axios({
                method: 'post',
                url: url(short_url),
                params: params,
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

    async function revoke_token(opts) {
        const access_token = opts.access_token;
        const client_id = opts.client_id;
        const client_secret = opts.client_secret;

        const url = `${app_url}/${oauth_prefix}/revoke-token/`;
        const headers = { Bearer: access_token };
        const data = {
            token: access_token,
            client_id,
            client_secret,
        };
        console.info(url);
        console.info(data);
        await axios({
            method: 'post',
            url: url,
            data: qs.stringify(data),
            headers: headers,
        });
    }

    return {
        revoke_token,
        api_get,
        api_post,
        get_access_token,
        get_current_user,
        handle_user_uploads,
        oauth_prefix,
        get_raw_methods,
    };
};
