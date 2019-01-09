import React from 'react';

class ToolbarSubmenu extends React.Component {
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
    let className = 'toolbar-item toolbar-submenu', submenu = '';
    if (this.props.active) {
      className += ' active'
    }
    if (this.state.open) {
      className += ' open'
      submenu = this.props.submenu
    }
    return (
      <div className={className} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <span className="label">{this.props.text}</span>
        <span className='icon'><i className="fa fa-angle-right"></i></span>
        <div className="submenu" onClick={this.subMenuClick}>{submenu}</div>
      </div>
    )
  }
}

export default ToolbarSubmenu;