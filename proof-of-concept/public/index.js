const WALLET_ADDRESS = '$ilp.uphold.com/XYmDAJbMwE7Y';
const MICRIO_ID = 'ERzWW';

const META_TAG = document.createElement('meta');
META_TAG.setAttribute('name', 'monetization');
META_TAG.setAttribute('content', WALLET_ADDRESS);

var app = new Vue({
  el: '#app',
  data: {
    micrio: null,
    stashedRevenueUpdateAmount: 0,
    monetizationActive: false,
  },
  methods: {
    addMicrio() {
      this.micrio = new Micrio({
        id: MICRIO_ID,
        container: document.getElementById('micrio'),
      });
    },
    updateRevenue() {
      if (!this.stashedRevenueUpdateAmount) return;

      const revenue = JSON.parse(localStorage.getItem('revenue')) || {};
      const project = revenue[MICRIO_ID] || { total: 0 };
      project.total += +this.stashedRevenueUpdateAmount;
      revenue[MICRIO_ID] = project;

      localStorage.setItem('revenue', JSON.stringify(revenue));

      this.stashedRevenueUpdateAmount = 0;
    },
  },
  mounted() {
    this.addMicrio();

    setInterval(this.updateRevenue, 2000);

    document.monetization.addEventListener('monetizationprogress', (e) => {
      this.stashedRevenueUpdateAmount += parseInt(e.detail.amount);

      const detail = e.detail;

      // The chrome extension can not access the monetization property of the document,
      // so we send it as a separate one.
      document.dispatchEvent(new CustomEvent('monetizationprogress', { detail }));
    });

    document.monetization.addEventListener('monetizationstart', () => {
      this.monetizationActive = true;
    });

    document.monetization.addEventListener('monetizationstop', () => {
      this.monetizationActive = false;
    });
  },
});
