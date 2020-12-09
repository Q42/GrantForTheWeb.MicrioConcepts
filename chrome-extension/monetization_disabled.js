let price;
let url;
let threshold;

const wmAllowButton = document.getElementById('wmAllowButton');
const wmDenyButton = document.getElementById('wmDenyButton');

wmDenyButton.onclick = () => {
  window.location = 'https://q42.nl';
};

chrome.storage.sync.get('wmRequestData', (result) => {
  const data = result.wmRequestData;
  console.log(data);
  url = data.wmBlockedUrl;
  price = data.wmBlockedPrice;

  wmAllowButton.onclick = () => {
    chrome.storage.sync.set({ wmAllowedUrl: url }, () => {
      window.location = url;
    });
  };

  document.getElementById('price').innerHTML = price;
});

chrome.storage.sync.get('threshold', (result) => {
  threshold = result.threshold || 0.5;
  document.getElementById('threshold').innerHTML = threshold;
});
