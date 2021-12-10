<template>
  <div></div>
</template>

<script>
const SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition
const SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList

const positive = [ 'dobrze', 'jest', 'tak', 'siedzi', 'plus', '+', '1']
const negative = [ 'nie', 'nie ma', 'minus', '-', '0']
const keywords = [...positive, ...negative]
const grammar = '#JSGF V1.0; grammar words; public <word> = ' + keywords.join(' | ') + ' ;'
const speechRecognitionList = new SpeechGrammarList()
speechRecognitionList.addFromString(grammar, 1)

import {onBeforeUnmount, watch} from "@vue/composition-api"

export default {
  name: "VoiceDetector",
  props: {
    enabled: {
      type: Boolean,
      required: true
    }
  },
  setup(props, {emit}) {
    const recognition = new SpeechRecognition();
    recognition.grammars = speechRecognitionList
    recognition.continuous = true
    recognition.lang = 'pl-PL';
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    watch(() => props.enabled, (v) => {
      if (v) {
        recognition.start()
      } else {
        recognition.stop()
      }
    })

    const restart = (reason) => {
      if (props.enabled) {
        recognition.start()
        console.log('recognition restarted, reason: ', reason)
      }
    }
    recognition.onresult = (e) => {
      console.log('speech result:', e)
      const result = e.results[e.resultIndex]
      if (!result.isFinal) {
        console.log('not final result!', result, [...result].map((alt) => alt.transcript.toLowerCase().trim()))
      } else {
        for (const alt of result) {
          const words = alt.transcript.toLowerCase().trim()
          if (positive.includes(words)) {
            emit("input", true)
          } else if (negative.includes(words)) {
            emit("input", false)
          } else {
            emit("notRecognized", alt.transcript)
            continue
          }
          return
        }
      }
    }

    recognition.onspeechend = () => {
      setTimeout(restart, 1000, 'speech end')
    }

    recognition.onnomatch = () => {
      setTimeout(restart, 100, 'no match')
    }

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') {
        setTimeout(restart, 0, 'no speech')
        return
      }
      console.error('Recognition error: ', e)
      emit("error", e)
    }
    if (props.enabled)
      recognition.start();


    onBeforeUnmount(() => {
      recognition.stop()
    })

    return {}
  }
}
</script>

<style scoped>

</style>
