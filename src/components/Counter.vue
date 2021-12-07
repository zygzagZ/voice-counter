<template>
  <div>
    <b style="color: green">{{count}}</b> / <b> {{total}}</b>
  </div>

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
  div {
    font-size: 60px
  }

</style>
