import React from 'react';
import Modals from './Modals';
import ToolbarItem from './ToolbarItem';
import ToolbarDropdown from './ToolbarDropdown';
import LayerStore from '../stores/LayerStore';
import vectorTools from '../utils/vectorTools';

class SelectAll extends React.Component {
  onClick = () => {
    vectorTools.selectAll(LayerStore.getAllSelected());
  };

  render() {
    let active =
      (this.props.config.oneLayer || this.props.config.multiLayer) && this.props.config.vector;
    return <ToolbarItem text={'Select All'} onClick={this.onClick} active={active} />;
  }
}

class DeselectAll extends React.Component {
  onClick = () => {
    vectorTools.deselectAll(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.oneFeature || this.props.config.multiFeature;
    return <ToolbarItem text={'Deselect All'} onClick={this.onClick} active={active} />;
  }
}

class SelectPoints extends React.Component {
  onClick = () => {
    vectorTools.selectPoints(LayerStore.getAllSelected());
  };

  render() {
    let active =
      (this.props.config.oneLayer || this.props.config.multiLayer) && this.props.config.vector;
    return <ToolbarItem text={'Select Points'} onClick={this.onClick} active={active} />;
  }
}

class SelectLines extends React.Component {
  onClick = () => {
    vectorTools.selectLines(LayerStore.getAllSelected());
  };

  render() {
    let active =
      (this.props.config.oneLayer || this.props.config.multiLayer) && this.props.config.vector;
    return <ToolbarItem text={'Select Lines'} onClick={this.onClick} active={active} />;
  }
}

class SelectPolygons extends React.Component {
  onClick = () => {
    vectorTools.selectPolygons(LayerStore.getAllSelected());
  };

  render() {
    let active =
      (this.props.config.oneLayer || this.props.config.multiLayer) && this.props.config.vector;
    return <ToolbarItem text={'Select Polygons'} onClick={this.onClick} active={active} />;
  }
}

class SelectBox extends React.Component {
  onClick = () => {
    vectorTools.selectBoxToggle(LayerStore.getAllSelected());
  };

  render() {
    let active =
      (this.props.config.oneLayer || this.props.config.multiLayer) && this.props.config.vector;
    let icon = false;
    for (let id in this.props.layers) {
      if (this.props.layers[id].selectBox) {
        icon = <i className="fa fa-check" />;
      }
    }
    return <ToolbarItem text={'Select Box'} icon={icon} onClick={this.onClick} active={active} />;
  }
}

class SelectMenu extends React.Component {
  render() {
    let active = true;
    let submenu = [
      <SelectAll key={'select'} {...this.props} />,
      <DeselectAll key={'deselect'} {...this.props} />,
      <SelectBox key={'selectBox'} {...this.props} />,
      <SelectPoints key={'SelectPoints'} {...this.props} />,
      <SelectLines key={'SelectLines'} {...this.props} />,
      <SelectPolygons key={'SelectPolygons'} {...this.props} />,
    ];
    return <ToolbarDropdown text={'Select'} submenu={submenu} active={active} />;
  }
}

export default SelectMenu;
