chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ threshold: '100' }, function () {
    console.log('Threshold set.');
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
