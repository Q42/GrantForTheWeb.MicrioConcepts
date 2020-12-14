# Enhanced Web Monetization Mocker

This chrome extension mocks extra features into the Web Monetization API. It should be used with the mocked prototype in this repository.

## Installation

- Enable developer mode in Google Chrome under `chrome://extensions`.
- Load this directory as unpacked extension.

## Development

Make sure to press the reload icon when actively developing this extension, otherwise changes will not be known to Google Chrome.

## Notes

- This extension can not access the `document.monetization` API that is added by the Coil extension, extra event listeners are/should be added as separate events into the document instead.
