# zulip-proxy

[WIP] A proxy server for zulip api

## Basics

1. `git clone`
2. `npm install`
3. Run prettier with: `npm run lint`.

## Usage

1. `cp oauth_config.example.js oauth_config`
2. `vim oauth_config`

At this stage, you need to visit the Zulip server that has the oauth branchh deployed
and create an app/get a token using: `https://zulip.example.com/o/applications`. Use
`http://localhost:3000/o/callback` as the callback url.

3. `npm start`
4. Open http://localhost:3000 to begin the authentication flow.
