import React, {Component} from 'react';
import {connect} from 'react-redux';
import findAndReplaceDOMText from 'findandreplacedomtext';
import porteng from '../../../../../data/portuguese.json';
import frencheng from '../../../../../data/french.json';
var Mark = require('mark.js');

let originalDoc = "";
let od0 = "";
let originalEl = {};

const mapStateToProps = (state) => {
  return {
    language: state.language,
    immersion: state.immersion,
  };
};

function getElements(){
  let elements = null;
  let baseUri = document.baseURI;
  // Aeon
  if(baseUri.startsWith('https://aeon.co/essays/')){
    console.log("AEON");
    elements = document.getElementsByClassName('article__body__content');
  }
  // NYT Mobile
  if(baseUri.startsWith('http://www.mobile.nytimes.com/')){
    elements = document.getElementsByClassName('p-block');
  }
  // NYT
  if(baseUri.startsWith('http://www.nytimes.com/')){
    console.log("NYTIMES");
    elements = document.getElementsByClassName('story-body-text story-content');
  }
  // BuzzFeed
  if(baseUri.startsWith('https://www.buzzfeed.com/')){
    elements = document.getElementsByTagName('p');
  }
  return elements;
}

function changeLang(lang, immersion){
  let elements = getElements();
  let langDict = null;
  let langKey = null;
  let engTrue = false;
  // Select language
  console.log(lang);
  switch (lang){
    case "Portuguese":
      langDict = porteng;
      langKey = "portuguese";
      break;
    case "French":
      console.log(frencheng);
      langDict = frencheng;
      langKey = "french";
      break;
    case "English":
      engTrue = true;
    default:
      break;
  }
  if(elements && (langDict && langKey) || (engTrue)){
    for(var i =0; i < elements.length;i ++){
      elements[i].innerHTML = originalEl[i];
    }
    if(engTrue){
      return;
    }
    // get immersion * 200 random words
    let randWords = [];
    let visited = {};
    for(var i = 0;i < (immersion * 0.01) * langDict.length; i++){
      let randIndex = Math.floor(Math.random() * (immersion * 0.1) * langDict.length);
      let randWord = langDict[randIndex];
      if(!visited[randWord["english"]]){
        visited[randWord["english"]] = randWord[langKey];
        randWords.push(randWord);
      }
    }

    // modify stylesheets
    let ss = document.styleSheets
    for(var i = 0; i < ss.length; i++){
      ss[i].insertRule("acronym { background-color: yellow;}", 0);
    }

    for(var i = 0; i < elements.length; i++){
      for(var j = 0; j < randWords.length; j++){
        let eng = new RegExp("\\b" + randWords[j]["english"] + "\\b");
        let newWord = randWords[j][langKey];
        findAndReplaceDOMText(elements[i], {
          find: eng,
          replace: newWord,
          wrap: 'acronym'
        });
      }
    }
  }
}


class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let el = getElements();
    for(var i = 0; i < el.length; i++){
      originalEl[i] = el[i].innerHTML;
    }
    console.log(originalEl);
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        console.log(request);
        if(request.language && request.immersion){
          changeLang(request.language, request.immersion);
        }
      }
    );
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        console.log(request);
        if(request.power){
          switchPower(request.power);
        }
      }
    );
    changeLang("French", 5);
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
