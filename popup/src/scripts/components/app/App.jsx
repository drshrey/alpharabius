import React, {Component} from 'react';
import {connect} from 'react-redux';
var logo = require("../../../Logo.png");
var icon = require("../../../128.png");
var background = require("../../../bgd.png");


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

    this.handleButtonChange = this.handleButtonChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handlePowerChange = this.handlePowerChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      language: this.props.language,
      immersion: this.props.immersion,
      power: this.props.power,
    }
  }

  componentDidMount(){
  }

  handleButtonChange(){
    var x = this.props.language;
    var immersion = this.props.immersion;
    chrome.windows.getAll({populate:true},function(windows){
      windows.forEach(function(window){
        window.tabs.forEach(function(tab){
          chrome.tabs.sendMessage(tab.id, {"language": x, "immersion": immersion});
        });
      });
    });
  }

  handleChange(e){
    this.props.dispatch({
      type: 'SET_LANGUAGE',
      language: e.target.value
    });
    var language = e.target.value;
    var immersion = this.props.immersion;
    chrome.windows.getAll({populate:true},function(windows){
      windows.forEach(function(window){
        window.tabs.forEach(function(tab){
          chrome.tabs.sendMessage(tab.id, {"language": language, "immersion": immersion});
        });
      });
    });
  }

  handlePowerChange(e){
    var power = !this.props.power;
    var language = this.props.language;
    var immersion = this.props.immersion;
    this.props.dispatch({
      type: 'TOGGLE_POWER',
      power: !this.props.power
    });
    this.setState({ power: !this.props.power });
    chrome.windows.getAll({populate:true},function(windows){
      windows.forEach(function(window){
        window.tabs.forEach(function(tab){
          chrome.tabs.sendMessage(tab.id, {"language": language, "immersion": immersion, "power": power});
        });
      });
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
    chrome.windows.getAll({populate:true},function(windows){
      windows.forEach(function(window){
        window.tabs.forEach(function(tab){
          chrome.tabs.sendMessage(tab.id, {"language": language, "immersion": immersion});
        });
      });
    });
  }

  render() {
    return (
      <div className="popup">
        <span>
          <div id="off"> <i> off </i></div>
          <div id="on"> <i> on </i></div>
          <label style={{ position:"absolute", right:"20px", top:"15px" }} className="switch">
            <input
              checked={this.props.power}
              onChange={this.handlePowerChange}
              type="checkbox"
              />
            <div className="slider round"></div>
          </label>
        </span>

        <br/><br/>
          <div className="language">
              <span> language </span>
                <span className="language-input">
                      <select className="language-input-in">
                              <option value="english">english</option>
                      </select>
                </span>

              <span>to</span>

              <span className="language-input">
                      <select disabled={! this.props.power} value={this.props.language} onChange={this.handleChange} className="language-input-out">
                              <option value="French">french</option>
                              <option value="Spanish">spanish</option>
                              <option value="German">german</option>
                              <option value="Portuguese">portuguese</option>
                      </select>
                </span>
          </div>
        <div className="immersion">
            immersion <input id="test" disabled={! this.props.power} value={this.props.immersion} onChange={this.handleSliderChange} min="1" max="10" type="range"/>
        </div>
        <div className="footer">
          alpharabi.us
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
