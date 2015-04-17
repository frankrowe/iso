var React = require('react')

var ToolbarDropdown = React.createClass({
  getInitialState: function() {
    return {
      open: false
    }
  },
  onMouseEnter: function(e) {
    if (this.props.active) {
      this.setState({open: true})
    }
  },
  onMouseLeave: function(e) {
    if (this.props.active) {
      this.setState({open: false})
    }
  },
  subMenuClick: function(e) {
    this.setState({open: false})
  },
  render: function() {
    var className = 'toolbar-item',
      submenu = ''
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
})

module.exports = ToolbarDropdown