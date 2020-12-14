# Web Monetization examples

This directory lists basic examples based on Micrio and the Web Monetization API. In order to replicate these examples you will need a compatible wallet with a payment pointer. At the time of writing, the only way to do thism, is by creating an account on [Coil](https://coil.com).

All examples are based on specific usecases that we have come up for Micrio.

## [Always on](https://q42.github.io/GrantForTheWeb.MicrioConcepts/examples/web-monetization/always-on/)

This example shows the most basic implementation of web monetization. It has the `monetization` meta-tag enabled by default, which means the payment stream is set-up on loading the webpage.

## [Content interaction](https://q42.github.io/GrantForTheWeb.MicrioConcepts/examples/web-monetization/content-interaction/)

This example shows how to enable/disable web monetization based on activity. In this specific example we only add the `monetization` meta-tag when viewing specific types of Micrio content like a Marker or VideoTour.

Markers and VideoTours are rich content added by the creator of the Micrio page. As this type of content is unique and time-consuming to make, the creator will be rewarded when people are actually consuming this content.

## [General interaction](https://q42.github.io/GrantForTheWeb.MicrioConcepts/examples/web-monetization/general-interaction/)

This example shows how to enable/disable web monetization based on events. In this specific example we listen to the `move` event that is dispatched by the `camera` module of Micrio. As long as the user interacts with the page, web monetization is active. When the user stops interacting, web monetization is disabled.

The thought behind this usecase is that users should no be paying for static content, but only when actively consuming the page. Binding web monetization to the `move` event is one of the options to achieve this, as the camera is almost always active when actively using Micrio.

## [Bandwidth usage](https://q42.github.io/GrantForTheWeb.MicrioConcepts/examples/web-monetization/bandwidth-usage/)

This example shows a conceptual implementation based on a user's bandwidth usage. In our Micrio usecase, the bandwidth of a Micrio-page can cause a creator's costs to increase (exceeding bandwidth for example). We therefore have looked at the possibility of coupling web monetization to the bandwidth a user uses.

For this conceptual implementation, this is done client-side by using a server-worker. All fetch requests belonging to Micrio are intercepted and the file size is calculated by reading the `Content-Length` header of each request.
