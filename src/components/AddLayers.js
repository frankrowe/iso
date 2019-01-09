import React from 'react';
import ReactDOM from 'react-dom';
import LayerActions from '../actions/LayerActions';
import LayerStore from '../stores/LayerStore';
import Tooltip from './Tooltip';
import palette from '../utils/palette';
import readFile from '../utils/readfile';
import defaultLayer from '../utils/DefaultLayer';
import Modals from './Modals';
import normalize from 'geojson-normalize';
import layerSaver from '../utils/LayerSaver';

class LayerButton extends React.Component {
  state = {
    open: false,
  };

  onMouseEnter = e => {
    this.setState({ open: true });
  };

  onMouseLeave = e => {
    this.setState({ open: false });
  };

  render() {
    let tooltip;
    if (this.state.open) {
      tooltip = <Tooltip text={this.props.tooltip} />;
    }
    let className = 'add-layer-item';
    if (!this.props.active) {
      className += ' disabled';
    }
    return (
      <div
        className={className}
        ref="addLayer"
        onClick={this.props.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <img src={this.props.img} />
        {tooltip}
      </div>
    );
  }
}

class AddLayerButton extends React.Component {
  onClick = e => {
    let form = ReactDOM.findDOMNode(this.refs.addFile);
    form.click();
  };

  onChange = e => {
    let self = this;
    let form = ReactDOM.findDOMNode(this.refs.addFile);
    let files = form.files;
    if (!(files && files[0])) return;
    readFile.readAsText(files[0], function(err, text) {
      readFile.readFile(files[0], text, function(err, gj, warning) {
        if (gj && gj.features) {
          let newLayer = defaultLayer.generate();
          newLayer.geojson = normalize(gj);
          newLayer.fileName = files[0].name;
          newLayer.name = files[0].name.split('.')[0];
          newLayer.vector = true;
          LayerActions.importLayer(newLayer);
        }
      });
    });
  };

  render() {
    let style = { display: 'none' };
    return (
      <div>
        <LayerButton
          img={'img/AddVectorLayer.svg'}
          tooltip={'Import Vector Layer'}
          onClick={this.onClick}
          active={true}
        />
        <input ref="addFile" type="file" name="addFile" style={style} onChange={this.onChange} />
      </div>
    );
  }
}

class NewLayerButton extends React.Component {
  onClick = e => {
    let newLayer = defaultLayer.generate();
    newLayer.vector = true;
    LayerActions.importLayer(newLayer);
  };

  render() {
    return (
      <LayerButton
        img={'img/NewVectorLayer.svg'}
        tooltip={'New Vector Layer'}
        onClick={this.onClick}
        active={true}
      />
    );
  }
}

class AddTileLayerButton extends React.Component {
  onClick = e => {
    let self = this;
    Modals.getTileURL(function(err, url) {
      let newLayer = defaultLayer.generate();
      newLayer.tile = true;
      newLayer.vector = false;
      newLayer.tileURL = url;
      LayerActions.importLayer(newLayer);
    });
  };

  render() {
    return (
      <LayerButton
        img={'img/AddRasterLayer.svg'}
        tooltip={'New Tile Layer'}
        onClick={this.onClick}
        active={true}
      />
    );
  }
}

class RemoveLayerButton extends React.Component {
  onClick = () => {
    LayerActions.destroySelected();
  };

  render() {
    let layers = LayerStore.getAllSelected();
    this.active = _.keys(layers).length > 0;
    return (
      <LayerButton
        img={'img/RemoveLayer.svg'}
        tooltip={'Remove Selected Layers'}
        onClick={this.onClick}
        active={this.active}
      />
    );
  }
}

class SaveLayerButton extends React.Component {
  onClick = () => {
    let self = this;
    if (!this.active) {
      return;
    }
    Modals.getSaveType(function(err, saveType) {
      switch (saveType) {
        case 'geojson':
          layerSaver.geojson();
          break;
        case 'kml':
          layerSaver.kml();
          break;
        case 'csv':
          layerSaver.csv();
          break;
        case 'wkt':
          layerSaver.wkt();
          break;
        case 'shp':
          layerSaver.shp();
          break;
      }
    });
  };

  render() {
    let layers = LayerStore.getAllSelected();
    this.active = _.keys(layers).length > 0;
    return (
      <LayerButton
        img={'img/SaveLayer.svg'}
        tooltip={'Save Selected Layers'}
        onClick={this.onClick}
        active={this.active}
      />
    );
  }
}

class AddLayers extends React.Component {
  render() {
    return (
      <div className="add-layers">
        <NewLayerButton />
        <AddLayerButton />
        <AddTileLayerButton />
        <RemoveLayerButton />
        <SaveLayerButton />
      </div>
    );
  }
}

export default AddLayers;
