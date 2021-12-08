<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <v-container>
          <v-row>
            <v-col cols="10">
              <v-slider min="10" max="300" v-model="size"/>
            </v-col>
            <v-col cols="2">
              <v-btn @click="toggle">
                <v-icon> mdi-{{ running ? 'pause' : 'play' }} </v-icon>
                {{ running ? 'stop' : 'start' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-card :style="{fontSize}">

          <span class="good">{{count}}</span> / <span class="bad"> {{ total - count }}</span> / <b> {{total}}</b>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-card>
          <v-text-field v-model="history"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import startDetection from './VoiceDetection'
import {onBeforeUnmount, ref, computed} from "@vue/composition-api"
export default {
  name: "Counter.vue",
  setup() {
    const count = ref(0)
    const total = ref(0)
    const history = ref('')

    let stop = null
    const start = () => {
      const stopCallback = startDetection((res) => {
        if (res) count.value++
        total.value++;
      }, (err) => {
        console.error(err)
      })
      stop = () => {
        stopCallback()
        stop = null
      }
    }

    onBeforeUnmount(() => {
      console.log('unmounting!')
      stop()
    })

    const size = ref(100)
    const fontSize = computed(() => size.value / 10 + 'rem')


    const running = ref(false)

    const toggle = () => {
      running.value = !running.value
      if (stop) {
        stop()
      } else {
        start()
      }
    }

    return {count, total, history, size, fontSize, toggle, running}
  }
}
</script>

<style scoped>
  .good { color: green}
  .bad { color: red}

</style>
