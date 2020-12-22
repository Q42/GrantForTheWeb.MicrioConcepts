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
    stashedRevenueFirebaseUpdateAmount: 0,
  },
  methods: {
    addMonetization() {
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
    sendTransactionToFirebase(event) {
      // firebase gives errors on properties with value undefined
      if (!event.detail.receipt) {
        delete event.detail.receipt;
      }

      db.collection('transactions')
        .add({
          micrioId: MICRIO_ID,
          event: event.detail,
          timestamp: Date.now(),
        })
        .then(function (docRef) {
          console.log('Document written with ID: ', docRef.id);
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
        });
    },
    updateRevenueInFirebase() {
      if (!this.stashedRevenueFirebaseUpdateAmount) {
        return;
      }

      const increment = firebase.firestore.FieldValue.increment(
        this.stashedRevenueFirebaseUpdateAmount
      );
      const micrioDocRef = db.collection('revenue').doc(MICRIO_ID);

      micrioDocRef.set(
        {
          lastUpdated: Date.now(),
        },
        { merge: true }
      );

      try {
        micrioDocRef.update({ total: increment });
      } catch (e) {
        console.log('error', e);
      }

      this.stashedRevenueFirebaseUpdateAmount = 0;
    },
    // 3600s = 1 hour | 60s = 1 minute
    getRatePerHour(maxPrice, timeUnit = 3600) {
      const timeWindow = localStorage.getItem('timeWindow'); // Seconds
      const maxPricePerVisitor = maxPrice;

      return timeWindow && maxPricePerVisitor
        ? (maxPricePerVisitor / timeWindow) * timeUnit
        : null;
    },
  },
  mounted() {
    // const maxPrice = localStorage.getItem('maxPricePerVisitor') || 0.025; // Euro
    // const rate = this.getRatePerHour(maxPrice); // Euro

    // console.log(maxPrice, rate);

    // const event = new CustomEvent('monetizationprice', {
    //   detail: { maxPrice, rate },
    // });

    // document.dispatchEvent(event);

    // this.addMonetization();
    this.addMicrio();

    setInterval(this.updateRevenueInFirebase, 2000);

    document.monetization.addEventListener('monetizationprogress', (e) => {
      this.stashedRevenueFirebaseUpdateAmount += parseInt(e.detail.amount);

      const detail = e.detail;

      // The chrome extension can not access the monetization property of the document,
      // so we send it as a separate one.
      document.dispatchEvent(
        new CustomEvent('monetizationprogress', { detail })
      );
    });
  },
});
