import React from 'react';
import gjutils from '../utils/gjutils';
import LayerMenu from './LayerMenu';
import ViewMenu from './ViewMenu';
import FeatureMenu from './FeatureMenu';
import SelectMenu from './SelectMenu';
import HelpMenu from './HelpMenu';

class Toolbar extends React.Component {
  findActive = () => {
    let config = {
      nothing: true,
      oneLayer: false,
      multiLayer: false,
      noFeature: true,
      oneFeature: false,
      multiFeature: false,
      point: false,
      poly: false,
      line: false,
      numPoints: 0,
      numPolys: 0,
      numLines: 0,
      multipoint: false,
      multipoly: false,
      multiline: false,
      vector: false,
      tile: false,
      numVector: 0,
    };
    let selected = _.where(this.props.layers, { selected: true });
    let selectedFeatures = [];
    selected.forEach(function(layer) {
      layer.geojson.features.forEach(function(feature) {
        if (feature.selected) {
          selectedFeatures.push(feature);
          if (feature.geometry.type === 'Point') {
            config.numPoints += 1;
            if (config.point) config.multipoint = true;
            config.point = true;
          } else if (feature.geometry.type === 'Polygon') {
            config.numPolys += 1;
            if (config.poly) config.multipoly = true;
            config.poly = true;
          } else if (feature.geometry.type === 'LineString') {
            config.numLines += 1;
            if (config.line) config.multiline = true;
            config.line = true;
          }
        }
      });
    });
    if (selected.length === 0) {
      config.nothing = true;
    }
    if (selected.length === 1) {
      config.oneLayer = selected[0];
    }
    if (selected.length > 1) {
      config.multiLayer = true;
    }

    let vector = _.where(this.props.layers, { vector: true });
    config.numVector = vector.length;

    let totalSelectedFeatures = 0;
    for (let key in this.props.layers) {
      let layer = this.props.layers[key];
      totalSelectedFeatures += gjutils.findSelectedCount(layer.geojson);
      if (layer.selected) {
        if (layer.vector) {
          config.vector = true;
        }
        if (layer.tile) {
          config.tile = true;
        }
      }
    }
    if (totalSelectedFeatures === 1) {
      config.oneFeature = true;
    }
    if (totalSelectedFeatures > 1) {
      config.multiFeature = true;
    }
    return config;
  };

  render() {
    let config = this.findActive();
    return (
      <div className="toolbar">
        <h2>iso</h2>
        <LayerMenu {...this.props} config={config} />
        <FeatureMenu {...this.props} config={config} />
        <ViewMenu {...this.props} config={config} />
        <SelectMenu {...this.props} config={config} />
        <HelpMenu />
      </div>
    );
  }
}

export default Toolbar;
