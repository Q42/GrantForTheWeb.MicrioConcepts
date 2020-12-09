let WM_THRESHOLD = 0;
let WM_PRICE = 0;

document.addEventListener('monetizationprice', (e) => {
  const detail = e.detail;
  chrome.storage.sync.get('wmAllowedUrl', (result) => {
    if (result.wmAllowedUrl === document.documentURI) {
      chrome.storage.sync.set({ wmAllowedUrl: null }, undefined);
      return;
    }

    chrome.storage.sync.get('threshold', (result) => {
      WM_THRESHOLD = result.threshold;
      WM_PRICE = detail.price;

      if (WM_PRICE > WM_THRESHOLD) {
        const wmRequestData = {
          wmRequestData: {
            wmBlockedPrice: WM_PRICE,
            wmBlockedUrl: document.documentURI,
          },
        };

        chrome.storage.sync.set(wmRequestData, () => {
          window.location = chrome.extension.getURL(
            'monetization_disabled.html'
          );
        });
      }
    });
  });
});
