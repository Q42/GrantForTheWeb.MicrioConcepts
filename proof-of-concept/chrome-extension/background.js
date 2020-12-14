chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ rate: '0.30' }, function () {
    console.log('Rate set.');
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher()],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
