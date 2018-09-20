/* the list of grammar requests to make */
const requestDelim = "%%%";
const deleteGrammarRequest = "delete grammar: ";
const getAllGrammarsRequest = "return all grammars";
const createGrammarRequest = "create new grammar";
const writeGrammarRequest = "write grammar: ";
const toggleGrammarRequest = "toggle grammar: ";
const readGrammarRequest = "requesting grammar: ";
const getSpeechModesRequest = "requesting speech modes";
const writeSpeechModesRequest = "sending speech modes: ";
/* the list of error messages php will respond with */
const hostErr = "error: could not connect to host\n";
const socketCreateErr = "error: could not create socket\n";
const writeSocketErr = "error: failed to write to socket\n";
const readSocketErr = "error: failed to read from socket\n";
/* the response messages for errors */
const hostErrFeedback = "could not connect to host, restart desktop "+
                         "application and refresh this page";
const socketErrFeedback = "could not write/read/create socket, you may be running "+
                         "this application more than once, or your port 4242 may be"+
                         " occupied by another application";

/* method to send a string to java through the socket
 * @param message : the string to send to java 
 * @return : the return string from java, null if error
 * */
function writeStringToJava (message) {
    /* don't send if empty string */
    if (message == "")
        return;
    //ajaxOutput is to store the output of the ajax request
    var ajaxOutput;
    //debug
    console.log ("WRITING TO JAVA : "+message);
    //we will use ajax to execute our php script to write to the socket
    $.ajax ({ 
        url: 'scripts/sendToJava.php',
        data: {word: message},
        async: false,
        type: 'post',
        success: function (output) {
            //print to console for debugging
            console.log (output);
            //check for error message and direct output if not error
            ajaxOutput = checkInputForError(output) ? null : output;
        }
    }); 
    
    return ajaxOutput;
}

/* method to check for error messages in php response 
 * @param input : the response transmitted by php to check for err
 * @return : true if there was an error
 * */
function checkInputForError (input) {
    /* handle the common error of the host (java) not running */
    if (input.includes(hostErr)) {
        if (!alert (hostErrFeedback))
            window.location.reload();
        return true;
    }
    /* handle more rare socket erorrs */
    if (input.includes(socketCreateErr) || input.includes(writeSocketErr)
            || input.includes(readSocketErr)) {
        if (!alert (socketErrFeedback))
            window.location.reload();
        return true;
    }

    /* no error if reached this point */
    return false;
}

/* method to get request all grammars as one json string and parse it
 * @return : an object containing all the grammars
 * */
function getGrammarsAsJSONObject () {
    //the java response for grammars
    var grammarsResponse = writeStringToJava (requestDelim+getAllGrammarsRequest);

    /* check for error */
    if (checkInputForError(grammarsResponse)) {
        console.log("error")
        return "";
    }
    else {
        console.log("no error")
        return JSON.parse(grammarsResponse);
    }
}

/* method to request a specific grammar 
 * @param grammarName : the name of the grammar
 * @return : the grammar json object 
 * */
function getSpecificGrammar (grammarName) {
    //grammarJsonString is the returned json string for the grammar
    var grammarJsonString = writeStringToJava (requestDelim+readGrammarRequest+grammarName);
    return JSON.parse (grammarJsonString);
}

/* method to request to write a grammar 
 * @param stringifiedGrammar: the grammar as a json string
 * @return: success if successful
 * */
function writeGrammar (stringifiedGrammar) {
    //debug
    console.log ("writing grammar");
    /* send write request to java */    
    return writeStringToJava (requestDelim + writeGrammarRequest + stringifiedGrammar);
}

/* method to toggle a grammar on or off 
 * @param grammarName : the name of the grammar to toggle
 * @return: the new state of the grammar 
 * */
function toggleGrammar (grammarName) {
    //debug
    console.log ("toggling grammar: " + grammarName);
    /* send toggle request to java , returning new grammarOn status*/
    return writeStringToJava (requestDelim+toggleGrammarRequest+grammarName);
}

/* method to delete a grammar
 * @param grammarName : the name of the grammar to delete
 * @return: success if successful
 * */
function deleteGrammar (grammarName) {
    //debug
    console.log ("deleting grammar: " + grammarName);
    /* send toggle request to java , returning new grammarOn status*/
    return writeStringToJava (requestDelim+deleteGrammarRequest+grammarName);
}

/* method to send a normal dictation speech to java
 * @param speechRecognized : the text dictation scribed
 * @return : the java response object */
function sendDictation (speechRecognized) {
    /* write the dictation to java, storing the response to display */
    var stringifiedResponse = writeStringToJava (speechRecognized);
    /* parse and send the response object to display in the console */
    if (stringifiedResponse == null)
        return;
    var responseObject = JSON.parse (stringifiedResponse);
    /* this is a layer violation, later put in speech recognition script */
    if (responseObject != null) {
        appendJavaResponseToConsole (responseObject);
        /* reset the speech mod buttons in case the user called a speech modification command 
         * another layer violation as well, change in production */
        updateDictationStatesButtonsInHtml();
    }

    return responseObject;
}

/* function to request the state of the dictation modifications
 * @return : the object containing the states of the speech modes
 * */
function requestSpeechModesFromJava () {
    /* get and parse the speech modes object */
    var speechModesObj = writeStringToJava (requestDelim + getSpeechModesRequest);
    return JSON.parse (speechModesObj);
}

/* function to write the states of the dictation modifications
 * @param statesObj : the states object to write
 * @return : success if successful
 * */
function writeSpeechModesFromJava (statesObj) {
    /* stringify and send the return states obj */
    var statesObjStringified = JSON.stringify (statesObj);
    return writeStringToJava (requestDelim+writeSpeechModesRequest+statesObjStringified);
}
