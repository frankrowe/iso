var React = require('react')
  , palette = require('./palette')

var selectedStyle = {
  weight: 3,
  color: '#f00'
}

var unselectedStyle = {
  weight: 3,
  color: palette.green
}

var pointStyle = {
  radius: 2,
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
}

var WorkSpace = React.createClass({
  componentDidMount: function() {
    this.makeMap()
  },
  makeMap: function() {
    var self = this
    this.map = L.map(this.refs.workspace.getDOMNode(), {
      attributionControl: false,
      zoomControl: false
    }).setView([38, -76], 5)
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.lkf1pigd/{z}/{x}/{y}.png').addTo(this.map)
    this.workingLayers = L.featureGroup()
    this.map.addLayer(this.workingLayers)
    this.map.on('mousemove', function(e) {
      $('.message-bar-item.coordinates').html(
        Math.round(e.latlng.lat * 100000) / 100000 + ', ' + 
        Math.round(e.latlng.lng * 100000) / 100000
      )
    })
    this.map.on('draw:created', function (e) {
      console.log(e)
      this.props.layers.forEach(function(layer) {
        if (layer.selected) {
          console.log(e.layer.toGeoJSON())
          layer.geojson.features.push(e.layer.toGeoJSON())
          layer.mapLayer.clearLayers()
          layer.mapLayer = false
          this.props.updateLayer(layer)
        }
      }, this)
    }, this)
  },
  featureOnClick: function(layer, feature, mapLayer) {
    if (layer.selected) {
      if (!feature.selected) {
        feature.selected = true
      } else {
        feature.selected = false
      }
      if (feature.selected) {
        mapLayer.setStyle(selectedStyle)
      } else {
        mapLayer.setStyle(unselectedStyle)
      }
      this.props.updateLayer(layer)
    }
  },
  addLayers: function(layer) {
    var self = this
    var zoomToLayers = L.featureGroup()
    this.props.layers.forEach(function(layer) {
      if (!layer.mapLayer) {
        layer.mapLayer = L.geoJson(layer.geojson, {
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, pointStyle)
          },
          style: function(feature) {
            if (feature.selected) {
              return selectedStyle
            } else {
              return unselectedStyle
            }
          },
          onEachFeature: function (layer, feature, mapLayer) {
            mapLayer.on('click', this.featureOnClick.bind(this, layer, feature, mapLayer))
          }.bind(self, layer)
        })
      }

      if (layer.editing) {
        if (self.drawControl) {
          self.map.removeControl(self.drawControl)
        }
        self.drawControl = new L.Control.Draw({
          draw: {
            polyline: {
                shapeOptions: unselectedStyle
            },
            polygon: {
                shapeOptions: unselectedStyle
            },
            rectangle: {
              shapeOptions: unselectedStyle
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
      if (layer.enabled) {
        if (layer.zoomTo) {
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
    if (zoomToLayers.getLayers().length) {
      if (zoomToLayers.getBounds().isValid()) {
        this.map.fitBounds(zoomToLayers.getBounds())
      }
      this.map.removeLayer(zoomToLayers)
      zoomToLayers = null
    }
  },
  render: function() {
    this.addLayers()
    return (
      <div className="work-space" ref="workspace">
      </div>
    )
  }
})

module.exports = WorkSpace