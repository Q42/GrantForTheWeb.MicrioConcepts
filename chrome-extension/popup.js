let save = document.getElementById('saveThreshold');
let threshold = document.getElementById('threshold');
let rate = document.getElementById('rate');

chrome.storage.sync.get('rate', function (data) {
  rate.value = data.rate;
});

save.onclick = function () {
  chrome.storage.sync.set({ rate: rate.value }, function () {
    console.log('Rate set.');
  });
};
