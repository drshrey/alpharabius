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
import firebase from 'firebase';
import Chance from 'chance';

var config = {
  apiKey: "AIzaSyD46Cqzsv2UTog0cmVyrom0jAyh9FGIiMA",
  authDomain: "alpharabius2-70521.firebaseapp.com",
  databaseURL: "https://alpharabius2-70521.firebaseio.com",
  storageBucket: "alpharabius2-70521.appspot.com",
  messagingSenderId: "530210488055"
};
firebase.initializeApp(config);
var savedFb = false;
var CURRENT_LANGUAGE = ''

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

  // WORST CASE PLEASE GOD WORK
  elements = document.getElementsByTagName('article');
  return elements;
}

function changeLang(lang){
  CURRENT_LANGUAGE = lang
  console.log(CURRENT_LANGUAGE)
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
    for(var i = 0;i < (langDict.length * 0.2); i++){
      let randIndex = Math.floor(Math.random() * langDict.length);
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
      for(var j = 0; j < randWords.length * .2; j++){
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

function switchPower(language, power){
  console.log("HELLO")
  console.log(language)
  console.log(power)
  if(power == false){
    return changeLang("English", -1);
  }
  if(power == true){
    return changeLang(language);
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
      correct: '',
      hintText: '',
      quizMeText: 'Quiz Me',
      quizButtonPressed: false,
      finished: false,
      url: 'alpharabi.us'
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleHint = this.handleHint.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
  }

  // TODO
  handleHint(){
    return;
  }

  handleCheck(e, v){
    console.log(v);
    this.setState({ checkedOption: v });
  }

  handleSubmit2(items){
      let myUserId = items['user'];
      var checkedOption = this.state.checkedOption;
      var selectedWord = this.state.selectedWord;
      var correctOption = this.state.correctOption;
      var options = this.state.options;
      var correct = "";
      var language = this.state.language;      

      if(checkedOption == correctOption){
        if(!savedFb){
          var postData = {
            uid: myUserId,
            selectedWord: selectedWord,
            correctOption: correctOption,
            options: options,
            numRight: 1,
            numWrong: 0,
            created: Date(),
          }
          var updates = {};
          var newPostKey = firebase.database().ref().child('questions').push().key;
          updates['/questions/' + CURRENT_LANGUAGE + '/' + newPostKey] = postData;
          updates['/user-questions/' + myUserId + '/' + CURRENT_LANGUAGE + '/' +newPostKey] = postData;
          firebase.database().ref().update(updates);        
          savedFb = true;
        }
        correct = "Good Job! That's the the correct answer."
      } else {
        if(!savedFb){
          var postData = {
            uid: myUserId,
            selectedWord: selectedWord,
            correctOption: correctOption,
            options: options,
            numRight: 0,
            numWrong: 1,
            created: Date(),
          }
          var updates = {};
          var newPostKey = firebase.database().ref().child('questions').push().key;
          updates['/questions/' + language + '/' + newPostKey] = postData;
          updates['/user-questions/' + myUserId + '/' + language + '/' + newPostKey] = postData;
          firebase.database().ref().update(updates);        
          savedFb = true;
        }
        correct = "That's incorrect"
      }
      this.setState({correct: correct, finished: true});                 
    }

  handleSubmit() {
    chrome.storage.local.get(["user"], this.handleSubmit2)
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
    savedFb = false
    if(document.baseURI == "http://" + this.state.url + "/dashboard"){
      alert("This user is now integrated with the chrome extension. Sign in to a different user to switch.")
      let uid = document.getElementById("firebase-id").value;
      chrome.storage.local.set({"user": uid}, function(){});
      chrome.storage.sync.set({"user": uid}, function(){});      
    }                                   
    chrome.storage.local.get(["user"], function(items){
      let currentUser = items['user'];
      if(!currentUser){
        firebase.auth().signInAnonymously().catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log("ERRORS");
          console.log(errorCode);
          console.log(errorMessage);
        });
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            var uid = user.uid;
            firebase.database().ref('users/' + uid).set({
              signedUp: Date()
            });
            chrome.storage.local.set({"user": uid}, function(){});
            chrome.storage.sync.set({"user": uid}, function(){});
            if(document.baseURI == "http://alpharabi.us/signup"){
              document.getElementById("firebase-id").value = uid;
            }                             
          }          
        });
      } else {
        if(document.baseURI == "http://alpharabi.us/signup"){
          document.getElementById("firebase-id").value = currentUser;
        } 
      }     
    });
    let selectedWord = '';
    if(this.props.power == false){
      return;
    }
    let el = getElements();
    for(var i = 0; i < el.length; i++){
      originalEl[i] = el[i].innerHTML;
    }

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if(request.language){
          chrome.storage.local.set({"language": request.language}, function(){});
          chrome.storage.sync.set({"language": request.language}, function(){});

          chrome.storage.local.set({"language": request.language}, function(){});
          chrome.storage.sync.set({"language": request.language}, function(){});

          changeLang(request.language)
        }
      }
    );
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if((request.power != null) && request.language){
          chrome.storage.local.set({"language": request.language}, function(){});
          chrome.storage.sync.set({"language": request.language}, function(){});


          chrome.storage.local.set({"power": request.power}, function(){});
          chrome.storage.sync.set({"power": request.power}, function(){});

          switchPower(request.language, request.power)
        }
      }
    );
    let startupLang = this.props.language;
    let startupPower = this.props.power;
    let set = false;
    if(startupLang && startupPower){
      set = true;
      return;
    }
    // check if lang, immersion, power already set
    if(! set){
      chrome.storage.local.get(["language", "power"], function(items){
        startupLang = items["language"];
        startupPower = items["power"];
        if(startupLang && (startupPower != null || startupPower != undefined)){
          set = true;
        }
        if(! set){
          chrome.storage.sync.get(["language", "power"], function(items){
            startupLang = items["language"];
            startupPower = items["power"];

            if(startupLang && (startupPower != null || startupPower != undefined)){
              switchPower(startupLang, startupPower);
              return
            } else {
              switchPower("French", true);
              return
            }
          });
        } else {
            switchPower(startupLang, startupPower);
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

      if(!this.state.finished){
        ActionButtons = (<CardActions>
                          <RaisedButton onClick={this.handleSubmit} label="Submit" />
                        </CardActions>);
      } else {
        ActionButtons = '';
      }
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
