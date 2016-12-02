import React from 'react';

const styles = {
  root: {
    fontFamily: 'Avenir Next',
    fontWeight: 300,
  },
  header: {
    backgroundColor: '#03a9f4',
    color: 'white',
    padding: '16px',
    fontSize: '1.5em',
  },
};

const MaterialTitlePanel = (props) => {
  const rootStyle = styles.root;

  return (
    <div style={rootStyle}>
      <div style={styles.header}>{props.title}</div>
      {props.children}
    </div>
  );
};

MaterialTitlePanel.propTypes = {
  style: React.PropTypes.object,
  title: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]),
  children: React.PropTypes.object,
};

export default MaterialTitlePanel;
