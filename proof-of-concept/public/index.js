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
  },
  mounted() {
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
