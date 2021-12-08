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

          <span class="good" @click="append(1)">{{count}}</span> / <span class="bad" @click="append(0)"> {{ total - count }}</span> / <b> {{total}}</b>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-card>
          <v-text-field :value="count ? history : history" @input="setHistory" @keydown="filterKeys"/>
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
    const append = (good) => {
      if (good) count.value++
      total.value++;

      history.value += +good
    }
    const start = () => {
      const stopCallback = startDetection(
          (res) => append(res),
          (err) => console.error(err)
      )
      stop = () => {
        stopCallback()
        stop = null
      }
    }

    onBeforeUnmount(() => {
      console.log('unmounting!')
      if (stop) stop()
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

    const setHistory = (str) => {
      history.value = str.replace(/[^01 ,]/g, '')
      count.value = str.match(/1/g)?.length || 0
      total.value = str.match(/[01]/g)?.length || 0
    }

    const filterKeys = (e) => {
      if (e.keyCode > 32 && !/^[01 ,;]$/.test(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
      }
    }

    return {count, total, history, size, fontSize, toggle, running, setHistory, append, filterKeys}
  }
}
</script>

<style scoped>
  .good { color: green}
  .bad { color: red}

</style>
