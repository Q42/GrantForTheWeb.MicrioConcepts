const AVG_COSTS_PER_VISITOR = 0.0025 // Euro
const SUBSCRIPTIONS = [
  {
    name: 'Personal',
    pricePerMonth: 6, // Euro
    maxVisitors: 5000
  },
  {
    name: 'Professional',
    pricePerMonth: 59, // Euro
    maxVisitors: 50000
  },
  {
    name: 'Premium',
    pricePerMonth: 119, // Euro
    maxVisitors: 250000
  },
  {
    name: 'Enterprise',
    pricePerMonth: 449, // Euro
    maxVisitors: Infinity
  }
]

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    maxPricePerVisitor: localStorage.getItem('maxPricePerVisitor') || 0.025, // Euro
    micrioShare: localStorage.getItem('micrioShare') ||  20,
    contentCreatorShare: localStorage.getItem('contentCreatorShare') || 80,
    expectedVisitorsAmount: 50000,
    expectedTotalVisitorsAmount: 3000000,
    subscriptions: SUBSCRIPTIONS
  },
  computed: {
    maxProfitMicrio() {
      return this.formatInEuros(this.expectedTotalVisitorsAmount * (this.maxPricePerVisitor * (this.micrioShare/100)))
    }
  },
  methods: {
    formatInEuros(number) {
      return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(number)
    },
    setMicrioShare() {
      this.micrioShare = 100 - this.contentCreatorShare
    },
    setContentCreatorShare() {
      this.contentCreatorShare = 100 - this.micrioShare
    },
    getMinVisitorsForBreakEven(subscription) {
      return Math.round((subscription.pricePerMonth * 12) / (this.maxPricePerVisitor * (this.contentCreatorShare/100))).toLocaleString('nl-NL')
    },
    getMaxProfit(subscription) {
      return this.formatInEuros(Math.max(0, (((this.expectedVisitorsAmount/12) * (this.maxPricePerVisitor * (this.contentCreatorShare/100))) - subscription.pricePerMonth)))
    },
    save(event) {
      event.target.classList.add('is-loading')

      localStorage.setItem('maxPricePerVisitor', this.maxPricePerVisitor)
      localStorage.setItem('micrioShare', this.micrioShare)
      localStorage.setItem('contentCreatorShare', this.contentCreatorShare)

      setTimeout(() => {
        event.target.classList.remove('is-loading')
      }, 300)
    }
  }
})