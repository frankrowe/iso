import palette from '../utils/palette';

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
  generateID: () => (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
  generateColor: () => "#" + Math.random().toString(16).slice(2, 8),
  generate: function() {
    let layer = JSON.parse(JSON.stringify(this.defaultLayer));
    layer.id = this.generateID()
    layer.style.color = this.generateColor()
    layer.style.fillColor = layer.style.color
    return layer
  }
}

export default new DefaultLayer();