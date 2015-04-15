var React = require('react')
  , palette = require('../utils/palette')

var MessageBar = React.createClass({
  render: function() {
    return (
      <div className="message-bar">
        <div className="message-bar-item message">{this.props.message}</div>
        <div className="message-bar-item error">{this.props.error}</div>
        <div className="message-bar-item coordinates"></div>
      </div>
    )
  }
})

module.exports = MessageBar