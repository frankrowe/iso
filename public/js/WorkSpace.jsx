var React = require('react')

var selectedStyle = {
  color: '#f00'
}

var unselectedStyle = {
  color: '#00f'
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
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png').addTo(this.map)
    this.workingLayers = L.featureGroup()
    this.map.addLayer(this.workingLayers)
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
    }
  },
  addLayers: function(layer) {
    var self = this
    var isNewLayer = false
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
      if (layer.enabled) {
        if(!self.workingLayers.hasLayer(layer.mapLayer)) {
          self.workingLayers.addLayer(layer.mapLayer)
          isNewLayer = true
        }
      } else {
        if(self.workingLayers.hasLayer(layer.mapLayer)) {
          self.workingLayers.removeLayer(layer.mapLayer)
        }
      }
    })
    if (this.props.layers.length && isNewLayer) {
      this.map.fitBounds(this.workingLayers.getBounds())
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