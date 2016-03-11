var React = require('react')
  , vectorTools = require('../utils/vectorTools')
  , Modals = require('./Modals.jsx')
  , ToolbarItem = require('./ToolbarItem.jsx')
  , ToolbarSubmenu = require('./ToolbarSubmenu.jsx')
  , ToolbarDropdown = require('./ToolbarDropdown.jsx')
  , LayerActions = require('../actions/LayerActions')
  , LayerStore = require('../stores/LayerStore')
  , defaultLayer = require('../utils/DefaultLayer')
  , layerSaver = require('../utils/LayerSaver')

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

var Combine = React.createClass({
  onClick: function() {
    vectorTools.combine(LayerStore.getAllSelected())
  },
  render: function() {
    var active = this.props.config.numVector >= 2
    return (
      <ToolbarItem text={'Combine'} onClick={this.onClick} active={active}/>
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

var NewEmptyLayer = React.createClass({
  onClick: function() {
    var newLayer = defaultLayer.generate()
    newLayer.vector = true
    LayerActions.importLayer(newLayer)
  },
  render: function() {
    var active = true
    return (
      <ToolbarItem text={'Vector Layer'} onClick={this.onClick} active={active}/>
    )
  }
})

var NewLayerFromSelection = React.createClass({
  onClick: function() {
    var newLayer = defaultLayer.generate()
    newLayer.vector = true
    newLayer.geojson = vectorTools.layerFromSelection(LayerStore.getAll())
    LayerActions.importLayer(newLayer)
  },
  render: function() {
    var active = this.props.config.oneFeature || this.props.config.multiFeature
    return (
      <ToolbarItem text={'Vector Layer From Selection'} onClick={this.onClick} active={active}/>
    )
  }
})

var Create = React.createClass({
  render: function() {
    var active = true
      var submenu = [
        <NewEmptyLayer {...this.props} key={'NewEmptyLayer'}/>,
        <NewLayerFromSelection {...this.props} key={'NewLayerFromSelection'}/>
      ]
    return (
      <ToolbarSubmenu text={'Create'} submenu={submenu} active={active}/>
    )
  }
})

var SaveAs = React.createClass({
  render: function() {
    var active = true
        var submenu = [
          <SaveAsGeoJSON {...this.props} key={'saveAsGeoJSON'}/>,
          <SaveAsKML {...this.props} key={'SaveAsKML'}/>,
          <SaveAsWKT {...this.props} key={'SaveAsWKT'}/>,
          <SaveAsCSV {...this.props} key={'SaveAsCSV'}/>,
          <SaveAsShp {...this.props} key={'saveAsShp'}/>
        ]
    return (
      <ToolbarSubmenu text={'Save'} submenu={submenu} active={active}/>
    )
  }
})

var SaveAsGeoJSON = React.createClass({
  onClick: function() {
    layerSaver.geojson()
  },
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    return (
      <ToolbarItem text={'GeoJSON'} onClick={this.onClick} active={active}/>
    )
  }
})

var SaveAsKML = React.createClass({
  onClick: function() {
    layerSaver.kml()
  },
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    return (
      <ToolbarItem text={'KML'} onClick={this.onClick} active={active}/>
    )
  }
})

var SaveAsWKT = React.createClass({
  onClick: function() {
    layerSaver.wkt()
  },
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    return (
      <ToolbarItem text={'WKT'} onClick={this.onClick} active={active}/>
    )
  }
})

var SaveAsCSV = React.createClass({
  onClick: function() {
    layerSaver.csv()
  },
  render: function() {
    var active = this.props.config.oneLayer && this.props.config.vector
    return (
      <ToolbarItem text={'CSV (points)'} onClick={this.onClick} active={active}/>
    )
  }
})

var SaveAsShp = React.createClass({
  onClick: function() {
    layerSaver.shp()
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
      <Create {...this.props} key={'Create'} />,
      <SaveAs {...this.props} key={'saveAs'}/>,
      <RenameLayer {...this.props} key={'renameLayer'}/>,
      <Style {...this.props} key={'style'}/>,
      <Combine {...this.props} key={'combine'}/>,
      <ZoomToLayer {...this.props} key={'zoomToLayer'}/>
      ]
    return (
      <ToolbarDropdown text={'Layer'} submenu={submenu} active={active}/>
    )
  }
})

module.exports = LayerMenu
