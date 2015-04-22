var React = require('react')
  , vectorTools = require('../utils/vectorTools')
  , Modals = require('./Modals.jsx')
  , ToolbarItem = require('./ToolbarItem.jsx')
  , ToolbarSubmenu = require('./ToolbarSubmenu.jsx')
  , ToolbarDropdown = require('./ToolbarDropdown.jsx')
  , LayerActions = require('../actions/LayerActions')
  , LayerStore = require('../stores/LayerStore')
  , fileSaver = require('filesaver.js')

var Undo = React.createClass({
  onClick: function() {
    LayerActions.undo()
  },
  render: function() {
    var active = LayerStore.getUndoLength() > 0
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

var Style = React.createClass({
  onClick: function() {
    var layer = LayerStore.getSelected()
    if (layer) {
      Modals.getStyle(layer.style, function(err, style) {
        var newStyle = vectorTools.updateStyle(layer, style)
        LayerActions.update(layer.id, {style: newStyle})
      })
    }
  },
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    return (
      <ToolbarItem text={'Style'} onClick={this.onClick} active={active}/>
    )
  }
})

var SaveAs = React.createClass({
  render: function() {
    var active = true
        var submenu = [
          <SaveAsGeoJSON {...this.props} key={'saveAsGeoJSON'}/>,
          <SaveAsShp {...this.props} key={'saveAsShp'}/>
        ]
    return (
      <ToolbarSubmenu text={'Save'} submenu={submenu} active={active}/>
    )
  }
})


var SaveAsGeoJSON = React.createClass({
  onClick: function() {
    var layers = LayerStore.getAllSelected()
    for (var id in layers) {
      var layer = layers[id]
      if (layer.selected) {
        fileSaver(new Blob([JSON.stringify(vectorTools.clean(layer.geojson))], {
            type: 'text/plain;charset=utf-8'
        }), layer.name + '.geojson')
      }
    }
  },
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    return (
      <ToolbarItem text={'GeoJSON'} onClick={this.onClick} active={active}/>
    )
  }
})

var SaveAsShp = React.createClass({
  onClick: function() {
    var layers = LayerStore.getAllSelected()
    for (var id in layers) {
      var layer = layers[id]
      if (layer.selected) {
        shpwrite.download(layer.geojson)
      }
    }
  },
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    return (
      <ToolbarItem text={'Shapefile'} onClick={this.onClick} active={active}/>
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
    //var active = this.props.config.oneLayer  || this.props.config.multiLayer
    var active = true
    var submenu = [
      <Undo {...this.props} key={'undo'}/>,
      <RenameLayer {...this.props} key={'renameLayer'}/>,
      <Style {...this.props} key={'style'}/>,
      <SaveAs {...this.props} key={'saveAs'}/>,
      <ZoomToLayer {...this.props} key={'zoomToLayer'}/>
      ]
    return (
      <ToolbarDropdown text={'Layer'} submenu={submenu} active={active}/>
    )
  }
})

module.exports = LayerMenu