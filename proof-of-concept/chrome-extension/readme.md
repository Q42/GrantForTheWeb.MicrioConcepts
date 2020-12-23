# Enhanced Web Monetization Mocker (TO BE REWRITTEN)

This chrome extension mocks extra features into the Web Monetization API. It should be used with "proof of concept" prototype found [here](). For the Proof of Concept we need functionality that currently is not present in browsers or through the Web Monetization API.

## Why

For viable implementation for our concept, we wanted fine grained control over the price of content and the ability to react on this. Currently (december '20) it is not possible to influence the price of content, as this is set at a fixed rate by the Coil browser plugin/integration.

## What

This extension includes the following "features":

- It gives users the possibility to set a maximum rate per hour.
- If redirect the user to a confirmation page when exceeding that limit.
- It adds a `monetizationprice` eventlistener, that can set a maximum price for content.
- It listens to the `monetizationprogress` event, calculates how much is paid over time and stops the payment when the maximum price is reached.

### Setting maximum rate

We think that the user should be able to set a maximum price for any content based on costs per hour. Currently Coil pays about €0,30 / hour in multiple `ticks` per second through the `monetizationprogress` event. This setting lets users take control of how much they want to pay.

If any websites exceeds this amount, the user will be redirect to a different page, effectively stopping the website from setting up the payment. On this page the user will see an overview of the actual price and the rate limit set in the browser. A user can either choose to continue and whitelist the page for this visit, or return to the page where they came from.

### Listening for a web monetization price

TBW

## Installation

- Enable developer mode in Google Chrome under `chrome://extensions`.
- Load this directory as unpacked extension.

## Development

Make sure to press the reload icon when actively developing this extension, otherwise changes will not be known to Google Chrome.

## Notes

- This extension can not access the `document.monetization` API that is added by the Coil extension, extra event listeners are/should be added as separate events into the document instead.
