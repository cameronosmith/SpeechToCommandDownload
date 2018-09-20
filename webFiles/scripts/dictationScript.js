// src paths for images for cleaner reference
var micOnImgPath = "style/img/microphone.png";
var micOffImgPath = "style/img/muted.png";
//instructionPresent is whether the text is still on the screen or not
var instructionPresent = true;
//mic is the microphone image element
var mic = $("#mic");
//micOn is to keep track of whether the mic is on or not
var micOn = false;

//declare speech recognition variables / set properties needed
var recognition = getNewRecognition();

/* function to setup the recognition object since we have to do it twice
 * @return: the set up recognition object 
 * */
function getNewRecognition () {
    var recognition = new webkitSpeechRecognition(); //enable if chrome
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous=true;
    recognition.onresult = function(event){handleRecognitionResult(event);};
    recognition.onend = function(){console.log("speech ended");restartIfSleeping();};
    return recognition;
}

//handle microphone click to toggle mic 
/* method toggleMic is to toggle the microphone access
 * @return: none
 * */
mic.click (function toggleMicOverview () {
    //if the instructions still present then remove it
    if (instructionPresent == true) {
        $("#finalTranscriptionResult").text("");
        instructionPresent = false;
    }
    //toggle image src
    if (mic.attr ('src') == micOnImgPath)
        mic.attr ("src",micOffImgPath);
    else
        mic.attr ("src",micOnImgPath);
    //toggle microphone listening 
    toggleMicListening ();
});

/* method to toggle the microphone listening
 * @return : none
 * */
function toggleMicListening () {
    //toggle mic
    if (micOn) {
        //debug 
        console.log ("turning off listening");
        recognition.stop ();
        micOn = false;
    }
    else {
        //debug 
        console.log ("turning on listening");
        recognition.stop();
        recognition.start ();
        micOn = true;
    }
}

/* method to handle how we process the speech recognition results
 * @param event: the speech recognition event (don't need to provide)
 * @return : none
 * */
function handleRecognitionResult (event) {
    //transcript is the text recorded
    var transcript = event.results[event.results.length-1][0].transcript;
    console.log ("recognized : "+transcript); //debug
    /* send transcript to java and store response object */
    //finalTranscript is the final transcription result
    var finalTranscript='';
    //interm stores the interim results of the dictation
    var interim='';
    /* iterate through the speech recognition results to get the last recognized phrass */
    for (var i = event.resultIndex; i < event.results.length; i++) {      
        /* check if last recognized phrase is the final recognized version */
        if (event.results[i].isFinal) { 
            finalTranscript += event.results[i][0].transcript;
        } 
        /* else handle interm result for feedback */
        else {   
            interim += event.results[i][0].transcript;
        } 
    } 
    /* display the interm and final transcript onto the page */
    $("#finalTranscriptionResult").html(finalTranscript);
    $("#interimResults").text(interim);
    /* send the final dictation to java */
    console.log("final transcript is "+finalTranscript)
    for (var wordIndex = 0; wordIndex < finalTranscript.split().length; wordIndex++){
        sendDictation (finalTranscript.split()[wordIndex].toLowerCase());
    }
}

/* method to restart the dictation when it goes to sleep
 * @return : none
 * */
function restartIfSleeping () {
    //if mic was not turned off, then it went to sleep; restart it
    if (micOn) {
        //recognition.stop();
        //recognition.start();
        recognition = getNewRecognition();
        recognition.start();
    }
    else {
        console.log("mic off but was supposed to be off");
    }
}
