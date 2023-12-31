export class SpeechToText {
    #micElement;
    #outputElement;
    #speechRecognition;

    _isListening;

    get isListening() {
        return this._isListening;
    }
    set isListening(value){
        this._isListening = value;
        if(value){
            this.#micElement.classList.add('listening');
        } else {
            this.#micElement.classList.remove('listening');
        }
    }

    #_activeText;
    get activeText() {
        return this.#_activeText;
    }
    set activeText(value){
        this.#_activeText = value;
    }

    /**
    *
    * @param {{
    *   micElementSelector: string;
    *   outputElementSelector: string;
    * }} options
    * 
    */ 

    constructor(options){
        if(this.#optionsNullCheck(options)){
            console.error('Elements Not Found');
            return;
        }
        const {
            micElementSelector,
            outputElementSelector,
        } = options;

        this.#micElement = document.querySelector(micElementSelector);
        this.#outputElement = document.querySelector(outputElementSelector);

        this.isListening = false;
        this.#addEventListener();
        this.#enableSpeechRecognition();
    }

    #extractTranscript(event) {
        return event.results[0][0].transcript;
    }

    #enableSpeechRecognition() {
        // Step-1: Create Fallback;
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if(!window.SpeechRecognition){
            console.error(`Your browser doesn't support this Functionality`);
            alert(`Your browser doesn't support this Functionality`);
            return;
        }
        // Step-2: Create instance;
        this.#speechRecognition = new SpeechRecognition();
        this.#speechRecognition.interimResults = true;
        // Step-3: add 'result' listener;
        this.#speechRecognition.addEventListener('result', event => {
            const transcript = this.#extractTranscript(event);
            console.log('Output: ', transcript);
            this.activeText = ' ' + transcript;
        });

        // this.#speechRecognition.start();
        // Restart speech recognition on end
        this.#speechRecognition.addEventListener('end', this.#onRecognitionEnd.bind(this));
    }

    #onRecognitionEnd() {
        this.#updateOutputText();
        if(this.isListening){
            this.startRecognition();
        }
    }

    /**
     * Add the active Text to the final output
     * */ 

    #updateOutputText(){
        if(!this.activeText){
            return;
        }

        this.#outputElement.value += this.activeText;
    }

    #optionsNullCheck(options){
        const nullSelectors = [
            'micElementSelector',
            'outputElementSelector',
        ].filter(selector => !options[selector]);

        if(nullSelectors.length){
            console.error(`Please provide the following selectors ${nullSelectors.join(', ')}`);
            return true;
        }

        return false;
    }

    #addEventListener() {
        this.#micElement.addEventListener('click', this.toggleListen.bind(this));
        // this.#micElement.addEventListener('click', this.showOutput.bind(this));
    }

    toggleListen() {
        if(this.isListening){
            this.stopRecognition();
        } else {
            this.startRecognition();
        }
    }

    startRecognition() {
        this.isListening = true;
        this.#speechRecognition.start();
    }

    stopRecognition() {
        this.isListening = false;
    }

}
