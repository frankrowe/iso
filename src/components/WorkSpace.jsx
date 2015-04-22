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
  fillOpacity: 1,
  opacity: 1
}

var unselectedStyle = {
  weight: 3,
  color: palette.green
}

var pointStyle = {
  radius: 3,
  color: palette.green,
  weight: 1,
  opacity: 1,
  fillOpacity: 1
}

var lineStyle = {
  color: "blue",
  weight: 3,
  opacity: 1
}

// var baseMaps = [
//   L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.lkf1pigd/{z}/{x}/{y}.png'),
//   L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.m05elkbi/{z}/{x}/{y}.png'),
//   L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.m05ep5bc/{z}/{x}/{y}.png'),
//   L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.m05f0k04/{z}/{x}/{y}.png')
// ]

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
    var self = this
    this.map = L.map(this.refs.workspace.getDOMNode(), {
      attributionControl: false,
      zoomControl: false
    }).setView([30, 20], 2)
    this.baseMap = baseMaps[this.props.baseMap].layer
    this.baseMap.addTo(this.map)
    //L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.lkf1pigd/{z}/{x}/{y}.png').addTo(this.map)
    this.workingLayers = L.featureGroup()
    this.map.addLayer(this.workingLayers)
    this.map.on('mousemove', function(e) {
      self.updateCoords(e.latlng.lng, e.latlng.lat, self.map.getZoom())
    })
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
      // if (feature.geometry.type === 'Point') {
      //   return pointStyle
      // } else if (feature.geometry.type === 'LineString') {
      //   return lineStyle
      // } else {
      //   return unselectedStyle
      // }
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
  addLayers: function(layer) {
    var self = this
    var style = {}
    var selectBox = false
    var zoomToLayers = L.featureGroup()
    var layers = _.values(this.props.layers)
    layers = _.sortBy(layers, 'order')
    layers.forEach(function(layer) {
      if (layer.editGeoJSON) {
        style.marginRight = 400
      }
      if (layer.selected && layer.selectBox) {
        selectBox = true
      }
      if (layer.vector) {
        if (!layer.mapLayer) {
          layer.mapLayer = L.geoJson(layer.geojson, {
            pointToLayer: function(feature, latlng) {
              return L.circleMarker(latlng, pointStyle)
            },
            style: self.styleFeature.bind(self, layer),
            onEachFeature: function (layer, feature, mapLayer) {
              mapLayer.on('click', this.featureOnClick.bind(this, layer, feature, mapLayer))
            }.bind(self, layer)
          })
        } else {
          layer.mapLayer.setStyle(self.styleFeature.bind(self, layer))
        }

        if (layer.editing) {
          if (self.drawControl) {
            self.map.removeControl(self.drawControl)
          }
          self.drawControl = new L.Control.Draw({
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
          self.map.addControl(self.drawControl)
        } else {
          if (self.drawControl) {
            self.map.removeControl(self.drawControl)
            self.drawControl = false
          }
        }
      } else if (layer.tile) {
        if (!layer.mapLayer) {
          layer.mapLayer = L.tileLayer(layer.tileURL)
        }
      }
      if (layer.enabled) {
        if (layer.vector && layer.zoomTo) {
          zoomToLayers.addLayer(layer.mapLayer)
          layer.zoomTo = false
        }
        if(!self.workingLayers.hasLayer(layer.mapLayer)) {
          self.workingLayers.addLayer(layer.mapLayer)
        }
      } else {
        if(self.workingLayers.hasLayer(layer.mapLayer)) {
          self.workingLayers.removeLayer(layer.mapLayer)
        }
      }
    })
    self.selectBox(selectBox)
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
  render: function() {
    var style = this.addLayers()
    if (this.baseMap && !this.map.hasLayer(baseMaps[this.props.baseMap].layer)) {
      this.map.removeLayer(this.baseMap)
      if (baseMaps[this.props.baseMap].layer) {
        this.baseMap = baseMaps[this.props.baseMap].layer
        this.map.addLayer(this.baseMap)
      }
    }
    return (
      <div className="work-space" ref="workspace" style={style}>
      </div>
    )
  }
})

module.exports = WorkSpace