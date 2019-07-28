import Vue from 'vue'
import App from './App.vue'

import ga from 'vue-ga'

Vue.config.productionTip = false

ga(collect => {
  collect(location.pathname + location.hash)
}, 'UA-62416681-1')

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
