/* this file is used for calling the main functions to init the gui, etc */
$(document).ready (new function () {
    /* check if this is chrome or not by if supporting webkit recognition */
    if (!/Chrome/.test(navigator.userAgent) || !/Google Inc/.test(navigator.vendor)) {
        alert("this browser does not support speech recognition. use Google Chrome instead.")
    }
    /* make application window smaller */
    window.resizeTo(720,140);
    /* arbitrary test commadnd to assess conection to server */
    var responseFromJava = getGrammarsAsJSONObject ();
    if (responseFromJava != null) {
        /* call the display grammars since we want it at the dom at startup when ready */
        displayGrammarsAsButtons ();
        /* display grammar buttons */
        appendCreateGrammarButton ();
        /* set the dictation states when ready */
        updateDictationStatesButtonsInHtml();
    }
});



