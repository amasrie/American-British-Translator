import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

let translation = [];
let highlight = [];

/**
	@method clearButton
	Clears the textArea, translated sentence and error message
*/
window.clearButton = () => {
  document.getElementById("text-input").value = "";
  document.getElementById("error-msg").innerHTML = "";
  document.getElementById("translated-sentence").innerHTML = "";
}

/**
	@method setOption
  @param {boolean} isAmerican American to British translator
	Selects a translation option
*/
window.setOption = isAmerican => {
  document.getElementById("locale-select").value = isAmerican ? 'american-to-british' : 'british-to-american';
}

/**
	@method getError
  @return {string} content of error div
*/
window.getError = () => {
  return document.getElementById("error-msg").innerHTML;
}

/**
	@method getArea
  @return {string} Content of text area
*/
window.getArea = () => {
  return document.getElementById("text-input").innerHTML;
}

/**
	@method getTranslation
  @return {string} Content of translated text
*/
window.getTranslation = () => {
  return document.getElementById("translated-sentence").innerHTML;
}

/**
	@method setText
  @param {string} sentence A sentence to be added
	Adds a sentence to the text-input
*/
window.setText = (sentence) => {
  document.getElementById("text-input").value = sentence;
}

/**
	@method translateButton
	Checks for words to translate or errors 
  based on a given a sentence and a translation option  
*/
window.translateButton = () => {

  /**
    @method upperCase Method that tries to restore each word to upper case, if applies
    @param {string} sentence Original sentence
  */
  let upperCase = sentence => {
    let lookupOriginal = 0;
    let lookupTranslated = 0;
    let lookupHighlighted = 0;
    let listOriginal = sentence.split(" ");
    let listTranslated = translation.split(" ");
    let listHighlighted = highlight.split(" ");
    for(let i = 0; i + lookupOriginal < listOriginal.length; i++){
      if(listHighlighted[i + lookupHighlighted] == '<span'){
        lookupHighlighted++;
      }
      if(listOriginal[i + lookupOriginal].toLowerCase() == listTranslated[i + lookupTranslated]){
        //word without translation
        if(listOriginal[i + lookupOriginal].substring(0,1) != listTranslated[i + lookupTranslated].substring(0,1)){
          if(listOriginal[i + lookupOriginal].substring(1,2) != listTranslated[i + lookupTranslated].substring(1,2)){
            //fully uppercase
            listTranslated[i + lookupTranslated] = listTranslated[i + lookupTranslated].toUpperCase();
            listHighlighted[i + lookupHighlighted] = listHighlighted[i + lookupHighlighted].toUpperCase();
          }else{
            //first letter uppercase
            listTranslated[i + lookupTranslated] = listTranslated[i + lookupTranslated].substring(0,1).toUpperCase() + listTranslated[i + lookupTranslated].substring(1);
            listHighlighted[i + lookupHighlighted] = listHighlighted[i + lookupHighlighted].substring(0,1).toUpperCase() + listHighlighted[i + lookupHighlighted].substring(1);
          }
        }
      }else{
        //translated word, check if it's a multiple word translation
        let lookup = 0;
        //check word difference for original and for translated
        if(i < listOriginal.length - 1){
          let found = false;
          let valOriginal = 0;
          for(let j = i + 1; j < listOriginal.length && j < i + 6; j++){
            let valTranslation = 0;
            for(let k = i + 1; k < listTranslated.length && k < i + 6; k++){
              if(listOriginal[j].toLowerCase() == listTranslated[k].toLowerCase()){
                found = true;
                lookupOriginal += valOriginal;
                lookup = valTranslation;
                break;
              }
              valTranslation++;
            }
            if(found){
              break;
            }
            valOriginal++;
          }
        }
        if(listOriginal[i + lookupOriginal] && listOriginal[i + lookupOriginal].substring(0,1) != listOriginal[i + lookupOriginal].toLowerCase().substring(0,1)){
          if(listOriginal[i + lookupOriginal].length > 1 && listOriginal[i + lookupOriginal].toLowerCase().substring(1,2) != listOriginal[i + lookupOriginal].substring(1,2)){
            //fully uppercase
            lookupTranslated += lookup+1;
            lookupHighlighted += lookup+1;
            for(let k = 0; k <= lookup; k++){
              listTranslated[i + lookupTranslated] = listTranslated[i + lookupTranslated].toUpperCase();
              listHighlighted[i + lookupHighlighted] = listHighlighted[i + lookupHighlighted].toUpperCase().replace(/CLASS\=\"HIGHLIGHT\">/g, "class=\"highlight\">").replace(/<\/SPAN>/g, "</span>");
            }
          }else if(listOriginal[i + lookupOriginal].length == 1 || listOriginal[i + lookupOriginal].toLowerCase().substring(1,2) == listOriginal[i + lookupOriginal].substring(1,2)){
            //first letter uppercase
            listTranslated[i + lookupTranslated] = listTranslated[i + lookupTranslated].substring(0,1).toUpperCase() + listTranslated[i + lookupTranslated].substring(1);
            listHighlighted[i + lookupHighlighted] = listHighlighted[i + lookupHighlighted].substring(0, 18) + listHighlighted[i + lookupHighlighted].substr(18,1).toUpperCase() + listHighlighted[i + lookupHighlighted].substring(19);
            lookupTranslated += lookup;
            lookupHighlighted += lookup;
          }
        }else{
            lookupTranslated += lookup;
            lookupHighlighted += lookup;
        }

      }
    }
    translation = listTranslated.join(" ");
    highlight = listHighlighted.join(" ");
  };
  
  /**
    @method translate Method that tries to find the translation of a word in a dictionary
    @param {string} type type of translation
    @param {any} dictionary JSON file to check
  */
  let translate = (type, dictionary) => {
    let result = null;
    if(dictionary){
      //json evaluation
      for(let i in dictionary){
        let regex = type ? new RegExp("( |^)" + i.replace(/\./g, '\\.') + "( |\\.|$|\,|\;)", "g") : new RegExp("( |^)" + dictionary[i] + "( |\\.|$|\,|\;)", "g");
        result = translation.replace(regex, type ? "$1" + dictionary[i] + "$2" : "$1" + i + "$2" )
        highlight = result ? highlight.replace(regex, type ? '$1<span class="highlight">'+dictionary[i]+'</span>$2' : '$1<span class="highlight">'+ i +'</span>$2') : highlight;
        translation = result ? result : translation;
      }
    }else{
      //time evaluation
      result = translation.replace(type ? /([^0-9])(\d{1,2}):(\d\d)([^0-9])/g : /([^0-9])(\d{1,2})\.(\d\d)([^0-9])/g, (type ? '$1$2.$3$4' : '$1$2:$3$4'));
      highlight = result ? highlight.replace((type ? /([^0-9])(\d{1,2}):(\d\d)([^0-9])/g : /([^0-9])(\d{1,2})\.(\d\d)([^0-9])/g), (type ? '$1<span class="highlight">$2.$3</span>$4' : '$1<span class="highlight">$2:$3</span>$4')) : highlight;
      translation = result ? result : translation;
    }
  };
  
  let msgFine = "Everything looks good to me!";
  let msgError = "Error: No text to translate.";
  document.getElementById("error-msg").innerHTML = "";
  document.getElementById("translated-sentence").innerHTML = "";
  let option = document.getElementById("locale-select").value == 'american-to-british';
  let sentence = document.getElementById("text-input").value.trim();
  translation = sentence.toLowerCase();
  highlight = sentence.toLowerCase();
  if(sentence.length === 0){
    document.getElementById("error-msg").innerHTML = msgError;
    return msgError;
  } else{
    translate(option, americanToBritishTitles);
    translate(option, null);
    translate((option ? option : !option), (option ? americanOnly : britishOnly));
    translate(option, americanToBritishSpelling);
    upperCase(sentence);
    if(translation.length === highlight.length){
      document.getElementById("error-msg").innerHTML = msgFine;
      return msgFine;
    }else{
      document.getElementById("translated-sentence").innerHTML = highlight;
      return translation;
    }
  }
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
  	setOption: window.setOption,
    getArea: window.getArea,
    getError: window.getError,
    getTranslation: window.getTranslation,
  	setText: window.setText,
  	clearButton: window.clearButton,
  	translateButton: window.translateButton

  }
} catch (e) {}
