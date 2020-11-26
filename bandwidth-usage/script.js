const WALLET_ADDRESS = '$ilp.uphold.com/XYmDAJbMwE7Y';
const META_TAG = document.createElement('meta');
META_TAG.setAttribute('name', 'monetization');
META_TAG.setAttribute('content', WALLET_ADDRESS);

const TICK_PRICE = 100000;

window.dataUsage = 0;
let ioTimeout = 0;

/**
 * Register a Service Worker to handle fetch requests in the application.
 */
navigator.serviceWorker.register(`${window.location}sw.js`);

/**
 * Listen for the message sent from the ServiceWorkerGlobal scope that
 * contains the value of the content-length header.
 */
navigator.serviceWorker.addEventListener('message', (event) => {
  const size = parseInt(event.data.contentLength);
  window.dataUsage += size;

  const usageEl = document.getElementById('data-usage');
  usageEl.innerText = `${
    Math.round((window.dataUsage / 1024 + Number.EPSILON) * 100) / 100
  }kB`;

  startMonetization();

  /**
   * This is where we hit a snag with the meta-tag based WM-API. It is
   * currently not possible to influence the payment scale from the browser.
   *
   * This is actually a good thing, because this would open the user up to
   * bad practices.
   */
});

/**
 * Set up Micro and attach Web Monetization listeners.
 */
const micrio = new Micrio({
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

  /**
   * For this POC we keep the payment stream active until we "paid" for
   * all the bandwidth. Currently this is not reactive, but should be in a
   * real world usecase.
   */
  document.monetization.addEventListener('monetizationprogress', () => {
    if (window.dataUsage === 0) {
      stopMonetization();
      return;
    }

    window.dataUsage = Math.max(0, window.dataUsage - TICK_PRICE);

    const usageEl = document.getElementById('data-usage');
    usageEl.innerText = `${
      Math.round((window.dataUsage / 1024 + Number.EPSILON) * 100) / 100
    }kB`;
  });
};

const startMonetization = () => {
  /**
   * If a new tag is added, the monetization is temporarily stopped before reactivating
   * so we check if the monetization tag is already present.
   */
  if (!document.querySelector('meta[name=monetization]')) {
    document.head.appendChild(META_TAG);
  }
};

const stopMonetization = () => {
  const meta = document.querySelector('meta[name=monetization]');
  if (meta) meta.remove();
};

if (document.monetization) webMonetization();
else document.getElementById('wm-status').innerText = 'n/a';
