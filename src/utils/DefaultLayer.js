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
}

DefaultLayer.prototype = {
  generate: function() {
    return JSON.parse(JSON.stringify(this.defaultLayer))
  }
}

module.exports = new DefaultLayer()