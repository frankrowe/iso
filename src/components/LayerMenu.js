import React from 'react';
import vectorTools from '../utils/vectorTools';
import Modals from './Modals';
import ToolbarItem from './ToolbarItem';
import ToolbarSubmenu from './ToolbarSubmenu';
import ToolbarDropdown from './ToolbarDropdown';
import LayerActions from '../actions/LayerActions';
import LayerStore from '../stores/LayerStore';
import defaultLayer from '../utils/DefaultLayer';
import layerSaver from '../utils/LayerSaver';

class Undo extends React.Component {
  onClick = () => {
    LayerActions.undo();
  };

  render() {
    let active = LayerStore.getUndoLength() > 0;
    return <ToolbarItem text={'Undo'} onClick={this.onClick} active={active} />;
  }
}

class RenameLayer extends React.Component {
  onClick = () => {
    let layer = LayerStore.getSelected();
    if (layer) {
      Modals.getName(layer.name, function(err, name) {
        LayerActions.update(layer.id, { name: name });
      });
    }
  };

  render() {
    let active = this.props.config.oneLayer;
    return <ToolbarItem text={'Rename Layer'} onClick={this.onClick} active={active} />;
  }
}

class Combine extends React.Component {
  onClick = () => {
    vectorTools.combine(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.numVector >= 2;
    return <ToolbarItem text={'Combine'} onClick={this.onClick} active={active} />;
  }
}

class Style extends React.Component {
  onClick = () => {
    let layer = LayerStore.getSelected();
    if (layer) {
      Modals.getStyle(layer.style, function(err, style) {
        let newStyle = vectorTools.updateStyle(layer, style);
        LayerActions.update(layer.id, { style: newStyle });
      });
    }
  };

  render() {
    let active = this.props.config.oneLayer && this.props.config.vector;
    return <ToolbarItem text={'Style'} onClick={this.onClick} active={active} />;
  }
}

class NewEmptyLayer extends React.Component {
  onClick = () => {
    let newLayer = defaultLayer.generate();
    newLayer.vector = true;
    LayerActions.importLayer(newLayer);
  };

  render() {
    let active = true;
    return <ToolbarItem text={'Vector Layer'} onClick={this.onClick} active={active} />;
  }
}

class NewLayerFromSelection extends React.Component {
  onClick = () => {
    let newLayer = defaultLayer.generate();
    newLayer.vector = true;
    newLayer.geojson = vectorTools.layerFromSelection(LayerStore.getAll());
    LayerActions.importLayer(newLayer);
  };

  render() {
    let active = this.props.config.oneFeature || this.props.config.multiFeature;
    return (
      <ToolbarItem text={'Vector Layer From Selection'} onClick={this.onClick} active={active} />
    );
  }
}

class Create extends React.Component {
  render() {
    let active = true;
    let submenu = [
      <NewEmptyLayer {...this.props} key={'NewEmptyLayer'} />,
      <NewLayerFromSelection {...this.props} key={'NewLayerFromSelection'} />,
    ];
    return <ToolbarSubmenu text={'Create'} submenu={submenu} active={active} />;
  }
}

class SaveAs extends React.Component {
  render() {
    let active = true;
    let submenu = [
      <SaveAsGeoJSON {...this.props} key={'saveAsGeoJSON'} />,
      <SaveAsKML {...this.props} key={'SaveAsKML'} />,
      <SaveAsWKT {...this.props} key={'SaveAsWKT'} />,
      <SaveAsCSV {...this.props} key={'SaveAsCSV'} />,
      <SaveAsShp {...this.props} key={'saveAsShp'} />,
    ];
    return <ToolbarSubmenu text={'Save'} submenu={submenu} active={active} />;
  }
}

class SaveAsGeoJSON extends React.Component {
  onClick = () => {
    layerSaver.geojson();
  };

  render() {
    let active = this.props.config.oneLayer && this.props.config.vector;
    return <ToolbarItem text={'GeoJSON'} onClick={this.onClick} active={active} />;
  }
}

class SaveAsKML extends React.Component {
  onClick = () => {
    layerSaver.kml();
  };

  render() {
    let active = this.props.config.oneLayer && this.props.config.vector;
    return <ToolbarItem text={'KML'} onClick={this.onClick} active={active} />;
  }
}

class SaveAsWKT extends React.Component {
  onClick = () => {
    layerSaver.wkt();
  };

  render() {
    let active = this.props.config.oneLayer && this.props.config.vector;
    return <ToolbarItem text={'WKT'} onClick={this.onClick} active={active} />;
  }
}

class SaveAsCSV extends React.Component {
  onClick = () => {
    layerSaver.csv();
  };

  render() {
    let active = this.props.config.oneLayer && this.props.config.vector;
    return <ToolbarItem text={'CSV (points)'} onClick={this.onClick} active={active} />;
  }
}

class SaveAsShp extends React.Component {
  onClick = () => {
    layerSaver.shp();
  };

  render() {
    let active = this.props.config.oneLayer && this.props.config.vector;
    return <ToolbarItem text={'Shapefile'} onClick={this.onClick} active={active} />;
  }
}

class ZoomToLayer extends React.Component {
  onClick = () => {
    vectorTools.zoomToLayer(LayerStore.getAll());
  };

  render() {
    let active = this.props.config.oneLayer || this.props.config.multiLayer;
    return <ToolbarItem text={'Zoom To Layer'} onClick={this.onClick} active={active} />;
  }
}

class LayerMenu extends React.Component {
  render() {
    //var active = this.props.config.oneLayer  || this.props.config.multiLayer
    let active = true;
    let submenu = [
      <Undo {...this.props} key={'undo'} />,
      <Create {...this.props} key={'Create'} />,
      <SaveAs {...this.props} key={'saveAs'} />,
      <RenameLayer {...this.props} key={'renameLayer'} />,
      <Style {...this.props} key={'style'} />,
      <Combine {...this.props} key={'combine'} />,
      <ZoomToLayer {...this.props} key={'zoomToLayer'} />,
    ];
    return <ToolbarDropdown text={'Layer'} submenu={submenu} active={active} />;
  }
}

export default LayerMenu;
