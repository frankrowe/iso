var React = require('react')

var selectedStyle = {
  color: '#f00'
}

var unselectedStyle = {
  color: '#00f'
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
    //L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png').addTo(this.map)
    this.workingLayers = L.featureGroup()
    this.map.addLayer(this.workingLayers)
  },
  layerOnClick: function(layer, e) {
    layer.selected = !layer.selected
    console.log(layer.selected)
    this.props.updateLayer(layer)
  },
  addLayers: function(layer) {
    var self = this
    if (this.workingLayers) this.workingLayers.clearLayers()
    this.props.layers.forEach(function(layer) {
      if (!layer.mapLayer) {
        layer.mapLayer = L.geoJson(layer.geojson)
        layer.mapLayer.on('click', self.layerOnClick.bind(self, layer))
      }
      if (layer.enabled) {
        if (layer.selected) {
          layer.mapLayer.setStyle(selectedStyle)
        } else {
          layer.mapLayer.setStyle(unselectedStyle)
        }
        if(!self.map.hasLayer(layer.mapLayer)) {
          self.workingLayers.addLayer(layer.mapLayer)
        }
      } else {
        if(self.map.hasLayer(layer.mapLayer)) {
          self.workingLayers.removeLayer(layer.mapLayer)
        }
      }
    })
    if (this.props.layers.length) {
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