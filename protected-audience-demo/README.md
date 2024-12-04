# Protected Audience API Demo

## Introduction

This demo shows the simple usage of the [Protected Audience API](https://developer.chrome.com/blog/fledge-api/). In this demo, there are 4 actors involved in the process: advertiser, publisher, DSP, and SSP. Each actors interact with one another to render a retargeted ads to the user.

## Local development

### Setup HTTPS

To run the Protected Audience demo locally, the resources from DSP/SSP must be served over HTTPS. Therefore, we will setup a reverse proxy with `nginx` to serve DSP/SSP resources over HTTPS.

#### Generate the certs with [`mkcert`]()

1. Install `mkcert` by following the [instructions for your operating system](https://github.com/FiloSottile/mkcert#installation).
1. Run `mkcert -install`.
1. Create a folder to store the certificates in. In this example, we will use `mkdir ~/certs`.
1. Navigate to the certificate folder: `cd ~/certs`.
1. Run `mkcert localhost`.

#### Setup reverse proxy with [nginx](https://www.nginx.com/)

1. Install `nginx` ([Mac](https://www.google.com/search?q=install+nginx+mac), [Linux](https://www.google.com/search?q=install+nginx+linux), [Windows](https://www.google.com/search?q=install+nginx+windows)).
1. Find the `nginx` configuration file location based on your operating system (it is under `/Users/[USER-NAME]/homebrew/etc/nginx/nginx.conf`). Erase the existing content in nginx.conf and copy-paste the config from GitHub into the config.
1. Replace [USER-NAME] with the path that your certificate is stored in.
1. Stop the `nginx` server with `nginx -s stop`
1. Restart the `nginx` server with `nginx` (or command file inside GitHub repo nginx.cmd)

### Node version

- Use Node version 20 (check for used version - node -v. Change a version - nvm use 20).

### Setup Firebase

- Setup [Firebase tools](https://github.com/firebase/firebase-tools)

### Clone a repository

- `git clone git clone https://github.com/OleksiiDerke/PrivacySandboxDemo.git`
- `cd protected-audience-demo`
- `npm install`

### Start emulator

```
npm run dev
```

### Start browser

- Execute a Chrome from the command line and set the flags

```
--enable-privacy-sandbox-ads-apis --disable-features=EnforcePrivacySandboxAttestations,FledgeEnforceKAnonymity
```

(or run the command file inside GitHub repo chromePAAPI.cmd)

- Visit `http://localhost:3000` for the demo main page

## Key files

- Buyer's interest group logic - [`/sites/dsp/join-ad-interest-group.js`](https://github.com/GoogleChromeLabs/protected-audience-demo/blob/main/sites/dsp/join-ad-interest-group.js) - DSP resource that adds an interest group for the user.
- Buyer's bidding logic - [`/sites/dsp/bid.js`](https://github.com/GoogleChromeLabs/protected-audience-demo/blob/main/sites/dsp/bid.js) - DSP resource that contains the bidding logic for the auction.
- Seller's auction logic - [`/sites/ssp/run-auction.js`](https://github.com/GoogleChromeLabs/protected-audience-demo/blob/main/sites/ssp/run-auction.js) - SSP resource that executes the in-browser auction.
- Seller's decision logic - [`/sites/ssp/decision-logic.js`](https://github.com/GoogleChromeLabs/protected-audience-demo/blob/main/sites/ssp/decision-logic.js) - SSP resource that decides the winner among the bidders.

## Local Hostnames

- Main - http://localhost:3000
- Advertiser - http://localhost:3005
- Publisher - http://localhost:3006
- DSP - https://localhost:4437 (via nginx reverse proxy from 8087 to 4437)
- SSP - https://localhost:4438 (via nginx reverse proxy from 8088 to 4438)
