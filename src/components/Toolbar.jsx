var React = require('react')
  , gjutils = require('../utils/gjutils')
  , LayerMenu = require('./LayerMenu.jsx')
  , ViewMenu = require('./ViewMenu.jsx')
  , FeatureMenu = require('./FeatureMenu.jsx')
  , SelectMenu = require('./SelectMenu.jsx')
  , HelpMenu = require('./HelpMenu.jsx')

var Toolbar = React.createClass({
  findActive: function() {
    var config = {
      nothing: true,
      oneLayer: false,
      multiLayer: false,
      noFeature: true,
      oneFeature: false,
      multiFeature: false,
      point: false,
      poly: false,
      line: false,
      numPoints: 0,
      numPolys: 0,
      numLines: 0,
      multipoint: false,
      multipoly: false,
      multiline: false,
      vector: false,
      tile: false
    }
    var selected = _.where(this.props.layers, {selected: true})
    var selectedFeatures = []
    selected.forEach(function(layer) {
      layer.geojson.features.forEach(function(feature) {
        if (feature.selected) {
          selectedFeatures.push(feature)
          if (feature.geometry.type === 'Point') {
            config.numPoints += 1
            if (config.point) config.multipoint = true
            config.point = true
          } else if (feature.geometry.type === 'Polygon') {
            config.numPolys += 1
            if (config.poly) config.multipoly = true
            config.poly = true
          } else if (feature.geometry.type === 'LineString') {
            config.numLines += 1
            if (config.line) config.multiline = true
            config.line = true
          }
        }
      })
    })
    if (selected.length === 0) {
      config.nothing = true
    }
    if (selected.length === 1) {
      config.oneLayer = selected[0]
    }
    if (selected.length > 1) {
      config.multiLayer = true
    }
    var totalSelectedFeatures = 0
    for (var key in this.props.layers) {
      var layer = this.props.layers[key]
      totalSelectedFeatures += gjutils.findSelectedCount(layer.geojson)
      if (layer.selected) {
        if (layer.vector) {
          config.vector = true
        }
        if (layer.tile) {
          config.tile = true
        }
      }
    }
    if (totalSelectedFeatures === 1) {
      config.oneFeature = true
    }
    if (totalSelectedFeatures > 1) {
      config.multiFeature = true
    }
    return config
  },
  render: function() {
    var config = this.findActive()
    return (
      <div className="toolbar">
        <h1>uGIS</h1>
        <LayerMenu {...this.props} config={config} />
        <ViewMenu {...this.props} config={config} />
        <FeatureMenu {...this.props} config={config} />
        <SelectMenu {...this.props} config={config} />
        <HelpMenu />
      </div>
    )
  }
})

module.exports = Toolbar