let value;
let url;
let limit;
let mode;

const wmAllowButton = document.getElementById('wmAllowButton');
const wmDenyButton = document.getElementById('wmDenyButton');

wmDenyButton.onclick = () => {
  window.location = 'https://q42.nl';
};

chrome.storage.sync.get(['wmRequestData', 'rate'], (result) => {
  const data = result.wmRequestData;

  url = data.wmBlockedUrl;
  value = data.wmBlockedPrice;

  console.log(url, value);

  if (data.mode === 'rate') limit = `${result.rate} / h`;
  else limit = result.threshold;

  document.getElementById(`value`).innerHTML = value;
  document.getElementById(`limit`).innerHTML = limit;

  wmAllowButton.onclick = () => {
    chrome.storage.sync.set({ wmAllowedUrl: url }, () => {
      window.location = url;
    });
  };
});
