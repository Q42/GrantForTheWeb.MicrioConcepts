# Interledger examples

This directory lists generic examples based on the Interledger Protocol. Through the Interledger Protocol it is possible to perform payments to other interledger wallets.

## [xpring-micrio](https://github.com/Q42/GrantForTheWeb.MicrioConcepts/tree/main/examples/interledger/xpring-micrio)

This example shows both a front-end and back-end setup for the Interledger protocol. We have chosen to work with RippleX for this example, as they offer a working NPM package to facilitate ILP payments between wallets. This example features its own readme, which will get you up and running.

The usecase for this example was to benefit from the simple structure that an ILP payment offers. In this way it should be possible to make a donation with the click of a button. While there is a pop-up with credentials that you need to fill out, these credentials should preferably be part of the web monetization implementation of the browser. This data should be stored securely to protect a user's credentials and not be part of the webapp.
