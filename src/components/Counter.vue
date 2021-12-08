<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <v-card class="score">
          <span class="good">{{count}}</span> / <span class="bad"> {{ total - count }}</span> / <b> {{total}}</b>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import startDetection from './VoiceDetection'
import {onMounted, onBeforeUnmount, ref} from "vue"
export default {
  name: "Counter.vue",
  setup() {
    const count = ref(0)
    const total = ref(0)
    const history = ref([])

    let stop = null
    onMounted(() => {
      stop = startDetection((res) => {
        if (res) count.value++
        total.value++;
      }, (err) => {
        console.error(err)
      })
    })

    onBeforeUnmount(() => {
      console.log('unmounting!')
      stop()
    })

    return {count, total, history}
  }
}
</script>

<style scoped>
  .score {
    font-size: 10rem;
    width: fit-content;
    padding: 0 2rem;
  }
  .good { color: green}
  .bad { color: red}

</style>
