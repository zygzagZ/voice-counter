<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <Counter/>
          </v-col>
        </v-row>
      </v-container>
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
