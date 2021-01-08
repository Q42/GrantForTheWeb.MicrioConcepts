// The Ripple (XRP) value is currently very unstable. To best reflect actual value
// change this to the most recent value: https://www.coingecko.com/en/coins/xrp/eur
const RIPPLE2EUR = 0.262939;
const ASSET_SCALE = 9;

var app = new Vue({
  el: '#app',
  data() {
    return {
      projects: [],
      micrioShare: localStorage.getItem('micrioShare') || 20,
      contentCreatorShare: localStorage.getItem('contentCreatorShare') || 80,
    };
  },
  mounted() {
    const projects = JSON.parse(localStorage.getItem('revenue')) || {};

    for (const id in projects) {
      const project = projects[id];
      this.projects.push({
        id: id,
        data: project,
      });
    }
    console.log(this.projects);
  },
  methods: {
    // 3600s = 1 hour | 60s = 1 minute
    getRatePerHour(maxPrice, timeUnit = 3600) {
      const timeWindow = localStorage.getItem('timeWindow'); // Seconds
      const maxPricePerVisitor = maxPrice;

      return timeWindow && maxPricePerVisitor ? (maxPricePerVisitor / timeWindow) * timeUnit : null;
    },
    formatWithShare(amount, isProject) {
      const share = isProject ? this.contentCreatorShare : this.micrioShare;
      const raw = amount * (share / 100);
      const paidInXrp = (raw * Math.pow(10, -ASSET_SCALE)).toFixed(ASSET_SCALE);

      // this is for mocking a higher price than Coil is currently providing us: $0.36 / €0.30 per hour
      const maxPrice = localStorage.getItem('maxPricePerVisitor') || 0.025; // Euro
      const rate = this.getRatePerHour(maxPrice); // Euro
      const multiplier = rate / 0.3;
      const paidInEur = paidInXrp * RIPPLE2EUR * multiplier;

      return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 6,
      }).format(paidInEur);
    },
  },
});
