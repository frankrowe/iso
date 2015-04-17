function GJUtils() {

}

GJUtils.prototype = {
  findSelectedCount: function(gj) {
    var count = 0
    if (gj.type === 'FeatureCollection') {
      gj.features.forEach(function(f) {
        if (f.selected) count++
      })
    } else if (gj.type === 'Feature') {
      if (gj.selected) count++
    }
    return count
  },
  newFeatureCollection: function() {
    return {
      "type": "FeatureCollection",
      "features": []
    }
  },
  editFeatures: function(layers, fn) {
    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i]
      if (layer.enabled) {
        if (layer.geojson.type === 'FeatureCollection') {
          var newFeatures = []
          for (var j = 0; j < layer.geojson.features.length; j++) {
            var newgj = fn(layer.geojson.features[j], layer)
            if (newgj) {
              if (newgj.type === 'FeatureCollection') {
                newFeatures = newFeatures.concat(newgj.features)
              } else {
                newFeatures.push(newgj)
              }
            }
          }
          layer.geojson.features = newFeatures
        } else if (layer.geojson.type === 'Feature') {
          layer.geojson = fn(layer.geojson, layer)
        }
        if (layer.mapLayer) {
          layer.mapLayer.clearLayers()
          if (layer.geojson) layer.mapLayer.addData(layer.geojson)
        }
      }
    }
    return layers
  }
}

module.exports = new GJUtils()