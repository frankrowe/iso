function DefaultLayer() {
  this.defaultLayer = {
    name: 'New Layer',
    fileName: '',
    //checkbox
    enabled: true,
    //layer selected in layer list
    selected: true,
    //causes map to zoom to this layer
    zoomTo: true,
    //true when layer is currently being edited
    editing: false,
    geojson: {
      "type": "FeatureCollection",
      "features": []
    }
  }
  this.tileLayer = JSON.parse(JSON.stringify(this.defaultLayer))
}

DefaultLayer.prototype = {
  generate: function() {
    var layer = JSON.parse(JSON.stringify(this.defaultLayer))
    layer.id = Math.random().toString(36).slice(2)
    return layer
  }
}

module.exports = new DefaultLayer()