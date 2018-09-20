/* method to append response text from java to the typing console
 * @param responseObject : the response object written from java
 * @return : none
 * */
function appendJavaResponseToConsole (responseObject) {
    /* iterate through the response and print each message */
    for (var key in responseObject) {
        //responseHtml is the response text to send to the console
        responseHtml = "<p class='consoleText'>"+responseObject [key]+"</p>";
        /* append the text to the console */
        $("#typingConsoleTextContainer").prepend (responseHtml);
    }
}

/* method to be called on state button click
 * @param callingBtn : the calling button , just passing in $(this) in html
 * @return : none 
 * */
function DMBClick (callingBtn) {
    /* toggle the html styling of the clicked button */
    if (callingBtn.hasClass ("dmbOn") && !callingBtn.hasClass ("dmbOff")) {
        callingBtn.removeClass ("dmbOn").addClass ("dmbOff");
    }
    else {
        callingBtn.removeClass ("dmbOff").addClass ("dmbOn");
    }
    /* update button states to java and then reflect changes in html */
    updateDictationStatesButtonsToJava ();
    updateDictationStatesButtonsInHtml ();
}

/* method to set the states of the dictation mode buttons
 * @return : none
 * */
function updateDictationStatesButtonsInHtml () {
    /* get the states object */
    var statesObject = requestSpeechModesFromJava ();
    /* iterate through states to update html */
    for (var key in statesObject) {
        //dictButton is the dictation mode button we are setting
        var dictButton = $("#"+key);
        /* reset button by removing both classes */
        dictButton.removeClass ("dmbOn dmbOff");
        /* set the states as on or depending on bool value */
        if (statesObject [key] == "true") {
            if (!dictButton.hasClass ("dmbOn"))
                dictButton.addClass ("dmbOn");
        }
        else {
            if (!dictButton.hasClass ("dmbOff")) 
                dictButton.addClass ("dmbOff");
        }
    }
}

/* method to send the states of the html buttons to java
 * forms a states objects and delegates to the javaJsCommunications function
 * to preserve layering fidelity
 * @return : none
 * */
function updateDictationStatesButtonsToJava () {
    /* stateObj is the object to send back to java */
    var statesObj = {};
    /* iterate through the states buttons to add them to the states obj */
    $("#dictationModificationContainer").children().each (function () {
        statesObj [$(this).text()] = $(this).hasClass ("dmbOn");
    });
    //debug testing
    console.log (statesObj);
    /* send states object to java */
    writeSpeechModesFromJava (statesObj);
}
