import { SpeechToText } from './SpeechToText.js';
const speechToText = new SpeechToText({
    micElementSelector: '#micIcon',
    outputElementSelector: '#keyword',
})