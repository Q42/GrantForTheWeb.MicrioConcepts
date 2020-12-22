# Proof of Concept (TBW)

This proof of concept is our suggestion of how Micrio could profit from Web Monetization.

## Why / What

This POC is based on our expectations after testing with the Web Monetization API and the Interledger Protocol. For this POC we decided that the Web Monetization API is best suited for our usecase. The standard implementation does not feature all the functionality that we need to make Web Monetization a viable addition to the Micrio businessmodel.

The current implementation has a flat fee of about 0,36 USD per hour and users (or websites for that matter) have no influence on the height of this amount. In order to work with Micrio we need some additional functionality on top of the implementation Coil provides through the browser-plugin:

- The payout needs to be higher
- Setting a maximum price for content (by the website)
- NTH: As a european company, the current should be EUR instead of XRP.

### Increasing payout

The current "lock in" caused by Coil is a severe limitation for our usecase. The literal micrio payments that Coil sets up, are so small Micrio clients would need millions of visitors to be able to make any money with their Micrio website. Furthermore those users would also need to spend more than the average time using the website. Apart from a higher payout in the long run, increasing the height of the amount also means that visitors' time on the website can be shorter.

For our specific usecase with the POC we decided to increase the pay-out about 2.5 times the actual amount based on an average visit-time of 2 minutes. This seems more in line with the actual costs calculation.

### Setting a price for content

In line with the payment increase described above, we think it is better if a piece of content can/should have a maximum price. This gives an increased sense of trust to the end-user, as a website or piece of content can never cost more than a certain amount.

## Running the POC yourself

In able to run this POC you **need to use Google Chrome** and have the **Coil browser extension installed en set up**.

The POC consists out of two elements:

- A webapp with monetization meta tags
- A chrome web-extension that mocks extra behaviour for the meta tags.

### Chrome Extension

In order to install the extension you need to do the following:

- Browse to `chrome://extensions`
- Enable developer mode
- Click `load unpacked` and select the `chrome-extension` directory.

This will set-up the chrome-extension in your browser. By default it has a default maximum allowed `rate` of 0.30 / hour. The extension gets all values from the different
meta tags and uses those values to calculate the different values.

```html
<meta name="monetization:asset:amount" content="125" />
```

The amount payed per minute. Note: Actual amount is divided by the scale property.

```html
<meta name="monetization:asset:code" content="EUR" />
```

The currency that is used.

```html
<meta name="monetization:asset:scale" content="4" />
```

The scale of the asset that is used. This example uses a scale of 4, meaning that the amount is divided by 10 ^ 4 (10000).

### Web-App

The web application is based on en Express web-server and a VueJS front-end. To get the app running on your local machine you first need to run the following command to install all dependencies.

Installing the dependencies
`$ npm install`

After doing this, you can run the local webserver on your machine and access the web-app by navigating to the url outputes by the script.

Running the local webserver
`$ node server.js`
