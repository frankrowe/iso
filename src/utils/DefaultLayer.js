var palette = require('../utils/palette')

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
    },
    style: {
      radius: 3,
      color: palette.green,
      fillColor: palette.green,
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5
    }
  }
}

DefaultLayer.prototype = {
  generateID: function() {
    return (+new Date() + Math.floor(Math.random() * 999999)).toString(36)
  },
  generateColor: function() {
    return "#" + Math.random().toString(16).slice(2, 8)
  },
  generate: function() {
    var layer = JSON.parse(JSON.stringify(this.defaultLayer))
    layer.id = this.generateID()
    layer.style.color = this.generateColor()
    console.log(layer.style.color)
    layer.style.fillColor = layer.style.color
    return layer
  }
}

module.exports = new DefaultLayer()