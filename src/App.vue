<template>
  <v-app>
    <v-main>
      <Counter/>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Counter from './components/Counter'

export default {
  name: 'App',

  components: {
    // HelloWorld,
    Counter
  },

  data: () => ({
    //
  }),
}
</script>
