import React, {Component} from 'react';
import {connect} from 'react-redux';
var Rcslider = require('rc-slider');

const mapStateToProps = (state) => {
  return {
    language: state.language,
    immersion: state.immersion,
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      language: this.props.language,
      immersion: this.props.immersion
    }
  }

  dispatchClickedAlias() {
    proxyStore.dispatch({ type: 'change-language' });
  }

  handleChange(e){
    this.props.dispatch({
      type: 'SET_LANGUAGE',
      language: e.target.value
    });
    var x = e.target.value;
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": x});
    });
  }

  handleSliderChange(e){
    console.log(e)
    this.props.dispatch({
      type: 'SET_IMMERSION',
      immersion: e.target.value
    });
    this.setState({immersion: e.target.value});
  }

  render() {
    return (
      <div>
        <h2> alpharabi.us </h2>
        <span>immersion</span>
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
                            <option value="french">french</option>
                            <option value="spanish">spanish</option>
                            <option value="german">german</option>
                            <option value="portuguese">portuguese</option>
                    </select>
              </span>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
