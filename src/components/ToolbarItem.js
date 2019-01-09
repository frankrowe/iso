import React from 'react';

class ToolbarItem extends React.Component {
  static defaultProps = {
    active: false
  };

  onClick = () => {
    if (this.props.active) {
      this.props.onClick()
    } else {
      if (this.props.disabledClick) {
        this.props.disabledClick()
      }
    }
  };

  render() {
    let style = {};
    let className = 'toolbar-item';
    if (this.props.active) className += ' active'
    let img = this.props.img ? <img src={this.props.img} /> : false;
    return (
      <div className={className} style={style} onClick={this.onClick}>
        <span className="descriptor-icon"></span>
        <span className="label">{img} {this.props.text}</span>
        <span className='icon'>{this.props.icon}</span>
      </div>
    )
  }
}

export default ToolbarItem;