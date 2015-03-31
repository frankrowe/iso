var React = require('react')
  , Toolbar = require('./Toolbar.jsx')
  , AddLayers = require('./AddLayers.jsx')
  , LayerList = require('./LayerList.jsx')
  , WorkSpace = require('./WorkSpace.jsx')
  , palette = require('./palette')
  , turfbuffer = require('turf-buffer')
  , turfsimplify = require('turf-simplify')

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
  removeLayer: function(layer) {
    var layers = this.state.layers
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].selected) {
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
  simplify: function () {
    var layers = this.state.layers
    var tolerance = .1
    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i]
      if (layer.enabled && layer.selected) {
        if (layer.geojson.type === 'FeatureCollection') {
          for (var j = 0; j < layer.geojson.features.length; j++) {
            layer.geojson.features[j] = turfsimplify(layer.geojson.features[j], tolerance, false)
          }
        } else if (layer.geojson.type === 'Feature') {
          layer.geojson = turfsimplify(layer.geojson, tolerance, false)
        }
        if (layer.mapLayer) {
          layer.mapLayer.clearLayers()
          layer.mapLayer.addData(layer.geojson)
        }
      }
    }
    this.setState({layers: layers})
  },
  buffer: function () {
    var layers = this.state.layers
    var tolerance = .1
    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i]
      if (layer.enabled && layer.selected) {
        if (layer.geojson.type === 'FeatureCollection') {
          for (var j = 0; j < layer.geojson.features.length; j++) {
            layer.geojson.features[j] = turfbuffer(layer.geojson.features[j], tolerance, false)
          }
        } else if (layer.geojson.type === 'Feature') {
          layer.geojson = turfbuffer(layer.geojson, tolerance, false)
        }
        if (layer.mapLayer) {
          layer.mapLayer.clearLayers()
          layer.mapLayer.addData(layer.geojson)
        }
      }
    }
    this.setState({layers: layers})
  },
  render: function() {
    console.log('render App')
    return (
      <div className="app" style={appStyle}>
        <div className="header" style={headerStyle}>
          <h1>uGIS</h1>
        </div>
        <Toolbar
          simplify={this.simplify}
          buffer={this.buffer}
        />
        <div className="flex-row">
          <AddLayers
            addLayer={this.addLayer}
            removeLayer={this.removeLayer}
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