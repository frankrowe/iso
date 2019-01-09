import React from 'react';
import numeral from 'numeral';
import turf from 'turf';
import fileSaver from 'filesaver.js';
import defaultLayer from './DefaultLayer';
import gjutils from './gjutils';
import Modals from '../components/Modals';
import LayerActions from '../actions/LayerActions';

function VectorTools() {
  this.layers = [];
  this.oldLayers = [];
}

VectorTools.prototype = {
  editFeatures: function(layers, fn) {
    let updates = {};
    for (let id in layers) {
      let layer = layers[id];
      let newGj = gjutils.newFeatureCollection();
      for (let j = 0; j < layer.geojson.features.length; j++) {
        let newFeature = fn(_.cloneDeep(layer.geojson.features[j]), layer);
        if (newFeature) {
          if (newFeature.type === 'FeatureCollection') {
            newGj.features = newGj.features.concat(newFeature.features);
          } else {
            newGj.features.push(newFeature);
          }
        }
      }
      if (layer.mapLayer) {
        layer.mapLayer.clearLayers();
        layer.mapLayer = false;
      }
      updates[id] = {
        geojson: newGj,
      };
    }
    return updates;
  },
  selectAll: function(layers) {
    let updates = this.editFeatures(layers, function(gj, layer) {
      gj.selected = true;
      return gj;
    });
    LayerActions.updateList(updates);
  },
  selectPoints: function(layers) {
    let updates = this.editFeatures(layers, function(gj, layer) {
      if (gj.geometry.type.indexOf('Point') >= 0) {
        gj.selected = true;
      }
      return gj;
    });
    LayerActions.updateList(updates);
  },
  selectLines: function(layers) {
    let updates = this.editFeatures(layers, function(gj, layer) {
      if (gj.geometry.type.indexOf('Line') >= 0) {
        gj.selected = true;
      }
      return gj;
    });
    LayerActions.updateList(updates);
  },
  selectPolygons: function(layers) {
    let updates = this.editFeatures(layers, function(gj, layer) {
      if (gj.geometry.type.indexOf('Polygon') >= 0) {
        gj.selected = true;
      }
      return gj;
    });
    LayerActions.updateList(updates);
  },
  deselectAll: function(layers) {
    let updates = this.editFeatures(layers, function(gj, layer) {
      gj.selected = false;
      return gj;
    });
    LayerActions.updateList(updates);
  },
  selectBoxToggle: function(layers) {
    let updates = {};
    for (let id in layers) {
      let layer = layers[id];
      updates[id] = {
        selectBox: !layer.selectBox,
      };
    }
    LayerActions.updateList(updates);
  },
  //TODO fix to support multifeatures
  selectBox: function(layers, bbox) {
    let updates = this.editFeatures(
      layers,
      function(bbox, gj, layer) {
        if (gj.geometry.type === 'Point') {
          if (turf.inside(gj, bbox)) {
            gj.selected = true;
          }
        } else if (gj.geometry.type === 'LineString') {
          for (let i = 0; i < gj.geometry.coordinates.length; i++) {
            let pt = turf.point(gj.geometry.coordinates[i]);
            if (turf.inside(pt, bbox)) {
              gj.selected = true;
            }
          }
        } else if (gj.geometry.type === 'Polygon') {
          if (turf.intersect(gj, bbox)) {
            gj.selected = true;
          }
        }
        return gj;
      }.bind(null, bbox)
    );
    LayerActions.updateList(updates);
  },
  deleteFeature: function(layers) {
    let updates = this.editFeatures(layers, function(gj, layer) {
      if (layer.selected && gj.selected) {
        return false;
      } else return gj;
    });
    LayerActions.updateList(updates);
  },
  buffer: function(layers) {
    let self = this;
    Modals.getDistance(function(err, data) {
      let updates = self.editFeatures(layers, function(gj, layer) {
        if (gj.selected) {
          let _gj = turf.buffer(gj, data.distance, data.unit);
          _gj.selected = true;
          return _gj;
        } else return gj;
      });
      LayerActions.updateList(updates);
    });
  },
  simplify: function(layers) {
    let self = this;
    Modals.getTolerance(function(err, data) {
      let updates = self.editFeatures(layers, function(gj, layer) {
        if (gj.selected) {
          let _gj = turf.simplify(gj, data.tolerance, false);
          _gj.selected = true;
          return _gj;
        } else return gj;
      });
      LayerActions.updateList(updates);
    });
  },
  flip: function(layers) {
    let updates = this.editFeatures(layers, function(gj, layer) {
      if (gj.selected) {
        let _gj = turf.flip(gj);
        _gj.selected = true;
        return _gj;
      } else return gj;
    });
    LayerActions.updateList(updates);
  },
  explode: function(layers) {
    let updates = this.editFeatures(layers, function(gj, layer) {
      if (gj.selected) {
        let _gj = turf.explode(gj);
        return _gj;
      } else return gj;
    });
    LayerActions.updateList(updates);
  },
  combine: function() {},
  //make feature collection from selected features
  merge: function(layers) {
    let self = this;
    let updates = {};
    for (let id in layers) {
      let layer = layers[id];
      let fc = gjutils.newFeatureCollection();
      let newFeatures = [];
      if (layer.geojson.type === 'FeatureCollection') {
        for (let i = 0; i < layer.geojson.features.length; i++) {
          if (layer.geojson.features[i].selected) {
            fc.features.push(layer.geojson.features[i]);
          } else {
            newFeatures.push(layer.geojson.features[i]);
          }
        }
        newFeatures.push(turf.merge(fc));
        let newGj = gjutils.newFeatureCollection();
        newGj.features = newGj.features.concat(newFeatures);
        layer.mapLayer.clearLayers();
        layer.mapLayer = false;
        updates[id] = {
          geojson: newGj,
        };
      }
    }
    LayerActions.updateList(updates);
  },
  erase: function(layers) {
    let self = this;
    let updates = {};
    for (let id in layers) {
      let layer = layers[id];
      let fc = gjutils.newFeatureCollection();
      let polys = [];
      let newFeatures = [];
      if (layer.geojson.type === 'FeatureCollection') {
        for (let i = 0; i < layer.geojson.features.length; i++) {
          if (layer.geojson.features[i].selected) {
            polys.push(layer.geojson.features[i]);
          } else {
            newFeatures.push(layer.geojson.features[i]);
          }
        }
        newFeatures.push(turf.erase(polys[0], polys[1]));
        let newGj = gjutils.newFeatureCollection();
        newGj.features = newGj.features.concat(newFeatures);
        layer.mapLayer.clearLayers();
        layer.mapLayer = false;
        updates[id] = {
          geojson: newGj,
        };
      }
    }
    LayerActions.updateList(updates);
  },
  intersect: function(layers) {
    let self = this;
    let updates = {};
    for (let id in layers) {
      let layer = layers[id];
      let fc = gjutils.newFeatureCollection();
      let polys = [];
      let newFeatures = [];
      if (layer.geojson.type === 'FeatureCollection') {
        for (let i = 0; i < layer.geojson.features.length; i++) {
          if (layer.geojson.features[i].selected) {
            polys.push(layer.geojson.features[i]);
          } else {
            newFeatures.push(layer.geojson.features[i]);
          }
        }
        newFeatures.push(turf.intersect(polys[0], polys[1]));
        let newGj = gjutils.newFeatureCollection();
        newGj.features = newGj.features.concat(newFeatures);
        layer.mapLayer.clearLayers();
        layer.mapLayer = false;
        updates[id] = {
          geojson: newGj,
        };
      }
    }
    LayerActions.updateList(updates);
  },
  quantile: function() {
    let self = this;
    this.layers.forEach(function(layer) {
      if (layer.selected) {
        let breaks = turf.quantile(layer.geojson, 'population', [25, 50, 75, 99]);
        console.log(breaks);
      }
    });
  },
  createGrid: function(type, data) {
    let grid;
    if (type === 'hex') {
      grid = turf.hexGrid(data.bbox, data.cellWidth, data.units);
    }
    if (type === 'point') {
      grid = turf.pointGrid(data.bbox, data.cellWidth, data.units);
    }
    if (type === 'square') {
      grid = turf.squareGrid(data.bbox, data.cellWidth, data.units);
    }
    if (type === 'triangle') {
      grid = turf.triangleGrid(data.bbox, data.cellWidth, data.units);
    }
    return grid;
  },
  grid: function(layer, type) {
    let self = this;
    Modals.getGrid(type, function(err, grid) {
      let fc = gjutils.newFeatureCollection();
      fc.features = fc.features.concat(layer.geojson.features);
      fc.features = fc.features.concat(grid.features);
      layer.mapLayer.clearLayers();
      layer.mapLayer = false;
      LayerActions.update(layer.id, { geojson: fc });
    });
  },
  zoomToLayer: function(layers) {
    let updates = {};
    for (let id in layers) {
      updates[id] = {
        zoomTo: layers[id].selected ? true : false,
      };
    }
    LayerActions.updateList(updates);
  },
  area: function(layers) {
    let fc = gjutils.newFeatureCollection();
    for (let id in layers) {
      let layer = layers[id];
      if (layer.geojson) {
        if (layer.geojson.features) {
          let selected = _.where(layer.geojson.features, { selected: true });
          fc.features = fc.features.concat(selected);
        }
        if (layer.geojson.feature) {
          if (layer.geojson.feature.selected) {
            fc.features.push(layer.geojson.feature);
          }
        }
      }
    }
    let area = turf.area(fc);
    let msg = '<p>Area</p><p>' + numeral(area).format('0.0000') + ' m<sup>2</sup></p>';
    vex.dialog.alert(msg);
  },
  bearing: function(layers) {
    let points = [];
    for (let id in layers) {
      let layer = layers[id];
      if (layer.geojson) {
        if (layer.geojson.features) {
          let selected = _.where(layer.geojson.features, { selected: true });
          selected.forEach(function(f) {
            if (f.geometry.type === 'Point') {
              points.push(f);
            }
          });
        }
        if (layer.geojson.feature) {
          if (layer.geojson.feature.selected) {
            if (layer.geojson.feature.geometry.type === 'Point') {
              points.push(f);
            }
          }
        }
      }
    }
    let bearing = turf.bearing(points[0], points[1]);
    let msg = '<p>Bearing</p><p>' + numeral(bearing).format('0.0000') + '&deg;';
    vex.dialog.alert(msg);
  },
  distance: function(layers) {
    let points = [];
    for (let id in layers) {
      let layer = layers[id];
      if (layer.geojson) {
        if (layer.geojson.features) {
          let selected = _.where(layer.geojson.features, { selected: true });
          selected.forEach(function(f) {
            if (f.geometry.type === 'Point') {
              points.push(f);
            }
          });
        }
        if (layer.geojson.feature) {
          if (layer.geojson.feature.selected) {
            if (layer.geojson.feature.geometry.type === 'Point') {
              points.push(layer.geojson.feature);
            }
          }
        }
      }
    }
    let bearing = turf.distance(points[0], points[1], 'miles');
    let msg = '<p>Distance</p><p>' + numeral(bearing).format('0.0000') + ' mi';
    vex.dialog.alert(msg);
  },
  lineLength: function(layers) {
    let lines = [];
    for (let id in layers) {
      let layer = layers[id];
      if (layer.geojson) {
        if (layer.geojson.features) {
          let selected = _.where(layer.geojson.features, { selected: true });
          selected.forEach(function(f) {
            if (f.geometry.type === 'LineString') {
              lines.push(f);
            }
          });
        }
        if (layer.geojson.feature) {
          if (layer.geojson.feature.selected) {
            if (layer.geojson.feature.geometry.type === 'LineString') {
              lines.push(layer.geojson.feature);
            }
          }
        }
      }
    }
    let distance = 0;
    lines.forEach(function(line) {
      distance += turf.lineDistance(line, 'miles');
    });
    let msg = '<p>Length</p><p>' + numeral(distance).format('0.0000') + ' mi';
    vex.dialog.alert(msg);
  },
  updateStyle: function(layer, style) {
    let newStyle = _.cloneDeep(layer.style);
    for (let prop in newStyle) {
      if (style[prop]) {
        newStyle[prop] = style[prop];
      }
    }
    return newStyle;
  },
  clean: function(gj) {
    gj.features = gj.features.map(function(f) {
      if (f.selected !== 'undefined') delete f.selected;
      return f;
    });
    return gj;
  },
  random: function(layer, type) {
    Modals.getRandom(function(err, data) {
      console.log(data);
      let fc = turf.random(type, data.count, {
        bbox: data.bbox,
      });
      fc.features = fc.features.concat(layer.geojson.features);
      layer.mapLayer.clearLayers();
      layer.mapLayer = false;
      LayerActions.update(layer.id, { geojson: fc });
    });
  },
  layerFromSelection: function(layers) {
    let gj = gjutils.newFeatureCollection();
    for (let key in layers) {
      let layer = layers[key];
      if (layer.geojson && layer.geojson.features) {
        layer.geojson.features.forEach(function(feature) {
          if (feature.selected) {
            gj.features.push(feature);
          }
        });
      }
    }
    return gj;
  },
  combine: function(layers) {
    let newLayer = defaultLayer.generate();
    newLayer.vector = true;
    for (let key in layers) {
      if (layers[key].vector) {
        newLayer.geojson.features = newLayer.geojson.features.concat(layers[key].geojson.features);
      }
    }
    LayerActions.importLayer(newLayer);
  },
};

export default new VectorTools();
