import React from 'react';
import Toolbar from './Toolbar';
import AddLayers from './AddLayers';
import LayerList from './LayerList';
import WorkSpace from './WorkSpace';
//import AttributeTable from './AttributeTable';
import Editor from './Editor';
import MessageBar from './MessageBar';
import LayerStore from '../stores/LayerStore';
import defaultLayer from '../utils/DefaultLayer';
import LayerActions from '../actions/LayerActions';

function getLayerState() {
  return {
    layers: LayerStore.getAll(),
  };
}

let editor = false,
  attributeTable = false;

class App extends React.Component {
  state = {
    layers: LayerStore.getAll(),
    error: false,
    baseMap: 'streets',
  };

  updateError = error => {
    this.setState({ error: error });
  };

  updateBaseMap = id => {
    this.setState({ baseMap: id });
  };

  componentDidMount() {
    LayerStore.addChangeListener(this._onChange);
    let newLayer = defaultLayer.generate();
    newLayer.vector = true;
    newLayer.name = 'Default Layer';
    newLayer.editGeoJSON = true;
    newLayer.editing = true;
    LayerActions.importLayer(newLayer);
  }

  componentWillUnmount() {
    LayerStore.removeChangeListener(this._onChange);
  }

  componentWillUpdate(nextProps, nextState) {
    let editLayer = _.findWhere(nextState.layers, { editGeoJSON: true });
    if (editLayer) {
      editor = <Editor layer={editLayer} updateError={this.updateError} />;
    } else {
      editor = false;
    }

    let attributesLayer = _.findWhere(nextState.layers, { viewAttributes: true });
    // if (attributesLayer) {
    //   //attributeTable = <AttributeTable layer={attributesLayer} />;
    // } else {
    attributeTable = false;
    //}
  }

  render() {
    return (
      <div className="app">
        <Toolbar
          layers={this.state.layers}
          updateError={this.updateError}
          updateBaseMap={this.updateBaseMap}
          baseMap={this.state.baseMap}
        />
        <div className="flex-row">
          <AddLayers />
          <LayerList layers={this.state.layers} />
          <div className="right-pane">
            <WorkSpace layers={this.state.layers} baseMap={this.state.baseMap} />
            {attributeTable}
            {editor}
          </div>
        </div>
        <MessageBar layers={this.state.layers} error={this.state.error} />
      </div>
    );
  }

  /**
   * Event handler for 'change' events coming from the LayerStore
   */
  _onChange = () => {
    this.setState({
      layers: LayerStore.getAll(),
    });
  };
}

export default App;
