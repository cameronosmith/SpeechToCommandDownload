/* this file is used to handle the frontend and backend of the 
 * grammar buttons on the dom and providing a layer between
 * the html and javaJsCommunications script
 * */

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * back end grammar button scripting (delgating button requests)
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* method to edit the grammar on the button
 * delegates to grammar editor script once name is retrieved from button
 * @param grammarButton : the grammar button pressed
 * @return : none
 * */
function handleGrammarButtonEdit (grammarButton) {
    //grammarContainer is the container holding the button and its dropdown sublinks
    var grammarContainer = grammarButton.parents (".grammarButtonAndDropdownContainer");
    //grammarName is the html val of the grammar button (first child of container)
    var grammarName = $(grammarContainer).children(".grammarButton").text();
    console.log("button grammar name is"+grammarName);
    /* delegate to grammar editor's edit grammar function */
    openGrammarEditor (grammarName);
}

/* method to handle the toggle grammar feature from a button press
 * delegates to javJsCommunication script once name is retrieved from button
 * @param grammarButton : the grammar button pressed
 * @return : none
 * */
function handleGrammarButtonToggle (grammarButton) {
    //grammarContainer is the container holding the button and its dropdown sublinks
    var grammarContainer = grammarButton.parents (".grammarButtonAndDropdownContainer");
    //grammarName is the html val of the grammar button (first child of container)
    var grammarName = $(grammarContainer).children (".grammarButton").text();
    /* delegate to javJsCommunication function */
    var toggleStatus = toggleGrammar(grammarName);
    
    /* update the toggle status on the html */
    if (toggleStatus.trim() == "true") {
        grammarButton.text ("toggle grammar OFF");
        $(grammarContainer).children (".grammarButton").removeClass ("toggleOffButton");
        $(grammarContainer).children (".grammar-dropdown-content").removeClass ("toggleOffDropdown");
    }
    else {
        grammarButton.text ("toggle grammar ON");
        $(grammarContainer).children (".grammarButton").addClass ("toggleOffButton");
        $(grammarContainer).children (".grammar-dropdown-content").addClass ("toggleOffDropdown");
    }
}

/* method to handle the delete grammar feature from a button press
 * delegates to javJsCommunication script once name is retrieved from button
 * @param grammarButton : the grammar button pressed
 * @return : none
 * */
function handleGrammarButtonDelete (grammarButton) {
    //grammarContainer is the container holding the button and its dropdown sublinks
    var grammarContainer = grammarButton.parents (".grammarButtonAndDropdownContainer");
    //grammarName is the html val of the grammar button (first child of container)
    var grammarName = $(grammarContainer).children(".grammarButton").text();
    /* delete grammar with prompt, then delegate to javaJsComm. function*/
    if (confirm ("Delete grammar "+grammarName+"?")) {
        deleteGrammar (grammarName);
        /* update the grammar section since we deleted a grammar */
        resetGrammarButtons();
    }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * front end grammar button scripting
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* method to display the grammars as buttons 
 * @return : none
 * */
function displayGrammarsAsButtons () {
    /* get all the grammars */
    var allGrammars = getGrammarsAsJSONObject();
    //grammarKey is just the name of the grammar, not the actual object
    for (var grammarKey in allGrammars) {
        //grammar is the actual grammar object
        var grammar = allGrammars [grammarKey];
        /* create the gramar button and append it */
        appendGrammarButton (grammar);
    }
}

/* method to append a grammar button to the grammar section
 * @param grammar : the grammar object to append
 * @return : none
 * */
function appendGrammarButton (grammar) {
    /* class names needed for toggle on/off state grammar */
    var buttonToggleOff = (grammar.grammarOn == "true") ? "" : "toggleOffButton";
    var dropdownToggleOff = (grammar.grammarOn == "true") ? "" : "toggleOffDropdown";
    var buttonToggleText  = (grammar.grammarOn == "true") ? "OFF" : "ON";
    /* get the grammar button html */
    var markup = `
        <div class="grammarButtonAndDropdownContainer">
            <button class="grammarButton ${buttonToggleOff}">${grammar.grammarName}</button>
            <div class="grammar-dropdown-content ${dropdownToggleOff}">
                <a onclick="handleGrammarButtonEdit($(this));">
                    edit/view grammar
                </a>
                <a class="toggle" onclick="handleGrammarButtonToggle ($(this))">
                    toggle grammar ${buttonToggleText}
                </a>
                <a onclick="handleGrammarButtonDelete ($(this))">
                    delete grammar
                </a>
            </div>
        </div>
        `;   
    /* append this new  grammar button to the grammar section */
    $("#grammarButtonsContainer").append (markup);
}

/* method to append the new grammar button to the html
 * @param grammar : the grammar object to append
 * @return : none
 * */
function appendCreateGrammarButton () {
    /* get the grammar button html */
    var markup = `
        <button class="grammarButton" id="createGrammarButton" 
        onclick="openGrammarEditor()">
            create new grammar +
        </button>
        `;   
    /* append this new  grammar button to the grammar section */
    $("#createGrammarButtonContainer").append (markup);
}

/* method to remove and re-display the grammars, ex. used in case of 
 * creating a new grammar and want to update the grammar buttons
 * @return : none
 * */
function resetGrammarButtons () {
    //debug
    console.log ("resetting grammar buttons");
    /* remove the grammar buttons */
    $("#grammarButtonsContainer").empty();
    /* reinsert the grammar buttons */
    displayGrammarsAsButtons();
}
