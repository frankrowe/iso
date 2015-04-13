var React = require('react')

var Tooltip = React.createClass({
  render: function() {
    return (
      <div className="tooltip">
        <div className="tooltip-inner">
          {this.props.text}
        </div>
      </div>
    )
  }
})

module.exports = Tooltip