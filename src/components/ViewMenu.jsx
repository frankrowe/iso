var React = require('react')
  , Modals = require('./Modals.jsx')
  , ToolbarItem = require('./ToolbarItem.jsx')
  , ToolbarDropdown = require('./ToolbarDropdown.jsx')
  , LayerActions = require('../actions/LayerActions')
  , LayerStore = require('../stores/LayerStore')

var ViewAttributes = React.createClass({
  onClick: function() {
    var layer = LayerStore.getSelected()
    if (layer) {
      var update = {
        viewAttributes: !layer.viewAttributes
      }
      LayerActions.update(layer.id, update)
    }
  },
  render: function() {
    var active = this.props.config.oneLayer
    var icon = false
    if (this.props.config.oneLayer && this.props.config.oneLayer.viewAttributes) {
      icon = <i className="fa fa-check"></i>
    }
    return (
      <ToolbarItem text={'Attribute Table'} icon={icon} onClick={this.onClick} active={active}/>
    )
  }
})

var ViewGeoJSON = React.createClass({
  onClick: function() {
    var layer = LayerStore.getSelected()
    if (layer) {
      var update = {
        editGeoJSON: !layer.editGeoJSON
      }
      LayerActions.update(layer.id, update)
    }
  },
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    var icon = false
    if (this.props.config.oneLayer && this.props.config.oneLayer.editGeoJSON) {
      icon = <i className="fa fa-check"></i>
    }
    return (
      <ToolbarItem text={'GeoJSON Editor'} icon={icon} onClick={this.onClick} active={active}/>
    )
  }
})

var Edit = React.createClass({
  onClick: function() {
    var layer = LayerStore.getSelected()
    if (layer) {
      LayerActions.update(layer.id, {editing: !layer.editing})
    }
  },
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    var icon = false
    if (this.props.config.oneLayer && this.props.config.oneLayer.editing) {
      var icon = <i className="fa fa-check"></i>
    }
    return (
      <ToolbarItem text={'Editing Toolbar'} onClick={this.onClick} icon={icon} active={active}/>
    )
  }
})

var ViewMenu = React.createClass({
  render: function() {
    //var active = this.props.config.oneLayer  || this.props.config.multiLayer
    var active = true
    var submenu = [
      <ViewAttributes {...this.props} key={'viewAttributes'}/>,
      <ViewGeoJSON {...this.props} key={'viewGeoJSON'}/>,
      <Edit {...this.props} key={'editFeature'}/>
      ]
    return (
      <ToolbarDropdown text={'View'} submenu={submenu} active={active}/>
    )
  }
})

module.exports = ViewMenu