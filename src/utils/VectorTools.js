var React = require('react')
  , numeral = require('numeral')
  , turf = require('turf')
  , fileSaver = require('filesaver.js')
  , defaultLayer = require('./DefaultLayer')
  , gjutils =require('./gjutils')
  , Modals = require('../components/Modals.jsx')
  , LayerActions = require('../actions/LayerActions')

function VectorTools () {
  this.layers = []
  this.oldLayers = []
}

VectorTools.prototype = {
  editFeatures: function(layers, fn) {
    var updates = {}
    for (var id in layers) {
      var layer = layers[id]
      var newGj = gjutils.newFeatureCollection()
      for (var j = 0; j < layer.geojson.features.length; j++) {
        var newFeature = fn(_.cloneDeep(layer.geojson.features[j]), layer)
        if (newFeature) {
          if (newFeature.type === 'FeatureCollection') {
            newGj.features = newGj.features.concat(newFeature.features)
          } else {
            newGj.features.push(newFeature)
          }
        }
      }
      if (layer.mapLayer) {
        layer.mapLayer.clearLayers()
        layer.mapLayer = false
      }
      updates[id] = {
        geojson: newGj
      }
    }
    return updates
  },
  selectAll: function(layers) {
    var updates = this.editFeatures(layers, function(gj, layer) {
      gj.selected = true
      return gj
    })
    LayerActions.updateList(updates)
  },
  selectPoints: function(layers) {
    var updates = this.editFeatures(layers, function(gj, layer) {
      if (gj.geometry.type.indexOf('Point') >= 0) {
        gj.selected = true
      }
      return gj
    })
    LayerActions.updateList(updates)
  },
  selectLines: function(layers) {
    var updates = this.editFeatures(layers, function(gj, layer) {
      if (gj.geometry.type.indexOf('Line') >= 0) {
        gj.selected = true
      }
      return gj
    })
    LayerActions.updateList(updates)
  },
  selectPolygons: function(layers) {
    var updates = this.editFeatures(layers, function(gj, layer) {
      if (gj.geometry.type.indexOf('Polygon') >= 0) {
        gj.selected = true
      }
      return gj
    })
    LayerActions.updateList(updates)
  },
  deselectAll: function(layers) {
    var updates = this.editFeatures(layers, function(gj, layer) {
      gj.selected = false
      return gj
    })
    LayerActions.updateList(updates)
  },
  selectBoxToggle: function(layers) {
    var updates = {}
    for (var id in layers) {
      var layer = layers[id]
      updates[id] = {
        selectBox: !layer.selectBox
      }
    }
    LayerActions.updateList(updates)
  },
  //TODO fix to support multifeatures
  selectBox: function(layers, bbox) {
    var updates = this.editFeatures(layers, function(bbox, gj, layer) {
      if (gj.geometry.type === 'Point') {
        if (turf.inside(gj, bbox)) {
          gj.selected = true
        }
      } else if (gj.geometry.type === 'LineString') {
        for (var i = 0; i < gj.geometry.coordinates.length; i++) {
          var pt = turf.point(gj.geometry.coordinates[i])
          if (turf.inside(pt, bbox)) {
            gj.selected = true
          }
        }
      } else if (gj.geometry.type === 'Polygon') {
        if (turf.intersect(gj, bbox)) {
          gj.selected = true
        }
      }
      return gj
    }.bind(null, bbox))
    LayerActions.updateList(updates)
  },
  deleteFeature: function(layers) {
    var updates = this.editFeatures(layers, function(gj, layer) {
      if (layer.selected && gj.selected) {
        return false
      } else return gj
    })
    LayerActions.updateList(updates)
  },
  buffer: function(layers) {
    var self = this
    Modals.getDistance(function(err, data) {
      var updates = self.editFeatures(layers, function(gj, layer) {
        if (gj.selected) {
          var _gj = turf.buffer(gj, data.distance, data.unit)
          _gj.selected = true
          return _gj
        } else return gj
      })
      LayerActions.updateList(updates)
    })
  },
  simplify: function(layers) {
    var self = this
    Modals.getTolerance(function(err, data) {
      var updates = self.editFeatures(layers, function(gj, layer) {
        if (gj.selected) {
          var _gj = turf.simplify(gj, data.tolerance, false)
          _gj.selected = true
          return _gj
        } else return gj
      })
      LayerActions.updateList(updates)
    })
  },
  flip: function(layers) {
    var updates = this.editFeatures(layers, function(gj, layer) {
      if (gj.selected) {
        var _gj = turf.flip(gj)
        _gj.selected = true
        return _gj
      } else return gj
    })
    LayerActions.updateList(updates)
  },
  explode: function(layers) {
    var updates = this.editFeatures(layers, function(gj, layer) {
      if (gj.selected) {
        var _gj = turf.explode(gj)
        return _gj
      } else return gj
    })
    LayerActions.updateList(updates)
  },
  combine: function() {
  },
  //make feature collection from selected features
  merge: function(layers) {
    var self = this
    var updates = {}
    for (var id in layers) {
      var layer = layers[id]
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
        var newGj = gjutils.newFeatureCollection()
        newGj.features = newGj.features.concat(newFeatures)
        layer.mapLayer.clearLayers()
        layer.mapLayer = false
        updates[id] = {
          geojson: newGj
        }
      }
    }
    LayerActions.updateList(updates)
  },
  erase: function(layers) {
    var self = this
    var updates = {}
    for (var id in layers) {
      var layer = layers[id]
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
        var newGj = gjutils.newFeatureCollection()
        newGj.features = newGj.features.concat(newFeatures)
        layer.mapLayer.clearLayers()
        layer.mapLayer = false
        updates[id] = {
          geojson: newGj
        }
      }
    }
    LayerActions.updateList(updates)
  },
  intersect: function(layers) {
    var self = this
    var updates = {}
    for (var id in layers) {
      var layer = layers[id]
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
        var newGj = gjutils.newFeatureCollection()
        newGj.features = newGj.features.concat(newFeatures)
        layer.mapLayer.clearLayers()
        layer.mapLayer = false
        updates[id] = {
          geojson: newGj
        }
      }
    }
    LayerActions.updateList(updates)
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
  zoomToLayer: function(layers) {
    var updates = {}
    for (var id in layers) {
      updates[id] = {
        zoomTo: layers[id].selected ? true : false
      }
    }
    LayerActions.updateList(updates)
  },
  area: function(layers) {
    var fc = gjutils.newFeatureCollection()
    for (var id in layers) {
      var layer = layers[id]
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
    }
    var area = turf.area(fc)
    var msg = '<p>Area</p><p>' + numeral(area).format('0.0000') + ' m<sup>2</sup></p>'
    vex.dialog.alert(msg)
  },
  bearing: function(layers) {
    var points = []
    for (var id in layers) {
      var layer = layers[id]
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
    }
    var bearing = turf.bearing(points[0], points[1])
    var msg = '<p>Bearing</p><p>' + numeral(bearing).format('0.0000') + '&deg;'
    vex.dialog.alert(msg)
  },
  distance: function(layers) {
    var points = []
    for (var id in layers) {
      var layer = layers[id]
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
    }
    var bearing = turf.distance(points[0], points[1], 'miles')
    var msg = '<p>Distance</p><p>' + numeral(bearing).format('0.0000') + ' mi'
    vex.dialog.alert(msg)
  },
  lineLength: function(layers) {
    var lines = []
    for (var id in layers) {
      var layer = layers[id]
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
    }
    var distance = 0
    lines.forEach(function(line) {
      distance += turf.lineDistance(line, 'miles')
    })
    var msg = '<p>Length</p><p>' + numeral(distance).format('0.0000') + ' mi'
    vex.dialog.alert(msg)
  },
  updateStyle: function(layer, style) {
    var newStyle = _.cloneDeep(layer.style)
    for (var prop in newStyle) {
      if (style[prop]) {
        newStyle[prop] = style[prop]
      }
    }
    return newStyle
  },
  clean: function(gj) {
    gj.features = gj.features.map(function(f) {
      if (f.selected !== 'undefined') delete f.selected
        return f
    })
    return gj
  },
  random: function(layer, type) {
    Modals.getRandom(function(err, data) {
      console.log(data)
      var fc = turf.random(type, data.count, {
        bbox: data.bbox
      })
      fc.features = fc.features.concat(layer.geojson.features)
      layer.mapLayer.clearLayers()
      layer.mapLayer = false
      LayerActions.update(layer.id, {geojson: fc})
    })
  },
  layerFromSelection: function(layers) {
    var gj = gjutils.newFeatureCollection()
    for (var key in layers) {
      var layer = layers[key]
      if (layer.geojson && layer.geojson.features) {
        layer.geojson.features.forEach(function(feature) {
          if (feature.selected) {
            gj.features.push(feature)
          }
        })
      }
    }
    return gj
  }
}

module.exports = new VectorTools()