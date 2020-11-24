let micrio = new Micrio({
  id: 'bndeI',
  container: document.getElementById('micrio-container'),
  hookEvents: true,
  autoInit: true,
  minimap: false,
  initType: 'cover',
});

const webMonetization = () => {
  document.monetization.addEventListener('monetizationstart', () => {
    document.getElementById('wm-status').innerText = 'active';
    document.body.classList.add('wm-active');
  });

  document.monetization.addEventListener('monetizationstop', () => {
    document.getElementById('wm-status').innerText = 'inactive';
    document.body.classList.remove('wm-active');
  });
};

if (document.monetization) {
  webMonetization();
} else {
  document.getElementById('wm-status').innerText = 'n/a';
}
