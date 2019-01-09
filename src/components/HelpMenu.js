import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Modals from './Modals';
import ToolbarItem from './ToolbarItem';
import ToolbarDropdown from './ToolbarDropdown';

class About extends React.Component {
  onClick = () => {
    vex.dialog.alert(ReactDOMServer.renderToString(<Modals.About />));
  };

  render() {
    let active = true;
    return <ToolbarItem text={'About iso'} onClick={this.onClick} active={active} />;
  }
}

class HelpMenu extends React.Component {
  render() {
    let active = true;
    let submenu = [<About key={'about'} />];
    return <ToolbarDropdown text={'Help'} submenu={submenu} active={active} />;
  }
}

export default HelpMenu;
