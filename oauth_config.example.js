// copy to oauth_config and then EDIT THESE SETTINGS!
module.exports = {
    host: 'http://localhost',
    port: 3000,
    session_secret: 'SECRET', // make your own secret

    app_url: 'http://app.example.org',
    use_api_key: false,

    // next few fields are only needed if we use oauth
    redirect_uri: 'http://localhost:3000/o/callback',
    client_id: 'CLIENT_ID', // get from oauth provider
    client_secret: 'CLIENT_SECRET', // get from oauth provider
};
