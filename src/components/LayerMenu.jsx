var React = require('react')
  , vectorTools = require('../utils/vectorTools')
  , Modals = require('./Modals.jsx')
  , ToolbarItem = require('./ToolbarItem.jsx')
  , ToolbarDropdown = require('./ToolbarDropdown.jsx')
  , LayerActions = require('../actions/LayerActions')
  , LayerStore = require('../stores/LayerStore')
  , fileSaver = require('filesaver.js')

var Undo = React.createClass({
  onClick: function() {
    LayerActions.undo()
  },
  render: function() {
    var active = true
    return (
      <ToolbarItem text={'Undo'} onClick={this.onClick} active={active}/>
    )
  }
})

var RenameLayer = React.createClass({
  onClick: function() {
    var layer = LayerStore.getSelected()
    if (layer) {
      Modals.getName(layer.name, function(err, name) {
        LayerActions.update(layer.id, {name: name})
      })
    }
  },
  render: function() {
    var active = this.props.config.oneLayer
    return (
      <ToolbarItem text={'Rename Layer'} onClick={this.onClick} active={active}/>
    )
  }
})

var SaveAs = React.createClass({
  onClick: function() {
    var layers = LayerStore.getAllSelected()
    for (var id in layers) {
      var layer = layers[id]
      if (layer.selected) {
        fileSaver(new Blob([JSON.stringify(layer.geojson)], {
            type: 'text/plain;charset=utf-8'
        }), layer.name + '.geojson')
      }
    }
  },
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    return (
      <ToolbarItem text={'Save'} onClick={this.onClick} active={active}/>
    )
  }
})

var ZoomToLayer = React.createClass({
  onClick: function() {
    vectorTools.zoomToLayer(LayerStore.getAll())
  },
  render: function() {
    var active = this.props.config.oneLayer || this.props.config.multiLayer
    return (
      <ToolbarItem text={'Zoom To Layer'} onClick={this.onClick} active={active}/>
    )
  }
})

var LayerMenu = React.createClass({
  render: function() {
    var active = this.props.config.oneLayer  || this.props.config.multiLayer
    var submenu = [
      <Undo {...this.props} key={'undo'}/>,
      <RenameLayer {...this.props} key={'renameLayer'}/>,
      <SaveAs {...this.props} key={'saveAs'}/>,
      <ZoomToLayer {...this.props} key={'zoomToLayer'}/>
      ]
    return (
      <ToolbarDropdown text={'Layer'} submenu={submenu} active={active}/>
    )
  }
})

module.exports = LayerMenu