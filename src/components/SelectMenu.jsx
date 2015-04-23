var React = require('react')
  , Modals = require('./Modals.jsx')
  , ToolbarItem = require('./ToolbarItem.jsx')
  , ToolbarDropdown = require('./ToolbarDropdown.jsx')
  , LayerStore = require('../stores/LayerStore')
  , vectorTools = require('../utils/vectorTools')

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

var SelectPoints = React.createClass({
  onClick: function() {
    vectorTools.selectPoints(LayerStore.getAllSelected())
  },
  render: function() {
    var active = (this.props.config.oneLayer || this.props.config.multiLayer)  && this.props.config.vector
    return (
      <ToolbarItem text={'Select Points'} onClick={this.onClick} active={active}/>
    )
  }
})

var SelectLines = React.createClass({
  onClick: function() {
    vectorTools.selectLines(LayerStore.getAllSelected())
  },
  render: function() {
    var active = (this.props.config.oneLayer || this.props.config.multiLayer)  && this.props.config.vector
    return (
      <ToolbarItem text={'Select Lines'} onClick={this.onClick} active={active}/>
    )
  }
})

var SelectPolygons = React.createClass({
  onClick: function() {
    vectorTools.selectPolygons(LayerStore.getAllSelected())
  },
  render: function() {
    var active = (this.props.config.oneLayer || this.props.config.multiLayer)  && this.props.config.vector
    return (
      <ToolbarItem text={'Select Polygons'} onClick={this.onClick} active={active}/>
    )
  }
})

var SelectBox = React.createClass({
  onClick: function() {
    vectorTools.selectBoxToggle(LayerStore.getAllSelected())
  },
  render: function() {
    var active = (this.props.config.oneLayer || this.props.config.multiLayer)  && this.props.config.vector
    var icon = false
    for (var id in this.props.layers) {
      if (this.props.layers[id].selectBox) {
        icon = <i className="fa fa-check"></i>
      }
    }
    return (
      <ToolbarItem text={'Select Box'} icon={icon} onClick={this.onClick} active={active}/>
    )
  }
})

var SelectMenu = React.createClass({
  render: function() {
    var active = true
    var submenu = [
      <SelectAll key={'select'} {...this.props}/>,
      <DeselectAll key={'deselect'} {...this.props}/>,
      <SelectBox key={'selectBox'} {...this.props}/>,
      <SelectPoints key={'SelectPoints'} {...this.props}/>,
      <SelectLines key={'SelectLines'} {...this.props}/>,
      <SelectPolygons key={'SelectPolygons'} {...this.props}/>
    ]
    return (
      <ToolbarDropdown text={'Select'} submenu={submenu} active={active}/>
    )
  }
})

module.exports = SelectMenu