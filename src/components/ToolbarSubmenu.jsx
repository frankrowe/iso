var React = require('react')

var ToolbarSubmenu = React.createClass({
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
    var className = 'toolbar-item toolbar-submenu',
      submenu = ''
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
})

module.exports = ToolbarSubmenu