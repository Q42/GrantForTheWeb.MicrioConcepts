# Grant for the Web x Q42

This repository is a collection of examples, prototypes and suggestions that we have developed as part of the Grant for the Web project at Q42. The goal is to research if Web Monetization could be a viable addition or replacement of the Micrio bussinessmodel.

As Micrio as a web-based platform, we primarily looked at the Web Monetization Spec draft and the Interledger Protocol for usage within the browser.

## Examples and try-outs

To test the features of the Web Monetization API and the Interledger Protocol, we have built some simple examples of how we think the WM-API and ILP can be used. You can find this in the [examples]() directory, split up in [ILP]() and [Web Monetization API]().

## Web Monetization research

Apart from testing code, we also looked at the current implentation of Web Monetization by Coil and what we seem to be missing in this. This research is tailored upon the relation with Micrio ("What does the API need in able for us the make it work?") and to a small amount on how we think the implementation in general should work for other websites or platforms.

We also performed a Real-User interview to see how Web Monetization could work in the eyes of actual users.

You can find our learnings [here]().

## Proof of Concept

In order to look if Web Monetization can be used as a viable option or addition to the Micrio business model, we developed a proof-of-concept with the learnings we acquired through the examples and our research. It adds extra features to the WM-API, like maximum rate per time and a user controlled limit. We have mocked these features with a custom chrome extension that listens to specific events.

## Suggestions

The currently drafted Web Monetization Spec is certainly a good first step into the right direction. However, if we want to use it as a viable addition to Micrio businessmodel some changes need to be made to fit our vision of the product:

- Expand the `monetization` meta-tag with more options, like rate, currency and maximum price.
- Expand the Monetization API with user provided maximum prices/rates for web-content.

### Extra Monetization tags

We think that the current meta-tag implementation is a good starting point, but it does not have all features we would expect from monetization related APIs. We feel like that API should have more options to customize the payment behavior, like setting a maximum amount, amount per time-unit and the currency. By adding more tags, the customization of payment options would be possible and the API is suited for more scenarios.

**`monetization:asset`**

```html
<meta name="monetization:asset:max_amount" value="250" />
```

One of the most important changes would be to add an extra `monetization:asset:max_amount` or "price" meta-tag that hooks into the `monetizationprogress`. The value of the `content` attribute should be a numeric value which corresponds with the price of that web-page. When that specific value is reached, the monetization stream should stop automatically.

```html
<meta name="monetization:asset:scale" value="4" />
```

The `scale` tag defines the scale of the payment. The scale divides the `amount` and `max_amount` by 10 to the power of the value (`amount / 10 ^ scale`).

```html
<meta name="monetization:asset:code" value="EUR" />
```

The `code` tag defines the currency in which the payment should be done.

### More user control from the browser

tbw...
