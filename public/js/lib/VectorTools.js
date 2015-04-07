var turfbuffer = require('turf-buffer')
  , turfsimplify = require('turf-simplify')
  , turfflip = require('turf-flip')
  , turfkinks = require('turf-kinks')
  , turfexplode = require('turf-explode')
  , turfcombine = require('turf-combine')
  , turfmerge = require('turf-merge')
  , turfhexgrid = require('turf-hex-grid')
  , turfquantile = require('turf-quantile')
  , fileSaver = require('filesaver.js')
  , defaultLayer = require('./DefaultLayer')
  , gjutils =require('./gjutils')

function VectorTools () {
  this.layers = {}
}

VectorTools.prototype = {
  setLayers: function(layers) {
    this.layers = layers
  },
  newLayer: function() {
    var newLayer = defaultLayer.generate()
    this.addLayer(newLayer)
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
  },
  getTolerance: function(next) {
    vex.dialog.open({
      message: 'Select tolerance.',
      input: "<style>\n    .vex-custom-field-wrapper {\n        margin: 1em 0;\n    }\n    .vex-custom-field-wrapper > label {\n        display: inline-block;\n        margin-bottom: .2em;\n    }\n</style>\n<div class=\"vex-custom-field-wrapper\">\n    <div class=\"vex-custom-input-wrapper\">\n        <input name=\"tolerance\" type=\"text\" value=\"0.1\" />\n    </div>\n</div>\n</div>",
      callback: function(data) {
        if (data === false) {
          return console.log('Cancelled');
        }
        //TODO make sure tolerance is 0 - 1
        var err = false
        console.log(data)
        next(err, +data.tolerance)
      }
    })
  },
  getDistance: function(next) {
    vex.dialog.open({
      message: 'Select distance.',
      input: "<style>\n    .vex-custom-field-wrapper {\n        margin: 1em 0;\n    }\n    .vex-custom-field-wrapper > label {\n        display: inline-block;\n        margin-bottom: .2em;\n    }\n</style>\n<div class=\"vex-custom-field-wrapper\">\n    <div class=\"vex-custom-input-wrapper\">\n        <input name=\"distance\" type=\"text\" value=\"0.1\" />\n    </div>\n</div>\n</div>",
      callback: function(data) {
        if (data === false) {
          return console.log('Cancelled');
        }
        //TODO make sure distance is number
        var err = false
        console.log(data)
        next(err, +data.distance)
      }
    })
  },
  getName: function(next) {
    vex.dialog.open({
      message: 'Enter New Layer Name',
      input: "<style>\n    .vex-custom-field-wrapper {\n        margin: 1em 0;\n    }\n    .vex-custom-field-wrapper > label {\n        display: inline-block;\n        margin-bottom: .2em;\n    }\n</style>\n<div class=\"vex-custom-field-wrapper\">\n    <div class=\"vex-custom-input-wrapper\">\n        <input name=\"layername\" type=\"text\" value=\"\" />\n    </div>\n</div>\n</div>",
      callback: function(data) {
        if (data === false) {
          return console.log('Cancelled');
        }
        //TODO make sure distance is number
        var err = false
        next(err, data.layername)
      }
    })
  },
  renameLayer: function() {
    var self = this
    this.getName(function(err, name) {
      self.layers.forEach(function(layer) {
        if (layer.selected) {
          layer.name = name
        }
      })
      self.updateLayers(self.layers)
    })
  },
  saveAs: function() {
    this.layers.forEach(function(layer) {
      if (layer.selected) {
        fileSaver(new Blob([JSON.stringify(layer.geojson)], {
            type: 'text/plain;charset=utf-8'
        }), layer.name + '.geojson')
      }
    })
  },
  selectAll: function() {
    this.editFeatures(this.layers, function(gj, layer) {
      if (layer.selected) {
        gj.selected = true
      }
      return gj
    })
    this.updateLayers(this.layers)
  },
  deselectAll: function() {
    this.editFeatures(this.layers, function(gj, layer) {
      if (layer.selected) {
        gj.selected = false
      }
      return gj
    })
    this.updateLayers(this.layers)
  },
  editFeature: function() {
    this.layers.forEach(function(layer) {
      if (layer.selected) {
        if (layer.editing) {
          layer.editing = false
        } else {
          layer.editing = true
        }
      }
    })
    this.updateLayers(this.layers)
  },
  deleteFeature: function() {
    this.editFeatures(this.layers, function(gj, layer) {
      if (layer.selected && gj.selected) {
        return false
      } else return gj
    })
    this.updateLayers(this.layers)
  },
  buffer: function() {
    var self = this
    this.getDistance(function(err, distance) {
      self.editFeatures(self.layers, function(gj) {
        if (gj.selected) {
          var _gj = turfbuffer(gj, distance, false)
          _gj.selected = true
          return _gj
        } else return gj
      })
    })
  },
  simplify: function() {
    var self = this
    this.getTolerance(function(err, tolerance) {
      self.editFeatures(self.layers, function(gj) {
        if (gj.selected) {
          var _gj = turfsimplify(gj, tolerance, false)
          _gj.selected = true
          return _gj
        } else return gj
      })
    })
  },
  flip: function() {
    var self = this
    self.editFeatures(self.layers, function(gj) {
      if (gj.selected) {
        var _gj = turfflip(gj)
        _gj.selected = true
        return _gj
      } else return gj
    })
  },
  explode: function() {
    var self = this
    self.editFeatures(self.layers, function(gj) {
      if (gj.selected) {
        var _gj = turfexplode(gj)
        return _gj
      } else return gj
    })
  },
  combine: function() {

  },
  //make feature collection from selected features
  merge: function() {
    var self = this
    this.layers.forEach(function(layer) {
      if (layer.selected) {
        var fc = gjutils.newFeatureCollection()
        var newFeatures = []
        if (layer.geojson.type === 'FeatureCollection') {
          for (var i = 0; i < layer.geojson.features.length; i++) {
            if (layer.geojson.features[i].selected) {
              fc.features.push(layer.geojson.features[i])
            } else {
              newFeatures.push(layer.geojson.features[i])
            }
          }
          newFeatures.push(turfmerge(fc))
          layer.geojson.features = newFeatures
          if (layer.mapLayer) {
            layer.mapLayer.clearLayers()
            if (layer.geojson) layer.mapLayer.addData(layer.geojson)
          }
        }
      }
    })
    this.updateLayers(this.layers)
  },
  quantile: function() {
    var self = this
    this.layers.forEach(function(layer) {
      if (layer.selected) {
        var breaks = turfquantile(layer.geojson, 'population', [25, 50, 75, 99])
        console.log(breaks)
      }
    })
  },
  createHexGrid: function() {
    var self = this
    var bbox = [-96,31,-84,40];
    var cellWidth = 50;
    var units = 'miles';
    var hexgrid = turfhexgrid(bbox, cellWidth, units)
    var newLayer = defaultLayer.generate()
    newLayer.geojson = hexgrid
    this.addLayer(newLayer)
  },
  zoomToLayer: function() {
    this.layers.forEach(function(layer) {
      layer.zoomTo = layer.selected ? true : false
    })
    this.updateLayers(this.layers)
  }
}

module.exports = new VectorTools()