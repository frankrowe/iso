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
  generateID: function() {
    return (+new Date() + Math.floor(Math.random() * 999999)).toString(36)
  },
  generate: function() {
    var layer = JSON.parse(JSON.stringify(this.defaultLayer))
    layer.id = this.generateID()
    return layer
  }
}

module.exports = new DefaultLayer()