var React = require('react')
  , numeral = require('numeral')
  , LayerActions = require('../actions/LayerActions')
  , LayerStore = require('../stores/LayerStore')
  , vectorTools = require('../utils/vectorTools')
  , palette = require('../utils/palette')
  , baseMaps = require('../utils/baseMaps')

var selectedStyle = {
  color: '#f00',
  fillColor: '#f00',
  fillOpacity: 0.8,
  opacity: 1
}

var mapStyle = {}

var WorkSpace = React.createClass({
  componentDidMount: function() {
    this.makeMap()
  },
  componentDidUpdate: function() {
    this.map.invalidateSize()
  },
  updateCoords: function(x, y, z) {
    document.getElementsByClassName('message-bar-item coordinates')[0].innerHTML = 
      'x: ' + numeral(x).format('0,0.0000') + ' ' + 
      'y: ' + numeral(y).format('0,0.0000') + ' ' +
      'z: ' + z
  },
  makeMap: function() {
    this.map = L.map(this.refs.workspace.getDOMNode(), {
      attributionControl: false,
      zoomControl: false
    }).setView([30, 20], 2)

    this.baseMap = baseMaps[this.props.baseMap].layer
    this.baseMap.addTo(this.map)
    
    this.workingLayers = L.featureGroup()
    this.map.addLayer(this.workingLayers)

    this.map.on('mousemove', function(e) {
      this.updateCoords(e.latlng.lng, e.latlng.lat, this.map.getZoom())
    }, this)

    this.map.on('draw:drawstart', function (e) {
      if (this.selectBoxActive) {
        this.map.off('mousedown', this.selectBoxMouseDown, this)
        this.map.off('mousemove', this.selectBoxMouseMove, this)
        this.map.off('mouseup', this.selectBoxMouseUp, this)
      }
    }, this)

    this.map.on('draw:drawstop', function (e) {
      if (this.selectBoxActive) {
        this.map.on('mousedown', this.selectBoxMouseDown, this)
        this.map.on('mousemove', this.selectBoxMouseMove, this)
        this.map.on('mouseup', this.selectBoxMouseUp, this)
      }
    }, this)

    this.map.on('draw:created', function (e) {
      for (var id in this.props.layers) {
        var layer = this.props.layers[id]
        if (layer.selected) {
          var gj = _.cloneDeep(layer.geojson)
          gj.features.push(e.layer.toGeoJSON())
          layer.mapLayer.clearLayers()
          layer.mapLayer = false
          LayerActions.update(layer.id, {geojson: gj, mapLayer: layer.mapLayer})
        }
      }
    }, this)

    this.map.on('draw:edited', function (e) {
      for (var id in this.props.layers) {
        var layer = this.props.layers[id]
        if (layer.selected) {
          var gj = layer.mapLayer.toGeoJSON()
          layer.mapLayer.clearLayers()
          layer.mapLayer = false
          LayerActions.update(layer.id, {geojson: gj, mapLayer: layer.mapLayer})
        }
      }
    }, this)

  },
  featureOnClick: function(_layer, feature, mapLayer) {
    var layer = LayerStore.getById(_layer.id)
    if (layer.selected) {
      if (!feature.selected) {
        feature.selected = true
      } else {
        feature.selected = false
      }
      LayerActions.update(layer.id, {geojson: layer.geojson})
    }
  },
  styleFeature: function(layer, feature) {
    if (feature.selected) {
      return selectedStyle
    } else {
      return layer.style
    }
  },
  selectBoxMouseDown: function(e) {
    this.map.dragging.disable()
    this.rectangleStart = e.latlng
    bounds = L.latLngBounds(this.rectangleStart, this.rectangleStart)
    this.rectangle = L.rectangle(bounds, {color: "#f00", weight: 1})
    this.rectangle.addTo(this.map)
  },
  selectBoxMouseMove: function(e) {
    if (this.rectangle) {
      bounds = L.latLngBounds(this.rectangleStart, e.latlng)
      this.rectangle.setBounds(bounds)
    }
  },
  selectBoxMouseUp: function(e) {
    this.map.dragging.enable()
    if (this.rectangle) {
      var rectangleBounds = this.rectangle.getBounds()
      vectorTools.selectBox(LayerStore.getAllSelected(), this.rectangle.toGeoJSON())
      this.map.removeLayer(this.rectangle)
      this.rectangle = false
    }
  },
  selectBox: function(on) {
    if (on) {
      if (!this.selectBoxActive) {
        this.selectBoxActive = true
        this.map.on('mousedown', this.selectBoxMouseDown, this)
        this.map.on('mousemove', this.selectBoxMouseMove, this)
        this.map.on('mouseup', this.selectBoxMouseUp, this)
      }
    } else {
      if (this.map) {
        this.selectBoxActive = false
        this.map.off('mousedown', this.selectBoxMouseDown, this)
        this.map.off('mousemove', this.selectBoxMouseMove, this)
        this.map.off('mouseup', this.selectBoxMouseUp, this)
      }
    }
  },
  addDrawControl: function(layer) {
    if (layer.editing) {
      if (this.drawControl) {
        this.map.removeControl(this.drawControl)
      }
      this.drawControl = new L.Control.Draw({
        draw: {
          polyline: {
              shapeOptions: layer.style
          },
          polygon: {
              shapeOptions: layer.style
          },
          rectangle: {
            shapeOptions: layer.style
          },
          circle: false
        },
        edit: {
          featureGroup: layer.mapLayer
        }
      })
      this.map.addControl(this.drawControl)
    } else {
      if (this.drawControl) {
        this.map.removeControl(this.drawControl)
        this.drawControl = false
      }
    }
  },
  addLeafletLayer: function(layer) {
    if (layer.vector) {
      if (!layer.mapLayer) {
        layer.mapLayer = L.geoJson(layer.geojson, {
          pointToLayer: function(layer, feature, latlng) {
            return L.circleMarker(latlng, layer.style)
          }.bind(this, layer),
          style: this.styleFeature.bind(this, layer),
          onEachFeature: function (layer, feature, mapLayer) {
            mapLayer.on('click', this.featureOnClick.bind(this, layer, feature, mapLayer))
          }.bind(this, layer)
        })
      } else {
        layer.mapLayer.setStyle(this.styleFeature.bind(this, layer))
      } 
    } else if (layer.tile) {
      if (!layer.mapLayer) {
        layer.mapLayer = L.tileLayer(layer.tileURL)
      }
    }
    layer.mapLayerId = L.stamp(layer.mapLayer)
  },
  enableLayer: function(layer, zoomToLayers) {
    if (layer.enabled) {
      if (layer.vector && layer.zoomTo) {
        zoomToLayers.addLayer(layer.mapLayer)
        layer.zoomTo = false
      }
      if(!this.workingLayers.hasLayer(layer.mapLayer)) {
        this.workingLayers.addLayer(layer.mapLayer)
      }
    } else {
      if(this.workingLayers.hasLayer(layer.mapLayer)) {
        this.workingLayers.removeLayer(layer.mapLayer)
      }
    }
  },

  /**
   * Remove any layers from the map that aren't in props
   */
  checkCurrentLayers: function() {
    this.workingLayers.eachLayer(function(layer) {
      var ids = _.pluck(this.props.layers, 'mapLayerId')
      if (ids.indexOf(L.stamp(layer)) < 0) {
        this.workingLayers.removeLayer(layer)
      }
    }, this)
  },
  addLayers: function(layer) {
    var style = {}
    var selectBoxActive = false
    var zoomToLayers = L.featureGroup()
    var layers = _.values(this.props.layers)
    layers = _.sortBy(layers, 'order')
    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i]
      if (layer.editGeoJSON) {
        style.marginRight = 400
      }
      if (layer.selected && layer.selectBox) {
        selectBoxActive = true
      }
      this.addLeafletLayer(layer)
      this.addDrawControl(layer)
      this.enableLayer(layer, zoomToLayers)
    }
    this.selectBox(selectBoxActive)
    if (this.selectBoxActive) {
      style.cursor = 'crosshair'
    }
    if (zoomToLayers.getLayers().length) {
      if (zoomToLayers.getBounds().isValid()) {
        this.map.fitBounds(zoomToLayers.getBounds())
      }
      this.map.removeLayer(zoomToLayers)
      zoomToLayers = null
    }
    return style
  },
  componentWillUpdate: function() {
    if (this.map) this.checkCurrentLayers()
    mapStyle = this.addLayers()
    if (this.baseMap && !this.map.hasLayer(baseMaps[this.props.baseMap].layer)) {
      this.map.removeLayer(this.baseMap)
      if (baseMaps[this.props.baseMap].layer) {
        this.baseMap = baseMaps[this.props.baseMap].layer
        this.map.addLayer(this.baseMap)
      }
    }
  },
  render: function() {
    return (
      <div className="work-space" ref="workspace" style={mapStyle}>
      </div>
    )
  }
})

module.exports = WorkSpace