import React, {Component} from 'react';
import {connect} from 'react-redux';
var logo = require("../../../Logo.png");
var icon = require("../../../128.png");


const mapStateToProps = (state) => {
  return {
    language: state.language,
    immersion: state.immersion,
    power: state.power,
  };
};

class App extends Component {
  constructor(props) {
    super(props);

    this.handlePowerChange = this.handlePowerChange.bind(this);
    this.handleButtonChange = this.handleButtonChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      language: this.props.language,
      immersion: this.props.immersion,
      power: this.props.power,
    }
  }

  componentDidMount(){
    console.log(this.props);
  }

  handlePowerChange(event){
    console.log("IN POWER");
    console.log(event.target.checked);
    this.props.dispatch({
      type: 'TOGGLE_POWER',
      power: event.target.checked
    });
    this.setState({ power: event.target.checked });
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      chrome.tabs.sendMessage(tabs[0].id, {"power": event.target.checked});
    });
  }

  handleButtonChange(){
    var x = this.props.language;
    var immersion = this.props.immersion;
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      chrome.tabs.sendMessage(tabs[0].id, {"language": x, "immersion": immersion});
    });
  }

  handleChange(e){
    this.props.dispatch({
      type: 'SET_LANGUAGE',
      language: e.target.value
    });
    var language = e.target.value;
    var immersion = this.props.immersion;
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      chrome.tabs.sendMessage(tabs[0].id, {"language": language, "immersion": immersion});
    });
  }

  handleSliderChange(e){
    this.props.dispatch({
      type: 'SET_IMMERSION',
      immersion: e.target.value
    });
    this.setState({immersion: e.target.value});
    var language = this.props.language;
    var immersion = e.target.value;
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      chrome.tabs.sendMessage(tabs[0].id, {"language": language, "immersion": immersion});
    });
  }

  render() {
    return (
      <div>
        <img height="70%" width="70%" src={logo}></img>
        <span>
          <button onClick={this.handleButtonChange}> translate </button>
          <label style={{ position:"absolute", right:"20px", top:"15px" }} className="switch">
            <input id="test1" defaultChecked={this.state.checked} onChange={this.handlePowerChange} type="checkbox" />
            <div className="slider round"></div>
          </label>
        </span>

        <br/><br/>
        { this.props.language } <br/><br/>
        <span>immersion</span>:
        { this.props.immersion }
        <div className="immersion">
            <input id="test" value={this.props.immersion} onChange={this.handleSliderChange} min="1" max="10" type="range"/>
        </div>
        <div className="language">
            <span>language</span>

              <span className="language-input">
                    <select className="language-input-in">
                            <option value="english">english</option>
                    </select>
              </span>

            <span>to</span>

            <span className="language-input">
                    <select value={this.props.language} onChange={this.handleChange} className="language-input-out">
                            <option value="French">french</option>
                            <option value="Spanish">spanish</option>
                            <option value="German">german</option>
                            <option value="Portuguese">portuguese</option>
                    </select>
              </span>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
