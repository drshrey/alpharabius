import React, {Component} from 'react';
import {connect} from 'react-redux';
import findAndReplaceDOMText from 'findandreplacedomtext';
import porteng from '../../../../../data/portuguese.json';
import frencheng from '../../../../../data/french.json';
var Mark = require('mark.js');

let originalEl = {};
const SITES = {
  AEON: 'https://aeon.co/',
  NYTIMES: 'http://www.nytimes.com/',
  WIRED: 'https://www.wired.com/',
  WSJ: 'http://www.wsj.com/',
  QZ: 'http://qz.com/'
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
    // let elements = [].slice.call(document.getElementsByClassName('post wide pad-b-50 post-2112715 type-post status-publish format-standard has-post-thumbnail hentry category-business category-magazine tag-magazine-24-11 tag-personal-frontiers promo_status-promo post-layout-fullbleed-gallery-post'));
    // let moreEl = [].slice.call(document.getElementsByClassName('content link-underline relative body-copy'));
    return document.getElementsByTagName('article');
    // elements.push(moreEl);
    // elements.push(articleEl);
    // return elements;
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
  console.log("HELLOOO");
  if(uri == SITES.QZ){
    return document.getElementsByTagName('article');
  }
  return document.getElementsByTagName('article');
}

function getElements(){
  let elements = null;
  let baseUri = document.baseURI;

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
  return elements;
}

function changeLang(lang, immersion){
  let elements = getElements();
  let langDict = null;
  let langKey = null;
  let engTrue = false;
  // Select language
  console.log(lang);
  console.log(elements);
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
        var new_row = document.createElement('acronym');
        new_row.innerText = newWord;
        new_row.title = eng;
        findAndReplaceDOMText(elements[i], {
          find: eng,
          replace: newWord,
          wrap: 'acronym'
        });
      }
    }
  }
}

function switchPower(language, immersion, power){
  console.log("HELLLOOOOO");
  console.log(power);
  console.log(language);
  console.log(immersion);
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
    this.setState({ language: "French", immersion: 5})
    let el = getElements();
    for(var i = 0; i < el.length; i++){
      originalEl[i] = el[i].innerHTML;
    }
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if(request.language && request.immersion){
          changeLang(request.language, request.immersion);
        }
      }
    );
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if((request.power != null) && request.language && request.immersion){
          switchPower(request.language, request.immersion, request.power);
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
