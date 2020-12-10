var db = firebase.firestore();
const RIPPLE2EUR = 0.459915;
const ASSET_SCALE = 9

var app = new Vue({
  el: '#app',
  data() {
    return {
      projects: [],
      micrioShare: localStorage.getItem('micrioShare') || 20,
      contentCreatorShare: localStorage.getItem('contentCreatorShare') || 80
    }
  },
  mounted() {
    console.log('mounted')

    db.collection("revenue").get().then(querySnapshot => {
      querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());

          this.projects.push({
            id: doc.id,
            data: doc.data()
          })
      });
    });
  },
  methods: {
    formatWithShare(amount, isProject) {
      const share = isProject ? this.contentCreatorShare : this.micrioShare
      const raw = amount * (share / 100)
      const paidInXrp = (raw * Math.pow(10, -ASSET_SCALE)).toFixed(ASSET_SCALE);
      const paidInEur = paidInXrp * RIPPLE2EUR;

      return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR',minimumFractionDigits: 6 }).format(paidInEur)
    }
  }
})