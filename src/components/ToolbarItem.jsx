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
    var img = this.props.img ? <img src={this.props.img} /> : false
    return (
      <div className={className} style={style} onClick={this.onClick}>
        <span className="descriptor-icon"></span>
        <span className="label">{img} {this.props.text}</span>
        <span className='icon'>{this.props.icon}</span>
      </div>
    )
  }
})

module.exports = ToolbarItem