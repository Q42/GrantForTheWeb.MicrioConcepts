# Grant for the Web x Q42

This repository is a collection of examples, prototypes and suggestions that we have developed as part of the Grant for the Web project at Q42. The goal is to research if Web Monetization could be a viable addition or replacement of the Micrio bussinessmodel.

As Micrio is a web-based platform, we primarily looked at the Web Monetization Spec draft and the Interledger Protocol for usage within the browser.

## Examples and try-outs

To test the features of the Web Monetization API and the Interledger Protocol, we have built some simple examples of how we think the WM-API and ILP can be used. You can find this in the [examples](https://github.com/Q42/GrantForTheWeb.MicrioConcepts/tree/main/examples) directory, split up in [ILP](https://github.com/Q42/GrantForTheWeb.MicrioConcepts/tree/main/examples/interledger) and [Web Monetization API](https://github.com/Q42/GrantForTheWeb.MicrioConcepts/tree/main/examples/web-monetization).

## Web Monetization research

Apart from testing code, we also looked at the current implentation of Web Monetization by [Coil](https://coil.com/) and what we seem to be missing in this implementation. This research is tailored upon the relation with Micrio ("What does the API need in able for us the make it work?") and to a small amount on how we think the implementation in general should work for other websites or platforms.

We also performed a Real-User interview to see how Web Monetization could work in the eyes of actual users. We wrote about these results in a [post on the Web Monetization Community]().

## [Proof of Concept](https://github.com/Q42/GrantForTheWeb.MicrioConcepts/tree/main/proof-of-concept)

To determine if Web Monetization can be used as a viable option or addition to the Micrio business model, we developed a proof-of-concept with the learnings we acquired through the examples and our research. It adds extra features to the WM-API, like maximum rate per time and a user controlled limit. We have mocked these features with a custom chrome extension that listens to specific events that can be found in [Q42/GrantForTheWeb.ChromeExtension](https://github.com/Q42/GrantForTheWeb.ChromeExtension).

## Next steps?

At Q42 and Micrio we will be closely monitoring the state of Web Monetization in browsers. While in its current state Web Monetization is not a great fit for our objectives, we do think that Web Monetization will be part of the future of the browser eco-system.
