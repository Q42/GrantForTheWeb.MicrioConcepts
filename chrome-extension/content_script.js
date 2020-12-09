let WM_THRESHOLD = 0;
let WM_MAX_RATE = 0;
let WM_RATE = 0;
let WM_PRICE = 0;

document.addEventListener('monetizationprice', (e) => {
  const detail = e.detail;
  chrome.storage.sync.get('wmAllowedUrl', (result) => {
    if (result.wmAllowedUrl === document.documentURI) {
      chrome.storage.sync.set({ wmAllowedUrl: null }, undefined);
      return;
    }

    chrome.storage.sync.get(['threshold', 'rate'], (result) => {
      WM_THRESHOLD = result.threshold;
      WM_MAX_RATE = result.rate;
      WM_PRICE = detail.price;
      WM_RATE = detail.rate;

      if (WM_PRICE > WM_THRESHOLD || WM_RATE > WM_MAX_RATE) {
        const isPrice = WM_PRICE > WM_THRESHOLD;

        const wmRequestData = {
          wmRequestData: {
            mode: isPrice ? 'threshold' : 'rate',
            wmBlockedPrice: isPrice ? WM_PRICE : WM_RATE,
            wmBlockedUrl: document.documentURI,
          },
        };

        chrome.storage.sync.set(wmRequestData, () => {
          window.location = chrome.extension.getURL(
            'monetization_blocked.html'
          );
        });
      }
    });
  });
});
