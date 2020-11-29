# zulip-proxy

This program has an express based server that connects
to a Zulip server on the back end and essentially passes
through requests and events.

Then the server also has an endpoint that serves up
the HTML and JS for a single-page app.

The main idea here is that you can write your own **custom**
clients by forking this project. You will likely leave
the server piece mostly unchanged, but then you can experiment
with the client. Our custom client attempts to provide
a minimal Zulip experience while having a few innovations
not present in the main Zulip webapp client.

## Basics

1. `git clone`
2. `npm install`
3. Run prettier with: `npm run lint`.

## Usage

1. `cp config.example.js config`
2. `vim config` (and see Configuration section)
3. `npm start`
4. Open http://localhost:3000 to begin the authentication flow.

## Configuration

We have two modes--you can have users log in with their email
and API key, or they can use oauth (which requires special
server support).

### API key

This is the simpler configuration, and you will have something
like this:

    module.exports = {
        host: 'http://localhost',
        port: 3000,
        session_secret: 'SECRET', // make your own secret

        app_url: 'http://app.example.org',  // Zulip server
        use_api_key: true,
    };

Basically, you should be able to connect to any Zulip
server if you set `use_api_key` to `true`.

### Oauth server

You will need to visit a Zulip server that has the oauth branch
deployed. (As of now, you can run locally off of
https://github.com/zulip/zulip/pull/16529.)

Then create an application with: `https://zulip.example.com/o/applications`.

Use something like `http://localhost:3000/o/callback` as the callback url.

Then once you have created your application, you will want to copy the
client id and client secret into your config file. The file should
look something like this:

    module.exports = {
        host: 'http://localhost',
        port: 3000,
        session_secret: 'SECRET', // make your own secret

        app_url: 'http://app.example.org',
        use_api_key: false,

        redirect_uri: 'http://localhost:3000/o/callback',
        client_id: 'CLIENT_ID', // get from oauth provider
        client_secret: 'CLIENT_SECRET', // get from oauth provider
    };
