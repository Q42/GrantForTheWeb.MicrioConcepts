let currency, scale;
let raw = 0;
let paidInXrp = 0;
let paidinEur = 0;

const RIPPLE2EUR = 0.459915;

document.addEventListener('monetizationprogress', (e) => {
  if (raw === 0) {
    scale = e.detail.assetScale;
    currency = e.detail.assetCode;
  }

  raw += Number(e.detail.amount);
  paidInXrp = (raw * Math.pow(10, -scale)).toFixed(scale);

  
  console.log('rate', WM_RATE)
  console.log('price', WM_PRICE)

  // this is for mocking a higher price than Coil is currently providing us: $0.36 / €0.30 per hour
  const multiplier = WM_RATE / 0.30 
  paidInEur = paidInXrp * RIPPLE2EUR * multiplier;

  console.log(`Paid € ${paidInEur} (with multiplier ${multiplier})`);
  console.log(`Paid XRP ${paidInXrp}`);

  if (WM_PRICE !== 0 && paidInEur > WM_PRICE) {
    console.log(
      `maximum price of ${WM_PRICE} reached. Stopping monetization...`
    );
    document.querySelector('meta[name=monetization]').remove();
  }
});
