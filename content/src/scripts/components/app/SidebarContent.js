import React from 'react';
import MaterialTitlePanel from './MaterialTitlePanel';

const styles = {
  sidebar: {
    width: 500,
    height: '100%',
  },
  sidebarLink: {
    display: 'block',
    padding: '16px 0px',
    color: '#757575',
    textDecoration: 'none',
  },
  divider: {
    margin: '8px 0',
    height: 1,
    backgroundColor: '#757575',
  },
  content: {
    padding: '16px',
    height: '100%',
    backgroundColor: 'white',
  },
};

const SidebarContent = (props) => {
  const style = styles.sidebar;

  const links = [];

  links.push(<a key="0" href="#" style={styles.sidebarLink}>Settings</a>)

  return (
    <MaterialTitlePanel title="alpharabi.us" style={style}>
      <div style={styles.content}>
        <a href="index.html" style={styles.sidebarLink}>Home</a>
        <a href="responsive_example.html" style={styles.sidebarLink}>Responsive Example</a>
        <div style={styles.divider} />
        {links}
      </div>
    </MaterialTitlePanel>
  );
};

SidebarContent.propTypes = {
  style: React.PropTypes.object,
};

export default SidebarContent;
