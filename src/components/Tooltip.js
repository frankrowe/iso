import React from 'react';

class Tooltip extends React.Component {
  render() {
    return (
      <div className="tooltip">
        <div className="tooltip-inner">{this.props.text}</div>
      </div>
    );
  }
}

export default Tooltip;
