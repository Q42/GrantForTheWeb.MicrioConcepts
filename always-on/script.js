let image = new Micrio({
  // Image ID, required
  id: "bndeI",

  // HTML element to put the image in, defaults to <body>
  container: document.getElementById("micrio-container"),

  // Listen to touch and mouse events, defaults to true
  hookEvents: true,

  // Initializes and draws image on instance creation, defaults to true
  autoInit: true,

  // Creates a fully interactive minimap, defaults to false
  minimap: false,

  //   limitToCoverScale: true,

  // How to render the initial view, like CSS background-size
  // 'cover' or 'contain'. Defaults to 'contain'.
  initType: "cover",
});

const webMonetization = () => {
  document.monetization.addEventListener("monetizationstart", () => {
    document.getElementById("wm-status").innerText = "active";
    document.body.classList.add("wm-active");
  });

  document.monetization.addEventListener("monetizationstop", () => {
    document.getElementById("wm-status").innerText = "inactive";
    document.body.classList.remove("wm-active");
  });
};

if (document.monetization) {
  console.log(document.monetization);
  webMonetization();
} else {
  document.getElementById("wm-status").innerText = "not supported";
}
