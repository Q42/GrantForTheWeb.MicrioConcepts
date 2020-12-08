const THRESHOLD = 0.03;
const PRICE = 0.05;
const WALLET_ADDRESS = '$ilp.uphold.com/XYmDAJbMwE7Y';
const MICRIO_ID = 'ERzWW';

const META_TAG = document.createElement('meta');
META_TAG.setAttribute('name', 'monetization');
META_TAG.setAttribute('content', WALLET_ADDRESS);

var db = firebase.firestore();

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
        id: MICRIO_ID,
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
    sendTransactionToFirebase(event) {
      // firebase gives errors on properties with value undefined
      if (!event.detail.receipt) {
        delete event.detail.receipt;
      }

      db.collection('transactions').add({
        micrioId: MICRIO_ID,
        event: event.detail,
        timestamp: Date.now()
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    }
  },
  mounted() {
    if (PRICE > THRESHOLD) {
      this.showThreshold = true;
    } else {
      this.addMonetization();
      this.addMicrio();
    }

    document.monetization.addEventListener('monetizationprogress', this.sendTransactionToFirebase);
  },
});
