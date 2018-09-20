//how much the window should shift up and down when using the grammar editor
const windowResizeY = 600;
/* method to open the grammar editor 
 * @param grammarName : the name of the grammar to edit, null if new grammar 
 * @return : none
 * */
function openGrammarEditor (grammarName) {
   // later get the actual grammar json, for now just load the html
   /* load the grammar editor html */
    $.get ("otherHtml/grammarEditorHtml.html", function (grammarHtmlReceived) {
        /* add the html to the main page */
        $("body").append (grammarHtmlReceived);
        /* append a new vocab label if new grammar editing, else read in vocab labels */
        if (grammarName == null) {
            appendVocab ();
        }
        else {
            var grammarObj = getSpecificGrammar (grammarName);
            displayGrammarFromJsonString (grammarObj);
        }
    });
    /* open the window more for better view */
    window.resizeBy (0, windowResizeY);
}

/* method to append a vocab input item to the vocab input section
 * @param command : the command of the vocab
 * @param keySequence : the keySequence of the vocab
 * @return : none
 * */
function appendVocab (command, keySequence) {
    //debug
    console.log ("appending vocab");
    //htmlToAppend is the html of the vocab unit
    var htmlToAppend;
    //only enter preview status for input if there was no input entered. change this to template form
    if (arguments.length < 2)
        htmlToAppend = `
            <div class="vocabItem">
                <input class="command vocabInput" 
                    placeholder="enter commmand here" >
                <input class="keySequence vocabInput executeTabOnInput" 
                    placeholder="enter key sequence here" keypress="disableSpace(event)">
            </div>
        `;   
    else
        htmlToAppend = `
            <div class="vocabItem">
                <input class="command vocabInput" value="${command}">
                <input class="keySequence vocabInput executeTabOnInput" value="${keySequence}" >
            </div>
        `;  

    /* append this vocab item to the vocab input section */
    $("#grammarEditorVocabSection").append (htmlToAppend)
    $(".command").keydown(function(event){disableSpace(event)})
}

/* method to disable spaces in the command input field
 * @param event: the keboard event
 * @return: false if a space 
 * */
function disableSpace (event) {
    /* check for and alert for space error */
    if (event.keyCode == 32) {
        alert("commands are single words")
        event.preventDefault()
    }
}

/* method to close the editor
 * @return : none 
 * */
function closeEditor () {
    /* delete the editor */
    $("#grammarModal-background").remove ();
    /* shrink the window for initial view */
    window.resizeBy (0, -1*windowResizeY);
}
/* method to collect the grammar items to submit to desktop as json 
 * @return : the json string containing the grammar 
 * */ 
function getJsonStringFromGrammar () {
    //grammarJson is the json object we will be storing the grammar info in
    var grammarJson = {};
    /* set the toggle default property of the grammar */
    grammarJson.grammarOn = "true";
    //grammar name is the value of the input field for the grammar editor name
    var grammarName = $("#grammarEditorTitle").val();
    grammarJson.grammarName = grammarName;
    /* iterate through each grammar vocab item and get value */
    //vocabItems is the list of vocab definitions in the editor
    var vocabItems = $("#grammarEditorVocabSection").children();
    /* make the object to hold the grammars in */
    grammarJson.grammarVocabulary = {};
    /* iterate through each child and get values of command/keysequence */
    for (var index = 0; index < vocabItems.length; index++) {
        //commandAndSequencePair is the children of the div containing the unit
        var commandAndSequencePair = $(vocabItems[index]).children();
        /* set the command and key values of the vocab item */
        var grammarName = $(commandAndSequencePair[0]).val();
        var keySequence = $(commandAndSequencePair[1]).val();
        if (grammarName != "")
            grammarJson.grammarVocabulary[grammarName] = keySequence;
    }
    
    return JSON.stringify(grammarJson);;
}

/* method to save a grammar (write it to file)
 * @return : none
 * */ 
function saveGrammar () {
    /* get the json string and then send it to desktop app to write */ 
    //stringifiedGrammar is the grammar as a json string
    var stringifiedGrammar = getJsonStringFromGrammar ();
    writeGrammar (stringifiedGrammar);
}

/* method to take the json string and display the grammar objects
 * @param grammarObj : the grammar object
 * @return : none
 * */ 
function displayGrammarFromJsonString (grammarObj) {
    /* set the name of the grammar editor */
    $("#grammarEditorTitle").val(grammarObj.grammarName);
    /* iterate through the grammar object and append its grammar labels */
    for (var key in grammarObj.grammarVocabulary) {
        if (grammarObj.grammarVocabulary.hasOwnProperty(key)) {
            appendVocab (key, grammarObj.grammarVocabulary[key]);
        }
    }
}
