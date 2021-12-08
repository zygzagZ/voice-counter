<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <input type="range" min="10" max="300" :value="size" @input="size=$event.target.value"/>
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
import {onMounted, onBeforeUnmount, ref, computed} from "@vue/composition-api"
export default {
  name: "Counter.vue",
  setup() {
    const count = ref(0)
    const total = ref(0)
    const history = ref('')
    const size = ref(100)

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

    const fontSize = computed(() => size.value / 10 + 'rem')

    return {count, total, history, size, fontSize}
  }
}
</script>

<style scoped>
  .good { color: green}
  .bad { color: red}

</style>
