
const SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition
const SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
const SpeechRecognitionEvent = SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

const positive = [ 'tak', 'yes', 'yest', 'yeah', 'yea', 'plus', 'ploos', '+', 'close'];
const negative = [ 'no', 'nope', 'nah', 'nie', 'minus', 'midas', '-', 'minos']
const keywords = [...positive, ...negative]
const grammar = '#JSGF V1.0; grammar words; public <word> = ' + keywords.join(' | ') + ' ;'

export default function startDetection(onData, onError) {
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList()
    speechRecognitionList.addFromString(grammar, 1)
    recognition.grammars = speechRecognitionList
    recognition.continuous = true
    recognition.lang = 'en-US';
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (e) => {
        console.log('speech result:', e)
        const result = e.results[e.resultIndex]
        if (!result.isFinal) {
            console.log('not final result!', result)
        } else {
            for (const alt of result) {
                const words = alt.transcript.toLowerCase().trim()
                if (positive.includes(words)) {
                    onData(true)
                } else if (negative.includes(words)) {
                    onData(false)
                } else {
                    console.error('not recognized:', alt.transcript)
                    onError('not recognized!')
                    continue
                }
                return
            }
        }
    }

    recognition.onspeechend = (e) => {
        console.log('speech end: ', e)
    }

    recognition.onnomatch = (e) => {
        console.log('no match found: ', e)
    }

    recognition.onerror = (e) => {
        console.error('Recognition error: ', e)
        if (onError) onError(e)
    }

    recognition.start();
    return () => recognition.stop()
}
