const WALLET_ADDRESS = '$ilp.uphold.com/XYmDAJbMwE7Y';

const META_TAG = document.createElement('meta');
META_TAG.setAttribute('name', 'monetization');
META_TAG.setAttribute('content', WALLET_ADDRESS);

let ioTimeout = 0;

let micrio = new Micrio({
  id: 'bndeI',
  container: document.getElementById('micrio-container'),
  hookEvents: true,
  autoInit: true,
  minimap: false,
  initType: 'cover',
});

/**
 * Set up Micro and attach Web Monetization listeners.
 */
const webMonetization = () => {
  document.monetization.addEventListener('monetizationstart', () => {
    document.getElementById('wm-status').innerText = 'active';
    document.body.classList.add('wm-active');
  });

  document.monetization.addEventListener('monetizationstop', () => {
    document.getElementById('wm-status').innerText = 'inactive';
    document.body.classList.remove('wm-active');
  });

  micrio.addEventListener('move', () => startMonetization());
};

const startMonetization = () => {
  /**
   * If a new tag is added, the monetization is temporarily stopped before reactivating
   * so we check if the monetization tag is already present.
   */
  if (!document.querySelector('meta[name=monetization]')) {
    document.head.appendChild(META_TAG);
  }

  /**
   * Whenever this function is called, reset the timeout so the
   * monetization stays active.
   */
  clearTimeout(ioTimeout);
  ioTimeout = setTimeout(() => stopMonetization(), 2000);
};

const stopMonetization = () => {
  const meta = document.querySelector('meta[name=monetization]');
  if (meta) meta.remove();
};

if (document.monetization) webMonetization();
else document.getElementById('wm-status').innerText = 'n/a';
