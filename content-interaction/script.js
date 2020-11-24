const WALLET_ADDRESS = '$ilp.uphold.com/XYmDAJbMwE7Y';

const META_TAG = document.createElement('meta');
META_TAG.setAttribute('name', 'monetization');
META_TAG.setAttribute('content', WALLET_ADDRESS);

let micrio = new Micrio({
  id: 'bndeI',
  container: document.getElementById('micrio-container'),
  hookEvents: true,
  autoInit: true,
  minimap: false,
  initType: 'cover',
});

const webMonetization = () => {
  document.monetization.addEventListener('monetizationstart', () => {
    document.getElementById('wm-status').innerText = 'active';
    document.body.classList.add('wm-active');
  });

  document.monetization.addEventListener('monetizationstop', () => {
    document.getElementById('wm-status').innerText = 'inactive';
    document.body.classList.remove('wm-active');
  });

  micrio.addEventListener('marker-open', () => startMonetization());
  micrio.addEventListener('marker-closed', () => stopMonetization());

  micrio.addEventListener('tours-start', () => startMonetization());
  micrio.addEventListener('tours-stop', () => {
    // If a marker was opened before playing a video, WM should not be stopped
    if (micrio.container.classList.contains('marker-opened')) return;
    stopMonetization();
  });
};

const stopMonetization = () => {
  const meta = document.querySelector('meta[name=monetization]');
  if (meta) meta.remove();
};

const startMonetization = () => {
  // If a new monetization tag is added, the payment stream is restarted.
  if (document.querySelector('meta[name=monetization]')) return;
  document.head.appendChild(META_TAG);
};

if (document.monetization) {
  console.log(document.monetization);
  webMonetization();
} else {
  document.getElementById('wm-status').innerText = 'n/a';
}
