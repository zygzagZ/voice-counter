
const SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition
const SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
const SpeechRecognitionEvent = SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

const positive = [ 'dobrze', 'jest', 'tak', 'siedzi', 'plus', '+', '1'];
const negative = [ 'nie', 'nie ma', 'minus', '-', '0']
const keywords = [...positive, ...negative]
const grammar = '#JSGF V1.0; grammar words; public <word> = ' + keywords.join(' | ') + ' ;'

export default function startDetection(onData, onError) {
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList()
    speechRecognitionList.addFromString(grammar, 1)
    recognition.grammars = speechRecognitionList
    recognition.continuous = true
    recognition.lang = 'pl-PL';
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (e) => {
        console.log('speech result:', e)
        const result = e.results[e.resultIndex]
        if (!result.isFinal) {
            console.log('not final result!', result, [...result].map((alt) => alt.transcript.toLowerCase().trim()))
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
        setTimeout(() => recognition.start(), 1000)
    }

    recognition.onnomatch = (e) => {
        console.log('no match found: ', e)
        setTimeout(() => recognition.start(), 100)
    }

    recognition.onerror = (e) => {
        if (e.error === 'no-speech') {
            console.error('no speech err: ', e)
            setTimeout(() => recognition.start(), 0)
            return
        }
        console.error('Recognition error: ', e)
        if (onError) onError(e)
    }

    recognition.start();
    window.recognition = recognition
    return () => recognition.stop()
}
