var React = require('react')

var ToolbarItem = React.createClass({
  getDefaultProps: function() {
    return {
      active: false
    }
  },
  onClick: function() {
    if (this.props.active) {
      this.props.onClick()
    }
  },
  render: function() {
    var style = {}
    var className = 'toolbar-item'
    if (this.props.active) className += ' active'
    return (
      <div className={className} style={style} onClick={this.onClick}>
        <span className="label">{this.props.text}</span>
        <span className='icon'>{this.props.icon}</span>
      </div>
    )
  }
})

module.exports = ToolbarItem