import React, {Component} from 'react';
import {connect} from 'react-redux';
import findAndReplaceDOMText from 'findandreplacedomtext';
import spanisheng from '../../../../../data/spanish.json';
import porteng from '../../../../../data/portuguese.json';
import frencheng from '../../../../../data/french.json';
import germaneng from '../../../../../data/german.json';

var Mark = require('mark.js');

let originalEl = {};
const SITES = {
  AEON: 'https://aeon.co/',
  NYTIMES: 'http://www.nytimes.com/',
  WIRED: 'https://www.wired.com/',
  WSJ: 'http://www.wsj.com/',
  QZ: 'http://qz.com/',
  MEDIUM: 'https://medium.com/'
}

const mapStateToProps = (state) => {
  return {
    language: state.language,
    immersion: state.immersion,
    power: state.power,
  };
};

function handleAeon(uri){
    if(uri.startsWith(SITES.AEON + 'essays/') || uri.startsWith(SITES.AEON + 'videos/')){
      return document.getElementsByClassName('article__body__content');
    }
    if(uri.startsWith(SITES.AEON + 'ideas/')){
      return document.getElementsByClassName('has-dropcap');
    }
    return null;
}

function handleNYT(uri){
  // Homepage
  if(uri == SITES.NYTIMES){
    return document.getElementsByTagName('article');
  }
  if(uri.startsWith(SITES.NYTIMES + "section")){
    return document.getElementsByTagName('article');
  }
  if(uri.startsWith(SITES.NYTIMES + "interactive")){
    return document.getElementsByClassName('g-body');
  }
  return document.getElementsByClassName('story-body-text story-content');
}

function handleWired(uri){
  console.log('WIRED');
  // Main Page
  if(uri == SITES.WIRED){
    return document.getElementsByTagName('section');
  }
  if(uri.startsWith(SITES.WIRED)){
    return document.getElementsByTagName('article');
  }
  if(uri.startsWith(SITES.WIRED + "category/")){
    return document.getElementsById('grid');
  }
  return null;
}

function handleWsj(uri){
  if(uri == SITES.WSJ){
    return document.getElementsByClassName('cb-col');
  }
  if(uri.startsWith(SITES.WSJ + "articles/")){
    let elements = [].slice.call(document.getElementsByClassName('article-wrap'));
    console.log(elements);
    let moreEl = [].slice.call(document.getElementsByClassName('wsj-article-headline'));
    elements.push(moreEl);
    return elements;
  }
  // TODO News section
    return elements;
  return null;
}

function handleQz(uri){
  if(uri == SITES.QZ){
    return document.getElementsByTagName('article');
  }
  return document.getElementsByTagName('article');
}

function getElements(){
  let elements = null;
  let baseUri = document.baseURI;

  // DONT use
  if(baseUri.startsWith(SITES.MEDIUM)){
    return null;
  }

  // Aeon
  if(baseUri.startsWith(SITES.AEON)){
    console.log("AEON");
    return handleAeon(baseUri);
  }

  // NYT Mobile
  if(baseUri.startsWith(SITES.NYTIMES)){
    console.log("NYTIMES");
    return handleNYT(baseUri);
  }

  // WIRED
  if(baseUri.startsWith(SITES.WIRED)){
    console.log("WIRED");
    return handleWired(baseUri);
  }

  // WSJ
  if(baseUri.startsWith(SITES.WSJ)){
    console.log("WSJ");
    return handleWsj(baseUri);
  }

  // QZ
  if(baseUri.startsWith(SITES.QZ)){
    console.log("QZ");
    return handleQz(baseUri);
  }
  // WORST CASE PLEASE GOD WORK
  elements = document.getElementsByTagName('article');
  return elements;
}

