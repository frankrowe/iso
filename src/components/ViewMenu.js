import React from 'react';
import Modals from './Modals';
import ToolbarItem from './ToolbarItem';
import ToolbarSubmenu from './ToolbarSubmenu';
import ToolbarDropdown from './ToolbarDropdown';
import LayerActions from '../actions/LayerActions';
import LayerStore from '../stores/LayerStore';
import baseMaps from '../utils/BaseMaps';

class ViewAttributes extends React.Component {
  onClick = () => {
    let layer = LayerStore.getSelected();
    if (layer) {
      let update = {
        viewAttributes: !layer.viewAttributes,
      };
      LayerActions.update(layer.id, update);
    }
  };

  disabledClick = () => {
    this.props.updateError('A layer must be selected.');
  };

  render() {
    let active = this.props.config.oneLayer;
    let icon = false;
    if (this.props.config.oneLayer && this.props.config.oneLayer.viewAttributes) {
      icon = <i className="fa fa-check" />;
    }
    return (
      <ToolbarItem text={'Attribute Table'} icon={icon} onClick={this.onClick} active={active} />
    );
  }
}

class ViewGeoJSON extends React.Component {
  onClick = () => {
    let layer = LayerStore.getSelected();
    if (layer) {
      let update = {
        editGeoJSON: !layer.editGeoJSON,
      };
      LayerActions.update(layer.id, update);
    }
  };

  render() {
    let active = this.props.config.oneLayer && this.props.config.vector;
    let icon = false;
    if (this.props.config.oneLayer && this.props.config.oneLayer.editGeoJSON) {
      icon = <i className="fa fa-check" />;
    }
    return (
      <ToolbarItem text={'GeoJSON Editor'} icon={icon} onClick={this.onClick} active={active} />
    );
  }
}

class Edit extends React.Component {
  onClick = () => {
    let layer = LayerStore.getSelected();
    if (layer) {
      LayerActions.update(layer.id, { editing: !layer.editing });
    }
  };

  render() {
    let active = this.props.config.oneLayer && this.props.config.vector;
    let icon = false;
    if (this.props.config.oneLayer && this.props.config.oneLayer.editing) {
      let icon = <i className="fa fa-check" />;
    }
    return (
      <ToolbarItem text={'Drawing Toolbar'} onClick={this.onClick} icon={icon} active={active} />
    );
  }
}

class Basemap extends React.Component {
  render() {
    let active = true;
    let submenu = [];
    for (let name in baseMaps) {
      let icon = false;
      if (this.props.baseMap === name) {
        let icon = <i className="fa fa-check" />;
      }
      let update = function(name) {
        this.props.updateBaseMap(name);
      }.bind(this, name);
      submenu.push(
        <ToolbarItem
          {...this.props}
          key={name}
          text={baseMaps[name].name}
          onClick={update}
          icon={icon}
          active={true}
        />
      );
    }
    return <ToolbarSubmenu text={'Basemap'} submenu={submenu} active={active} />;
  }
}

class ViewMenu extends React.Component {
  render() {
    let active = true;
    let submenu = [
      <Basemap {...this.props} key={'Basemap'} />,
      <Edit {...this.props} key={'editFeature'} />,
      <ViewGeoJSON {...this.props} key={'viewGeoJSON'} />,
      <ViewAttributes {...this.props} key={'viewAttributes'} />,
    ];
    return <ToolbarDropdown text={'View'} submenu={submenu} active={active} />;
  }
}

export default ViewMenu;
