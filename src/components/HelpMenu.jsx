var React = require('react')
  , Modals = require('./Modals.jsx')
  , ToolbarItem = require('./ToolbarItem.jsx')
  , ToolbarDropdown = require('./ToolbarDropdown.jsx')

var About = React.createClass({
  onClick: function() {
    vex.dialog.alert(React.renderToString(<Modals.About />))
  },
  render: function() {
    var active = true
    return (
      <ToolbarItem text={'About iso'} onClick={this.onClick} active={active}/>
    )
  }
})


var HelpMenu = React.createClass({
  render: function() {
    var active = true
    var submenu = [
      <About key={'about'}/>
    ]
    return (
      <ToolbarDropdown text={'Help'} submenu={submenu} active={active}/>
    )
  }
})

module.exports = HelpMenu
