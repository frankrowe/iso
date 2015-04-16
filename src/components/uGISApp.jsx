var React = require('react')
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

var appStyle = {
  backgroundColor: palette.darkest
}

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getLayerState() {
  console.log(LayerStore.getAll())
  return {
    layers: LayerStore.getAll()
  };
}

var UGISApp = React.createClass({

  getInitialState: function() {
    console.log('getInitialState')
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
        <Toolbar layers={this.state.layers} />
        <div className="flex-row">
          <AddLayers />
          <LayerList layers={this.state.layers} />
          <div className="right-pane">
            <WorkSpace layers={this.state.layers} />
          </div>
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

module.exports = UGISApp;