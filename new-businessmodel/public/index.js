const THRESHOLD = 0.03;
const PRICE = 0.05;
const WALLET_ADDRESS = '$ilp.uphold.com/XYmDAJbMwE7Y';

const META_TAG = document.createElement('meta');
META_TAG.setAttribute('name', 'monetization');
META_TAG.setAttribute('content', WALLET_ADDRESS);

var app = new Vue({
  el: '#app',
  data: {
    micrio: null,
    showThreshold: false,
    monetizationDenied: false,
  },
  methods: {
    addMonetization() {
      this.monetizationDenied = false;
      if (!document.querySelector('meta[name=monetization]')) {
        document.head.appendChild(META_TAG);
      }
    },
    addMicrio() {
      this.micrio = new Micrio({
        id: 'ERzWW',
        container: document.getElementById('micrio'),
      });
    },
    approve() {
      this.addMonetization();
      this.addMicrio();
      this.closeModal();
    },
    closeModal() {
      this.showThreshold = false;
    },
    deny() {
      this.monetizationDenied = true;
      this.closeModal();
    },
  },
  mounted() {
    if (PRICE > THRESHOLD) {
      this.showThreshold = true;
    } else {
      this.addMonetization();
      this.addMicrio();
    }
  },
});
