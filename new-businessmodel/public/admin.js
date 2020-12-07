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
    maxPricePerVisitor: 0.025, // Euro
    micrioShare: 20,
    contentCreatorShare: 80,
    expectedVisitorsAmount: 50000,
    subscriptions: SUBSCRIPTIONS
  },
  methods: {
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
      return Math.max(0, (((this.expectedVisitorsAmount/12) * (this.maxPricePerVisitor * (this.contentCreatorShare/100))) - subscription.pricePerMonth).toFixed(2))
    }
  }
})