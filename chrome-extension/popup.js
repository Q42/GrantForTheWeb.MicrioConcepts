let save = document.getElementById('saveThreshold');
let threshold = document.getElementById('threshold');
let rate = document.getElementById('rate');

chrome.storage.sync.get('threshold', function (data) {
  threshold.value = data.threshold;
});

chrome.storage.sync.get('rate', function (data) {
  rate.value = data.rate;
});

save.onclick = function () {
  chrome.storage.sync.set({ threshold: threshold.value }, function () {
    console.log('Treshold set.');
  });

  chrome.storage.sync.set({ rate: rate.value }, function () {
    console.log('Rate set.');
  });
};
