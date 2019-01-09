import React from 'react';
import Color from 'color';
import palette from '../utils/palette';
import LayerActions from '../actions/LayerActions';
import vectorTools from '../utils/vectorTools';
import Modals from './Modals';

class Layer extends React.Component {
  state = {
    dragEnter: false,
  };

  onClick = e => {
    if (e.target.className === 'selector') {
      let update = {};
      update.selected = !this.props.layer.selected;
      if (!update.selected) {
        update.editing = false;
        update.editGeoJSON = false;
        update.viewAttributes = false;
      }
      LayerActions.update(this.props.layer.id, update);
    }
  };

  colorClick = e => {
    let self = this;
    Modals.getStyle(this.props.layer.style, function(err, style) {
      let newStyle = vectorTools.updateStyle(self.props.layer, style);
      LayerActions.update(self.props.layer.id, { style: newStyle });
    });
  };

  onChange = e => {
    let update = {};
    update.enabled = !this.props.layer.enabled;
    //if (!update.enabled) update.selected = false
    LayerActions.update(this.props.layer.id, update);
  };

  onDragStart = e => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text', this.props.layer.order.toString());
  };

  onDragEnter = e => {
    this.setState({ dragEnter: true });
    e.preventDefault();
  };

  onDragOver = e => {
    e.preventDefault();
  };

  onDragLeave = () => {
    this.setState({ dragEnter: false });
  };

  onDrop = e => {
    this.setState({ dragEnter: false });
    LayerActions.reorder(+e.dataTransfer.getData('text'), this.props.layer.order);
  };

  onDragEnd = () => {};

  render() {
    let layerStyle = {
      color: this.props.layer.selected ? 'white' : palette.light,
      textDecoration: this.props.layer.selected ? 'underline' : 'none',
    };
    let backgroundColor = palette.dark;
    if (this.state.dragEnter) {
      backgroundColor = 'red';
    }

    layerStyle.backgroundColor = backgroundColor;

    let swatchBackgroundColor = Color(this.props.layer.style.fillColor).rgb();
    swatchBackgroundColor.a = this.props.layer.style.fillOpacity;
    swatchBackgroundColor = Color(swatchBackgroundColor).rgbString();

    let borderColor = Color(this.props.layer.style.color).rgb();
    borderColor.a = this.props.layer.style.opacity;
    borderColor = Color(borderColor).rgbString();

    let swatchStyle = {
      backgroundColor: swatchBackgroundColor,
      borderColor: borderColor,
      borderWidth: this.props.layer.style.weight,
    };

    let swatch = false;
    if (this.props.layer.vector) {
      swatch = (
        <div className="swatch-wrap">
          <div className="color-swatch" style={swatchStyle} onClick={this.colorClick} />
        </div>
      );
    }
    let selector = (
      <img
        className="selector"
        onClick={this.onClick}
        src={this.props.layer.selected ? 'img/selected.png' : 'img/unselected.png'}
      />
    );
    return (
      <div
        className="layer"
        style={layerStyle}
        draggable="true"
        onDragStart={this.onDragStart}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDragEnd={this.onDragEnd}
        onDrop={this.onDrop}
      >
        <input
          type="checkbox"
          ref="checkbox"
          checked={this.props.layer.enabled}
          onChange={this.onChange}
        />
        <span className="layer-name">{this.props.layer.name}</span>
        {selector}
        {swatch}
      </div>
    );
  }
}

class LayerList extends React.Component {
  render() {
    let self = this;
    let layerListStyle = {
      width: Object.keys(this.props.layers).length > 0 ? 200 : 0,
    };
    let _layers = [];
    let layers = _.values(this.props.layers);
    layers = _.sortBy(layers, 'order');
    layers.forEach(function(layer, idx) {
      _layers.push(<Layer layer={layer} key={layer.id} idx={idx} />);
    });
    return (
      <div className="layer-list" style={layerListStyle}>
        {_layers}
      </div>
    );
  }
}

export default LayerList;
