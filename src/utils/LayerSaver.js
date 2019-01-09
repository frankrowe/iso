import LayerActions from '../actions/LayerActions';
import LayerStore from '../stores/LayerStore';
import fileSaver from 'filesaver.js';
import tokml from 'tokml';
import geojson2dsv from 'geojson2dsv';
import wellknown from 'wellknown';
import shpwrite from 'shp-write';
import defaultLayer from '../utils/DefaultLayer';
import vectorTools from '../utils/vectorTools';

function LayerSaver() {}

LayerSaver.prototype.geojson = function() {
  let layers = LayerStore.getAllSelected();
  for (let id in layers) {
    let layer = layers[id];
    if (layer.selected) {
      let content = JSON.stringify(vectorTools.clean(layer.geojson));
      fileSaver(
        new Blob([content], {
          type: 'text/plain;charset=utf-8',
        }),
        layer.name + '.geojson'
      );
    }
  }
};

LayerSaver.prototype.kml = function() {
  let layers = LayerStore.getAllSelected();
  for (let id in layers) {
    let layer = layers[id];
    if (layer.selected) {
      let content = tokml(vectorTools.clean(layer.geojson));
      fileSaver(
        new Blob([content], {
          type: 'text/plain;charset=utf-8',
        }),
        layer.name + '.kml'
      );
    }
  }
};

LayerSaver.prototype.wkt = function() {
  let layers = LayerStore.getAllSelected();
  for (let id in layers) {
    let layer = layers[id];
    if (layer.selected) {
      let features = vectorTools.clean(layer.geojson).features;
      let content = features.map(wellknown.stringify).join('\n');
      fileSaver(
        new Blob([content], {
          type: 'text/plain;charset=utf-8',
        }),
        layer.name + '.wkt'
      );
    }
  }
};

LayerSaver.prototype.csv = function() {
  let layers = LayerStore.getAllSelected();
  for (let id in layers) {
    let layer = layers[id];
    if (layer.selected) {
      let content = geojson2dsv(vectorTools.clean(layer.geojson));
      fileSaver(
        new Blob([content], {
          type: 'text/plain;charset=utf-8',
        }),
        layer.name + '.csv'
      );
    }
  }
};

LayerSaver.prototype.shp = function() {
  let layers = LayerStore.getAllSelected();
  for (let id in layers) {
    let layer = layers[id];
    if (layer.selected) {
      shpwrite.download(layer.geojson);
    }
  }
};

export default new LayerSaver();
