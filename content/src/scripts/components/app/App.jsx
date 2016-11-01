import React, {Component} from 'react';
import {connect} from 'react-redux';
import findAndReplaceDOMText from 'findandreplacedomtext';
import porteng from '../../../../../data/portuguese.json';
import frencheng from '../../../../../data/french.json';

var currentLang = "";
var icount = 0;
var xcount = 0;
let originalDoc = "";
let od0 = "";
let originalEl = {};

const mapStateToProps = (state) => {
  return {
    language: state.language,
    immersion: state.immersion
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

function changeLang(lang){
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
    case "English":
      engTrue = true;
    default:
      break;
  }
  if(elements && (langDict && langKey) || (engTrue)){
    // for(var i =0; i < elements;i ++){
    //   originalEl[i] = elements
    // }
    elements[0].innerHTML = od0;
    elements[1].innerHTML = originalDoc;
    if(engTrue){
      return;
    }
    for(var i = 0; i < elements.length; i++){
      for(var j = 0; j < immersion *  200; j++){
        let eng = new RegExp("\\b" + langDict[j]["english"] + "\\b");
        let newWord = langDict[j][langKey];
        findAndReplaceDOMText(elements[i], {
          find: eng,
          replace: newWord
        });
        icount += 1;
      }
    }
    currentLang = lang;
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    // this.changeLang = this.changeLang.bind(this);
    this.state = {
      'parsable': 'not parsable'
    }
  }
  componentDidMount() {
    let el = getElements();
    for(var i = 0; i < el.length; i++){
      originalEl[i] = el[i].innerHTML;
    }
    od0 = el[0].innerHTML;
    originalDoc = el[1].innerHTML;
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        changeLang(request.message);
      }
    );
    currentLang = this.props.language;
    changeLang(this.props.language);
    this.setState({'parsable': "parsed"});
  }

  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center'}}>Page {this.state.parsable} from English to {this.props.language} </h1>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
