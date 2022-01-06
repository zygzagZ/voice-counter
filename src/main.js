import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueCompositionAPI from '@vue/composition-api'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.use(VueCompositionAPI)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
