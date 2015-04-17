var React = require('react')
  , Modals = require('./Modals.jsx')
  , ToolbarItem = require('./ToolbarItem.jsx')
  , ToolbarDropdown = require('./ToolbarDropdown.jsx')

var SelectAll = React.createClass({
  onClick: function() {
    vectorTools.selectAll(LayerStore.getAllSelected())
  },
  render: function() {
    var active = (this.props.config.oneLayer || this.props.config.multiLayer)  && this.props.config.vector
    return (
      <ToolbarItem text={'Select All'} onClick={this.onClick} active={active}/>
    )
  }
})

var DeselectAll = React.createClass({
  onClick: function() {
    vectorTools.deselectAll(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Deselect All'} onClick={this.onClick} active={active}/>
    )
  }
})

var SelectMenu = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer  || this.props.config.multiLayer
    var submenu = [
      <SelectAll key={'select'} {...this.props}/>,
      <DeselectAll key={'deselect'} {...this.props}/>
    ]
    return (
      <ToolbarDropdown text={'Select'} submenu={submenu} active={active}/>
    )
  }
})

module.exports = SelectMenu