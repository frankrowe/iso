var React = require('react/addons')
  , Toolbar = require('./Toolbar.jsx')
  , AddLayers = require('./AddLayers.jsx')
  , LayerList = require('./LayerList.jsx')
  , WorkSpace = require('./WorkSpace.jsx')
  , AttributeTable = require('./AttributeTable.jsx')
  , Editor = require('./Editor.jsx')
  , MessageBar = require('./MessageBar.jsx')
  , palette = require('../utils/palette')
  , gjutils = require('../utils/gjutils')
  , pkg = require('../../package.json')
  , LayerStore = require('../stores/LayerStore')


/**
 * Retrieve the current TODO data from the TodoStore
 */
function getLayerState() {
  return {
    layers: LayerStore.getAll()
  };
}

var uGISApp = React.createClass({

  getInitialState: function() {
    return getLayerState();
  },

  componentDidMount: function() {
    LayerStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    LayerStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="app" style={appStyle}>
        <Toolbar
          layers={this.state.layers}
          vectorTools={vectorTools}
        />
        <div className="flex-row">
          <AddLayers
            addLayer={this.addLayer}
            removeLayers={this.removeLayers}
          />
          <LayerList
            layers={this.state.layers}
            updateLayer={this.updateLayer}
            swapLayers={this.swapLayers}
          />
          <div className="right-pane">
            <WorkSpace
              layers={this.state.layers}
              updateLayer={this.updateLayer}
            />
        </div>
      </div>
    )
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function() {
    this.setState(getLayerState());
  }

});

module.exports = uGISApp;