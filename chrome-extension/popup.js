let save = document.getElementById('saveThreshold');
let input = document.getElementById('threshold');

chrome.storage.sync.get('threshold', function (data) {
  input.value = data.threshold;
});

save.onclick = function () {
  chrome.storage.sync.set({ threshold: input.value }, function () {
    console.log('Treshold set.');
  });
};
