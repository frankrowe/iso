var React = require('react')
  , Toolbar = require('./Toolbar.jsx')
  , AddLayers = require('./AddLayers.jsx')
  , LayerList = require('./LayerList.jsx')
  , WorkSpace = require('./WorkSpace.jsx')
  , AttributeTable = require('./AttributeTable.jsx')
  , Editor = require('./Editor.jsx')
  , MessageBar = require('./MessageBar.jsx')
  , LayerStore = require('../stores/LayerStore')

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getLayerState() {
  return {
    layers: LayerStore.getAll()
  }
}

var UGISApp = React.createClass({

  getInitialState: function() {
    return {
      layers: LayerStore.getAll(),
      error: false
    }
  },

  updateError: function(error) {
    this.setState({error: error})
  },

  componentDidMount: function() {
    LayerStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    LayerStore.removeChangeListener(this._onChange)
  },

  /**
   * @return {object}
   */
  render: function() {
    console.log('render UGISApp')
    var editor = false
      , attributeTable = false
    var editLayer = _.findWhere(this.state.layers, {editGeoJSON: true})
    if (editLayer) {
      editor = <Editor layer={editLayer} updateError={this.updateError}/>
    }
    var attributesLayer = _.findWhere(this.state.layers, {viewAttributes: true})
    if (attributesLayer) {
      attributeTable = <AttributeTable layer={attributesLayer} />
    }
    return (
      <div className="app">
        <Toolbar layers={this.state.layers}/>
        <div className="flex-row">
          <AddLayers />
          <LayerList layers={this.state.layers} />
          <div className="right-pane">
            <WorkSpace layers={this.state.layers} />
            {attributeTable}
          </div>
          {editor}
        </div>
        <MessageBar layers={this.state.layers} error={this.state.error}/>
      </div>
    )
  },

  /**
   * Event handler for 'change' events coming from the LayerStore
   */
  _onChange: function() {
    this.setState({
      layers: LayerStore.getAll()
    })
  }

})

module.exports = UGISApp;