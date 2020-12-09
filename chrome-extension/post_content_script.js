const headObserver = () => {
  const observer = new MutationObserver((record) => {
    record = record[0];
    if (record.addedNodes && record.addedNodes.length > 0) {
      record.addedNodes.forEach((element) => {
        if (element.nodeName === 'META' && element.name === 'monetization') {
          if (WM_PRICE > WM_THRESHOLD) {
            console.log('monetization not allowed, removing element');
            element.remove();
          }
        }
      });
    }
  });
  observer.observe(document.head, {
    attributes: false,
    childList: true,
    subtree: false,
  });
};

headObserver();
