import React, {Component} from 'react';
import {connect} from 'react-redux';

const mapStateToProps = (state) => {
  return {
    language: state.language
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      language: this.props.language
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
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "Portuguese"});
    });
  }

  render() {
    return (
      <div>
        <h3> selected language: {this.props.language}</h3>
        <h2> Select language to translate into: </h2>
          <select value={this.props.language} onChange={this.handleChange}>
            <option value="Portuguese">Portuguese</option>
            <option value="German">German</option>
            <option value="French">French</option>
            <option value="English">English</option>
          </select>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
