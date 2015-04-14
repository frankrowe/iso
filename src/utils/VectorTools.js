var React = require('react')
  , numeral = require('numeral')
  , turf = require('turf')
  , fileSaver = require('filesaver.js')
  , defaultLayer = require('./DefaultLayer')
  , gjutils =require('./gjutils')
  , Modals = require('../components/Modals.jsx')

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
      afterOpen: function($vexContent) {
        React.render(<Modals.Simplify />, $vexContent.find('.vex-dialog-input').get(0))
      },
      callback: function(data) {
        if (data === false) {
          return console.log('Cancelled');
        }
        //TODO make sure tolerance is 0 - 1
        var err = false
        next(err, +data.tolerance)
      }
    })
  },
  getDistance: function(next) {
    vex.dialog.open({
      message: 'Select distance.',
      afterOpen: function($vexContent) {
        React.render(<Modals.Buffer />, $vexContent.find('.vex-dialog-input').get(0))
      },
      callback: function(data) {
        console.log(data)
        if (data === false) {
          return console.log('Cancelled');
        }
        //TODO make sure distance is number
        data.distance = +data.distance
        var err = false
        next(err, data)
      }
    })
  },
  getName: function(layername, next) {
    var dialog = vex.dialog.open({
      message: 'Enter New Layer Name',
      afterOpen: function($vexContent) {
        React.render(<Modals.Layername layername={layername}/>, $vexContent.find('.vex-dialog-input').get(0))
      },
      callback: function(data) {
        if (data === false) {
          return console.log('Cancelled')
        }
        var err = false
        next(err, data.layername)
      }
    })
  },
  renameLayer: function() {
    var self = this
    var layer = _.findWhere(self.layers, {selected: true})
    if (layer) {
      this.getName(layer.name, function(err, name) {
        layer.name = name
        self.updateLayers(self.layers)
      })
    }
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
    this.getDistance(function(err, data) {
      self.editFeatures(self.layers, function(gj) {
        if (gj.selected) {
          var _gj = turf.buffer(gj, +data.distance, data.unit)
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
          var _gj = turf.simplify(gj, tolerance, false)
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
        var _gj = turf.flip(gj)
        _gj.selected = true
        return _gj
      } else return gj
    })
  },
  explode: function() {
    var self = this
    self.editFeatures(self.layers, function(gj) {
      if (gj.selected) {
        var _gj = turf.explode(gj)
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
          newFeatures.push(turf.merge(fc))
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
  erase: function() {
    var self = this
    this.layers.forEach(function(layer) {
      if (layer.selected) {
        var fc = gjutils.newFeatureCollection()
        var polys = []
        var newFeatures = []
        if (layer.geojson.type === 'FeatureCollection') {
          for (var i = 0; i < layer.geojson.features.length; i++) {
            if (layer.geojson.features[i].selected) {
              polys.push(layer.geojson.features[i])
            } else {
              newFeatures.push(layer.geojson.features[i])
            }
          }
          newFeatures.push(turf.erase(polys[0], polys[1]))
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
  intersect: function() {
    var self = this
    this.layers.forEach(function(layer) {
      if (layer.selected) {
        var fc = gjutils.newFeatureCollection()
        var polys = []
        var newFeatures = []
        if (layer.geojson.type === 'FeatureCollection') {
          for (var i = 0; i < layer.geojson.features.length; i++) {
            if (layer.geojson.features[i].selected) {
              polys.push(layer.geojson.features[i])
            } else {
              newFeatures.push(layer.geojson.features[i])
            }
          }
          newFeatures.push(turf.intersect(polys[0], polys[1]))
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
        var breaks = turf.quantile(layer.geojson, 'population', [25, 50, 75, 99])
        console.log(breaks)
      }
    })
  },
  createHexGrid: function() {
    var self = this
    var bbox = [-96,31,-84,40];
    var cellWidth = 50;
    var units = 'miles';
    var hexgrid = turf.hexgrid(bbox, cellWidth, units)
    var newLayer = defaultLayer.generate()
    newLayer.geojson = hexgrid
    this.addLayer(newLayer)
  },
  zoomToLayer: function() {
    this.layers.forEach(function(layer) {
      layer.zoomTo = layer.selected ? true : false
    })
    this.updateLayers(this.layers)
  },
  viewAttributes: function() {
    var layer = _.findWhere(this.layers, {selected: true})
    if (layer) {
      layer.viewAttributes = true
      this.updateLayers(this.layers)
    }
  },
  closeAttributes: function() {
    var layer = _.findWhere(this.layers, {selected: true})
    if (layer) {
      layer.viewAttributes = false
      this.updateLayers(this.layers)
    }
  },
  viewGeoJSON: function() {
    var layer = _.findWhere(this.layers, {selected: true})
    if (layer) {
      vex.dialog.alert(JSON.stringify(layer.geojson))
    }
  },
  area: function() {
    var fc = gjutils.newFeatureCollection()
    this.layers.forEach(function(layer) {
      if (layer.geojson) {
        if (layer.geojson.features) {
          var selected = _.where(layer.geojson.features, {selected: true})
          fc.features = fc.features.concat(selected)
        }
        if (layer.geojson.feature) {
          if (layer.geojson.feature.selected) {
            fc.features.push(layer.geojson.feature)
          }
        }
      }
    })
    var area = turf.area(fc)
    var msg = '<p>Area</p><p>' + numeral(area).format('0.0000') + ' m<sup>2</sup></p>'
    vex.dialog.alert(msg)
  },
  bearing: function() {
    var points = []
    this.layers.forEach(function(layer) {
      if (layer.geojson) {
        if (layer.geojson.features) {
          var selected = _.where(layer.geojson.features, {selected: true})
          selected.forEach(function(f) {
            if (f.geometry.type === 'Point') {
              points.push(f)
            }
          })
        }
        if (layer.geojson.feature) {
          if (layer.geojson.feature.selected) {
            if (layer.geojson.feature.geometry.type === 'Point') {
              points.push(f)
            }
          }
        }
      }
    })
    var bearing = turf.bearing(points[0], points[1])
    var msg = '<p>Bearing</p><p>' + numeral(bearing).format('0.0000')
    vex.dialog.alert(msg)
  },
  distance: function() {
    var points = []
    this.layers.forEach(function(layer) {
      if (layer.geojson) {
        if (layer.geojson.features) {
          var selected = _.where(layer.geojson.features, {selected: true})
          selected.forEach(function(f) {
            if (f.geometry.type === 'Point') {
              points.push(f)
            }
          })
        }
        if (layer.geojson.feature) {
          if (layer.geojson.feature.selected) {
            if (layer.geojson.feature.geometry.type === 'Point') {
              points.push(layer.geojson.feature)
            }
          }
        }
      }
    })
    var bearing = turf.distance(points[0], points[1], 'miles')
    var msg = '<p>Distance</p><p>' + numeral(bearing).format('0.0000') + ' mi'
    vex.dialog.alert(msg)
  },
  lineLength: function() {
    var lines = []
    this.layers.forEach(function(layer) {
      if (layer.geojson) {
        if (layer.geojson.features) {
          var selected = _.where(layer.geojson.features, {selected: true})
          selected.forEach(function(f) {
            if (f.geometry.type === 'LineString') {
              lines.push(f)
            }
          })
        }
        if (layer.geojson.feature) {
          if (layer.geojson.feature.selected) {
            if (layer.geojson.feature.geometry.type === 'LineString') {
              lines.push(layer.geojson.feature)
            }
          }
        }
      }
    })
    var distance = 0
    lines.forEach(function(line) {
      distance += turf.lineDistance(line, 'miles')
    })
    var msg = '<p>Length</p><p>' + numeral(distance).format('0.0000') + ' mi'
    vex.dialog.alert(msg)
  }
}

module.exports = new VectorTools()