import React from 'react';

class ToolbarDropdown extends React.Component {
  state = {
    open: false
  };

  onMouseEnter = (e) => {
    if (this.props.active) {
      this.setState({open: true})
    }
  };

  onMouseLeave = (e) => {
    if (this.props.active) {
      this.setState({open: false})
    }
  };

  subMenuClick = (e) => {
    this.setState({open: false})
  };

  render() {
    let className = 'toolbar-item', submenu = '';
    if (this.props.active) {
      className += ' active'
    }
    if (this.state.open) {
      className += ' open'
      submenu = this.props.submenu
    }
    return (
      <div className="toolbar-dropdown" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div className={className}>
          {this.props.text} 
          <i className="fa fa-angle-down"></i>
        </div>
        <div className="submenu" onClick={this.subMenuClick}>{submenu}</div>
      </div>
    )
  }
}

export default ToolbarDropdown;