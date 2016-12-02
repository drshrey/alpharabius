import React, {Component} from 'react';
import {connect} from 'react-redux';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {green100, green500, green700} from 'material-ui/styles/colors';

import findAndReplaceDOMText from 'findandreplacedomtext';
import spanisheng from '../../../../../data/spanish.json';
import porteng from '../../../../../data/portuguese.json';
import frencheng from '../../../../../data/french.json';
import germaneng from '../../../../../data/german.json';

var Mark = require('mark.js');
injectTapEventPlugin();

const style = {
  height: 250,
  maxHeight: 400,
  padding: '15px',
  width: 500,
  margin: 25,
  fontFamily: 'Avenir Next',
  backgroundColor: 'yellow',
  textAlign: 'center',
  display: 'inline-block',
};


const muiTheme = getMuiTheme({
  palette: {
    accent1Color: green500,
  },
});

let selectedWord = null;
let originalEl = {};
const SITES = {
  AEON: 'https://aeon.co/',
  NYTIMES: 'http://www.nytimes.com/',
  WIRED: 'https://www.wired.com/',
  WSJ: 'http://www.wsj.com/',
  QZ: 'http://qz.com/',
  MEDIUM: 'https://medium.com/',
  REDDIT: 'https://www.reddit.com/'
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

function handleReddit(uri){
  // Main Page
  return document.querySelectorAll('*[id^="thing"]');
}

function handleWired(uri){
  // console.log('WIRED');
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
    let moreEl = [].slice.call(document.getElementsByClassName('wsj-article-headline'));
    elements.push(moreEl);
    return elements;
  }
  // TODO News section
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
  // if(baseUri.startsWith(SITES.MEDIUM)){
  //   return null;
  // }

  if(baseUri.startsWith(SITES.REDDIT)){
    return handleReddit(baseUri);
  }

  // Aeon
  if(baseUri.startsWith(SITES.AEON)){
    // console.log("AEON");
    return handleAeon(baseUri);
  }

  // NYT Mobile
  if(baseUri.startsWith(SITES.NYTIMES)){
    // console.log("NYTIMES");
    return handleNYT(baseUri);
  }

  // WIRED
  if(baseUri.startsWith(SITES.WIRED)){
    // console.log("WIRED");
    return handleWired(baseUri);
  }

  // WSJ
  if(baseUri.startsWith(SITES.WSJ)){
    // console.log("WSJ");
    return handleWsj(baseUri);
  }

  // QZ
  if(baseUri.startsWith(SITES.QZ)){
    // console.log("QZ");
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
      if(ss[i].cssRules != null || ss[i].cssRules != undefined){
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
    }
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
    return changeLang("English", -1);
  }
  if(power == true){
    return changeLang(language, immersion);
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: 'French',
      open: false,
      selectedWord: "",
      correctOption: "",
      checkedOption:'',
      options: ['', '', '', ''],
      hints: ['', '', '', ''],
      correct: '',
      hintText: '',
      quizMeText: 'Quiz Me',
      quizButtonPressed: false,
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleHint = this.handleHint.bind(this);
  }

  // TODO
  handleHint(){
    return;
  }

  handleCheck(e, v){
    console.log(v);
    this.setState({ checkedOption: v });
  }

  handleSubmit() {
    if(this.state.checkedOption == this.state.correctOption){
      this.setState({ correct: "Good Job! That's the the correct answer."});
    } else {
      this.setState({ correct: "That's incorrect"});
    }
  }

  handleClick(){
    // dict to use with three choices
    let choices = ['activity', 'story', 'industry', 'language', 'management', 'movie', 'organization', 'physics', 'door', 'mouse', 'dog', 'phone', 'light', 'equipment'];    
    choices.sort( function() { return 0.5 - Math.random() });
    let threeChoices = [choices[0], choices[1], choices[2]];
    let visited = {};    
    let langDict = {};
    let langKey = null;
    let engTrue = false;  

    // get all elements
    let words = document.getElementsByTagName('acronym');
    let randomWord = words[Math.floor(Math.random() * words.length)];
    console.log(randomWord)
    threeChoices.push(randomWord.title);
    threeChoices.sort( function() { return 0.5 - Math.random() });
    this.setState({
      quizButtonPressed: true,
      correct: '',
      correctOption: randomWord.title, 
      selectedWord: randomWord.innerText,
      quizMeText: 'Give me another one!',
      options: [threeChoices[0], threeChoices[1], threeChoices[2], threeChoices[3]],
    });
  }

  componentDidMount() {
    let selectedWord = "";
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

          changeLang(request.language, request.immersion)
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

          switchPower(request.language, request.immersion, request.power)
        }
      }
    );
    let startupLang = this.props.language;
    let startupPower = this.props.power;
    let startupImmersion = this.props.immersion;
    let set = false;
    if(startupLang && startupPower && startupImmersion){
      set = true;
      return;
    }
    // check if lang, immersion, power already set
    if(! set){
      chrome.storage.local.get(["language", "power", "immersion"], function(items){
        startupLang = items["language"];
        startupPower = items["power"];
        startupImmersion = items["immersion"];
        if(startupLang && (startupPower != null || startupPower != undefined) && startupImmersion){
          set = true;
        }
        if(! set){
          chrome.storage.sync.get(["language", "power", "immersion"], function(items){
            startupLang = items["language"];
            startupPower = items["power"];
            startupImmersion = items["immersion"];

            if(startupLang && (startupPower != null || startupPower != undefined) && startupImmersion){
              switchPower(startupLang, startupImmersion, startupPower);
              return
            } else {
              switchPower("French", 3, true);
              return
            }
          });
        } else {
            switchPower(startupLang, startupImmersion, startupPower);
            return
        }
      })
    }
  }

  render() {
    let QuizQuestion = '';
    let QuizOptions = '';
    let ActionButtons = '';
    let QuizMeButton = '';

    if(this.state.quizButtonPressed == true){
      QuizOptions = ( <RadioButtonGroup name="status" onChange={this.handleCheck}>
            <RadioButton style={{ display: 'inline-block', width: '150px' }} label={this.state.options[0]} value={this.state.options[0]} />
            <RadioButton style={{ display: 'inline-block', width: '150px' }} label={this.state.options[1]} value={this.state.options[1]} />
            <RadioButton style={{ display: 'inline-block', width: '150px' }} label={this.state.options[2]} value={this.state.options[2]} />
            <RadioButton style={{ display: 'inline-block', width: '150px' }} label={this.state.options[3]} value={this.state.options[3]} />
        </RadioButtonGroup> );
      QuizQuestion = (<p>What does <b> {this.state.selectedWord} </b> mean ?</p>);

      ActionButtons = (<CardActions>
                        <RaisedButton onClick={this.handleSubmit} label="Submit" />
                      </CardActions>);
    }
    if(this.state.quizButtonPressed == false){
      QuizMeButton = (<p><br/><br/> <RaisedButton onClick={this.handleClick} label={this.state.quizMeText} primary={true} /> </p>);
    }
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Card style={style}>
            <h2> { this.state.correct} </h2>
            <CardText>
              {QuizQuestion}
            </CardText>
            <center>
            {QuizMeButton}
            {QuizOptions}
            </center>
            {ActionButtons}
          </Card>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps)(App);
