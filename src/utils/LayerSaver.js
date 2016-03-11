var LayerActions = require('../actions/LayerActions')
  , LayerStore = require('../stores/LayerStore')
  , fileSaver = require('filesaver.js')
  , tokml = require('tokml')
  , geojson2dsv = require('geojson2dsv')
  , wellknown = require('wellknown')
  , shpwrite = require('shp-write')
  , defaultLayer = require('../utils/DefaultLayer')
  , vectorTools = require('../utils/vectorTools')

function LayerSaver() {

}

LayerSaver.prototype.geojson = function() {
  var layers = LayerStore.getAllSelected()
  for (var id in layers) {
    var layer = layers[id]
    if (layer.selected) {
      var content = JSON.stringify(vectorTools.clean(layer.geojson))
      fileSaver(new Blob([content], {
          type: 'text/plain;charset=utf-8'
      }), layer.name + '.geojson')
    }
  }
}

LayerSaver.prototype.kml = function() {
  var layers = LayerStore.getAllSelected()
  for (var id in layers) {
    var layer = layers[id]
    if (layer.selected) {
      var content = tokml(vectorTools.clean(layer.geojson))
      fileSaver(new Blob([content], {
          type: 'text/plain;charset=utf-8'
      }), layer.name + '.kml')
    }
  }
}

LayerSaver.prototype.wkt = function() {
  var layers = LayerStore.getAllSelected()
  for (var id in layers) {
    var layer = layers[id]
    if (layer.selected) {
      var features = vectorTools.clean(layer.geojson).features
      var content = features.map(wellknown.stringify).join('\n')
      fileSaver(new Blob([content], {
          type: 'text/plain;charset=utf-8'
      }), layer.name + '.wkt')
    }
  }
}

LayerSaver.prototype.csv = function() {
  var layers = LayerStore.getAllSelected()
  for (var id in layers) {
    var layer = layers[id]
    if (layer.selected) {
      var content = geojson2dsv(vectorTools.clean(layer.geojson))
      fileSaver(new Blob([content], {
          type: 'text/plain;charset=utf-8'
      }), layer.name + '.csv')
    }
  }
}

LayerSaver.prototype.shp = function() {
  var layers = LayerStore.getAllSelected()
  for (var id in layers) {
    var layer = layers[id]
    if (layer.selected) {
      shpwrite.download(layer.geojson)
    }
  }
}

module.exports = new LayerSaver()
