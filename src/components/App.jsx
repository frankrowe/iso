var React = require('react')
  , Toolbar = require('./Toolbar.jsx')
  , AddLayers = require('./AddLayers.jsx')
  , LayerList = require('./LayerList.jsx')
  , WorkSpace = require('./WorkSpace.jsx')
  , MessageBar = require('./MessageBar.jsx')
  , palette = require('../utils/palette')
  , vectorTools = require('../utils/VectorTools')
  , gjutils = require('../utils/gjutils')

var appStyle = {
  backgroundColor: palette.darkest
}

var headerStyle = {
  backgroundColor: palette.dark,
  borderColor: palette.lightest
}

var App = React.createClass({
  getInitialState: function() {
    return {
      layers: [],
      message: '0 layers added.'
    }
  },
  componentDidMount: function() {
    vectorTools.updateLayers = this.updateLayers
    vectorTools.addLayer = this.addLayer
  },
  layerMessage: function() {
    var message = ''
    if (this.state.layers.length === 0) {
      message = '0 layers added.'
    } else {
      var selected = _.where(this.state.layers, {selected: true})
      if (selected.length == 0) {
        message = '0 layers selected.'
      } else if (selected.length == 1) {
        message = 'Layer "' + selected[0].name + '" selected.'
      } else {
        message = selected.length + ' layers selected.'
      }
      var selectedFeatureCount = 0
      this.state.layers.forEach(function(layer) {
        selectedFeatureCount += gjutils.findSelectedCount(layer.geojson)
      })
      message += ' ' + selectedFeatureCount + ' '
      message += (selectedFeatureCount == 1) ? 'feature selected.' : 'features selected.'
    }
    return message
  },
  findLayer: function(layer) {
    var layers = this.state.layers
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].id === layer.id) {
        return layers[i]
      }
    }
  },
  updateLayer: function(layer) {
    var layers = this.state.layers
    var l = this.findLayer(layer)
    if (l) {
      l = layer
      this.setState({
        layers: layers,
        message: this.layerMessage()
      })
    }
  },
  updateLayers: function(layers) {
    this.setState({
      layers: layers,
      message: this.layerMessage()
    })
  },
  addLayer: function(layer) {
    var self = this
    var layers = this.state.layers
    layers.push(layer)
    this.setState({
      layers: layers,
      message: this.layerMessage()
    })
  },
  removeLayers: function() {
    var layers = this.state.layers
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].selected) {
        layers[i].mapLayer.clearLayers()
        layers[i].mapLayer = null
        layers.splice(i, 1)
      }
    }
    this.setState({
      layers: layers,
      message: this.layerMessage()
    })
  },
  onSelect: function(layer) {
    var layers = this.state.layers
    var l = this.findLayer(layer)
    if (l) {
      l.selected = layer.selected
      this.setState({
        layers: layers,
        message: this.layerMessage()
      })
    }
  },
  onEnable: function(layer) {
    var layers = this.state.layers
    var l = this.findLayer(layer)
    if (l) {
      l.enabled = layer.enabled
      this.setState({
        layers: layers,
        message: this.layerMessage()
      })
    }
  },
  render: function() {
    console.log('render App')
    vectorTools.setLayers(this.state.layers)
    return (
      <div className="app" style={appStyle}>
        <div className="header" style={headerStyle}>
          <h1>uGIS</h1>
        </div>
        <Toolbar
          layers={this.state.layers}
          newLayer={vectorTools.newLayer.bind(vectorTools)}
          renameLayer={vectorTools.renameLayer.bind(vectorTools)}
          selectAll={vectorTools.selectAll.bind(vectorTools)}
          deselectAll={vectorTools.deselectAll.bind(vectorTools)}
          deleteFeature={vectorTools.deleteFeature.bind(vectorTools)}
          saveAs={vectorTools.saveAs.bind(vectorTools)}
          editFeature={vectorTools.editFeature.bind(vectorTools)}
          simplify={vectorTools.simplify.bind(vectorTools)}
          buffer={vectorTools.buffer.bind(vectorTools)}
          flip={vectorTools.flip.bind(vectorTools)}
          explode={vectorTools.explode.bind(vectorTools)}
          combine={vectorTools.combine.bind(vectorTools)}
          merge={vectorTools.merge.bind(vectorTools)}
          hexgrid={vectorTools.createHexGrid.bind(vectorTools)}
          quantile={vectorTools.quantile.bind(vectorTools)}
          zoomToLayer={vectorTools.zoomToLayer.bind(vectorTools)}
        />
        <div className="flex-row">
          <AddLayers
            addLayer={this.addLayer}
            removeLayers={this.removeLayers}
          />
          <LayerList
            layers={this.state.layers}
            updateLayer={this.updateLayer}
          />
          <WorkSpace
            layers={this.state.layers}
            updateLayer={this.updateLayer}
          />
        </div>
        <MessageBar message={this.state.message}/>
      </div>
    )
  }
})

module.exports = App