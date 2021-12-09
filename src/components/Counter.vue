<template>
  <v-container>
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:100,200,300,400,600,700' rel='stylesheet' type='text/css'>
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
        <v-card :style="{fontSize}" class="scores">

          <span class="good" @click="addResult(1)">{{count}}</span> : <span class="bad" @click="addResult(0)"> {{ total - count }}</span> <br>
          <b> {{total}} </b> <span v-if="total !== 0" class="percents">{{ (count / total * 100).toFixed(1) }}%</span>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-card>
          <v-text-field :value="occurrences" @input="setHistory" @keydown="filterKeys"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import startDetection from './VoiceDetection'
import {onMounted, onBeforeUnmount, ref, computed} from "@vue/composition-api"
export default {
  name: "Counter.vue",
  setup() {
    const count = ref(0)
    const total = ref(0)
    const occurrences = ref('')
    const running = ref(false)



    const addPause = () => {
      occurrences.value += ' '
      history.pushState(null, '', '#' + occurrences.value)
    }
    let addPauseTimeout = null

    const addResult = (good) => {
      clearTimeout(addPauseTimeout)
      addPauseTimeout = setTimeout(addPause, 10*60*1000)

      if (good) count.value++
      total.value++

      occurrences.value += ''+ +!!good
      history.replaceState(null, '', '#' + occurrences.value)
    }

    let stop = null
    const start = () => {
      stop = startDetection(
          (res) => addResult(res),
          (err) => console.error(err)
      )
    }

    const setHistory = (str) => {
      const stripped = str.replace(/[^01 ,]/g, '')
      occurrences.value = stripped
      history.replaceState(null, '', '#' + stripped)
      count.value = stripped.match(/1/g)?.length || 0
      total.value = stripped.match(/[01]/g)?.length || 0
    }

    onMounted(() => {
      setHistory(decodeURI(document.location.hash))
    })

    onBeforeUnmount(() => {
      console.log('unmounting!')
      if (running.value) stop()
    })

    const size = ref(100)
    const fontSize = computed(() => size.value / 10 + 'rem')

    const toggle = () => {
      running.value = !running.value
      if (running.value) {
        start()
      } else {
        stop()
      }
    }

    const filterKeys = (e) => {
      if (e.keyCode > 40 && !/^[01 ,;]$/.test(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault()
      }
    }

    return {count, total, occurrences, size, fontSize, toggle, running, setHistory, addResult, filterKeys}
  }
}
</script>

<style scoped>
  .good { color: green}
  .bad { color: red}
  .percents {
    font-size: 0.5em;
    font-weight: 100;
    opacity: 0.6;
  }
  .scores {
    font-family: 'Open Sans', sans-serif;
  }

</style>
