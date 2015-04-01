var React = require('react')
  , Toolbar = require('./Toolbar.jsx')
  , AddLayers = require('./AddLayers.jsx')
  , LayerList = require('./LayerList.jsx')
  , WorkSpace = require('./WorkSpace.jsx')
  , palette = require('./palette')
  , turfbuffer = require('turf-buffer')
  , turfsimplify = require('turf-simplify')
  , vectorTools = require('./lib/VectorTools')

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
      layers: []
    }
  },
  componentDidMount: function() {
    vectorTools.updateLayers = this.updateLayers
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
      this.setState({layers: layers})
    }
  },
  updateLayers: function(layers) {
    this.setState({layers: layers})
  },
  addLayer: function(layer) {
    var self = this
    var layers = this.state.layers
    console.log(layer)
    layers.push(layer)
    this.setState({layers: layers})
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
    this.setState({layers: layers})
  },
  onSelect: function(layer) {
    var layers = this.state.layers
    var l = this.findLayer(layer)
    if (l) {
      l.selected = layer.selected
      this.setState({layers: layers})
    }
  },
  onEnable: function(layer) {
    var layers = this.state.layers
    var l = this.findLayer(layer)
    if (l) {
      l.enabled = layer.enabled
      this.setState({layers: layers})
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
          selectAll={vectorTools.selectAll.bind(vectorTools)}
          deselectAll={vectorTools.deselectAll.bind(vectorTools)}
          deleteFeature={vectorTools.deleteFeature.bind(vectorTools)}
          saveAs={vectorTools.saveAs.bind(vectorTools)}
          simplify={vectorTools.simplify.bind(vectorTools)}
          buffer={vectorTools.buffer.bind(vectorTools)}
          flip={vectorTools.flip.bind(vectorTools)}
          explode={vectorTools.explode.bind(vectorTools)}
          hexgrid={vectorTools.createHexGrid.bind(vectorTools)}
          quantile={vectorTools.quantile.bind(vectorTools)}
        />
        <div className="flex-row">
          <AddLayers
            addLayer={this.addLayer}
            removeLayers={this.removeLayers}
          />
          <LayerList
            layers={this.state.layers}
            onSelect={this.onSelect}
            onEnable={this.onEnable}
          />
          <WorkSpace
            layers={this.state.layers}
            updateLayer = {this.updateLayer}
          />
        </div>
      </div>
    )
  }
})

module.exports = App