function changeLang(lang, immersion){
  let elements = getElements();
  let langDict = null;
  let langKey = null;
  let engTrue = false;
  // Select language
  switch (lang){
    case "Portuguese":
      langDict = porteng;
      langKey = "portuguese";
      break;
    case "French":
      langDict = frencheng;
      langKey = "french";
      break;
    case "Spanish":
      langDict = spanisheng;
      langKey = "spanish";
      break;
    case "German":
      langDict = germaneng;
      langKey = "german";
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
      ss[i].insertRule(' \
        acronym { \
          background-color: #F0F8FF; \
          font-size: 108%; \
        } \
      ', 0);
      ss[i].insertRule('\
        acronym:hover{\
          color: #ff2283;\
          position: relative;\
        }      \
        ', 0);
      ss[i].insertRule('\
        acronym[title]:hover:after { \
          content: attr(title);\
          padding: 5px 5px;\
          color: black;\
          position: absolute;\
          left: 0;\
          top: 100%;\
          white-space: nowrap;\
          z-index: 20;\
          -moz-border-radius: 3px;\
          -webkit-border-radius: 3px;\
          border-radius: 3px;\
          -moz-box-shadow: 0px 0px 2px #c0c1c2;\
          -webkit-box-shadow: 0px 0px 2px #c0c1c2;\
          box-shadow: 0px 0px 2px #c0c1c2;\
          background-image: -moz-linear-gradient(top, #ffffff, #eeeeee);\
          background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #ffffff),color-stop(1, #eeeeee));\
          background-image: -webkit-linear-gradient(top, #ffffff, #eeeeee);\
          background-image: -moz-linear-gradient(top, #ffffff, #eeeeee);\
          background-image: -ms-linear-gradient(top, #ffffff, #eeeeee);\
          background-image: -o-linear-gradient(top, #ffffff, #eeeeee);\
        } \
      ', 0);
    }

    console.log(spanisheng);

    for(var i = 0; i < elements.length; i++){
      for(var j = 0; j < randWords.length; j++){
        let eng = new RegExp("\\b" + randWords[j]["english"] + "\\b");
        let newWord = randWords[j][langKey];
        var new_row = document.createElement('acronym');
        new_row.title = randWords[j]["english"];
        findAndReplaceDOMText(elements[i], {
          find: eng,
          replace: newWord,
          wrap: new_row
        });
      }
    }
  }
}

function switchPower(language, immersion, power){
  if(power == false){
    changeLang("English", -1);
  }
  if(power == true){
    changeLang(language, immersion);
  }
}

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(this.props.power == false){
      return;
    }
    let el = getElements();
    for(var i = 0; i < el.length; i++){
      originalEl[i] = el[i].innerHTML;
    }
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if(request.language && request.immersion){
          chrome.storage.local.set({"language": request.language}, function(){});
          chrome.storage.sync.set({"language": request.language}, function(){});

          chrome.storage.local.set({"language": request.language}, function(){});
          chrome.storage.sync.set({"language": request.language}, function(){});

          changeLang(request.language, request.immersion);
        }
      }
    );
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if((request.power != null) && request.language && request.immersion){
          chrome.storage.local.set({"language": request.language}, function(){});
          chrome.storage.sync.set({"language": request.language}, function(){});

          chrome.storage.local.set({"immersion": request.immersion}, function(){});
          chrome.storage.sync.set({"immersion": request.immersion}, function(){});

          chrome.storage.local.set({"power": request.power}, function(){});
          chrome.storage.sync.set({"power": request.power}, function(){});

          switchPower(request.language, request.immersion, request.power);
        }
      }
    );
    let startupLang = this.props.language;
    let startupPower = this.props.power;
    let startupImmersion = this.props.immersion;
    let set = false;
    if(startupLang && startupPower && startupImmersion){
      set = true;
      switchPower(startupLang, startupPower, startupImmersion);
    }

    // check if lang, immersion, power already set
    if(! set){
      chrome.storage.local.get(["language", "power", "immersion"], function(items){
        startupLang = items["language"];
        startupPower = items["power"];
        startupImmersion = items["immersion"];
        if(startupLang && startupPower && startupImmersion){
          set = true;
        }
        if(! set){
          chrome.storage.sync.get(["language", "power", "immersion"], function(items){
            startupLang = items["language"];
            startupPower = items["power"];
            startupImmersion = items["immersion"];

            if(startupLang && startupPower && startupImmersion){
              switchPower(startupLang, startupImmersion, startupPower);
            } else {
              switchPower("English", -1, false);
            }
          });
        } else {
            switchPower(startupLang, startupImmersion, startupPower);
        }
      })
    }
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
