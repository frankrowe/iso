var React = require('react')
  , Modals = require('./Modals.jsx')
  , ToolbarItem = require('./ToolbarItem.jsx')
  , ToolbarSubmenu = require('./ToolbarSubmenu.jsx')
  , ToolbarDropdown = require('./ToolbarDropdown.jsx')
  , LayerActions = require('../actions/LayerActions')
  , LayerStore = require('../stores/LayerStore')
  , baseMaps = require('../utils/BaseMaps')

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
  disabledClick: function() {
    this.props.updateError('A layer must be selected.')
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
      <ToolbarItem text={'Drawing Toolbar'} onClick={this.onClick} icon={icon} active={active}/>
    )
  }
})

var Basemap = React.createClass({
  render: function() {
    var active = true
    var submenu = []
    for (var name in baseMaps) {
      var icon = false
      if (this.props.baseMap === name) {
        var icon = <i className="fa fa-check"></i>
      }
      var update = function(name) {
        this.props.updateBaseMap(name)
      }.bind(this, name)
      submenu.push(<ToolbarItem {...this.props} key={name} text={baseMaps[name].name} onClick={update} icon={icon} active={true}/>)
    }
    return (
      <ToolbarSubmenu text={'Basemap'} submenu={submenu} active={active}/>
    )
  }
})

var ViewMenu = React.createClass({
  render: function() {
    var active = true
    var submenu = [
      <Basemap {...this.props} key={'Basemap'}/>,
      <Edit {...this.props} key={'editFeature'}/>,
      <ViewGeoJSON {...this.props} key={'viewGeoJSON'}/>,
      <ViewAttributes {...this.props} key={'viewAttributes'}/>
      ]
    return (
      <ToolbarDropdown text={'View'} submenu={submenu} active={active}/>
    )
  }
})

module.exports = ViewMenu