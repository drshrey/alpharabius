import React, {Component} from 'react';
import {connect} from 'react-redux';
import findAndReplaceDOMText from 'findandreplacedomtext';
import porteng from '../../../../../data/porteng.json';
import frencheng from '../../../../../data/frencheng.json';

const mapStateToProps = (state) => {
  return {
    language: state.language
  };
};

function getElements(){
  let elements = null;
  let baseUri = document.baseURI;
  // Aeon
  if(baseUri.startsWith('https://aeon.co/essays/')){
    elements = document.getElementsByClassName('article__body__content');
  }
  // NYT Mobile
  if(baseUri.startsWith('http://www.mobile.nytimes.com/')){
    elements = document.getElementsByClassName('p-block');
  }
  // NYT
  if(baseUri.startsWith('http://www.nytimes.com/')){
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
  let langDict = porteng;
  let langKey = null;

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
    default:
      break;
  }

  if(elements && langDict && langKey){
    for(var i = 0; i < elements.length; i++){
      for(var j = 0; j < porteng.length; j++){
        let eng = new RegExp("\\b" + langDict[j]["english"] + "\\b");
        let newWord = langDict[j][langKey];
        findAndReplaceDOMText(elements[i], {
          find: eng,
          replace: newWord
        });
      }
    }
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
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        changeLang(request.message);
      }
    );
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
