var React = require('react')
  , Toolbar = require('./Toolbar.jsx')
  , AddLayers = require('./AddLayers.jsx')
  , LayerList = require('./LayerList.jsx')
  , WorkSpace = require('./WorkSpace.jsx')
  , AttributeTable = require('./AttributeTable.jsx')
  , Editor = require('./Editor.jsx')
  , MessageBar = require('./MessageBar.jsx')
  , LayerStore = require('../stores/LayerStore')

function getLayerState() {
  return {
    layers: LayerStore.getAll()
  }
}

var editor = false
  , attributeTable = false

var UGISApp = React.createClass({

  getInitialState: function() {
    return {
      layers: LayerStore.getAll(),
      error: false,
      baseMap: 'streets'
    }
  },

  updateError: function(error) {
    this.setState({error: error})
  },

  updateBaseMap: function(id) {
    this.setState({baseMap: id})
  },

  componentDidMount: function() {
    LayerStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    LayerStore.removeChangeListener(this._onChange)
  },

  componentWillUpdate: function(nextProps, nextState) {
    var editLayer = _.findWhere(nextState.layers, {editGeoJSON: true})
    if (editLayer) {
      editor = <Editor layer={editLayer} updateError={this.updateError}/>
    } else {
      editor = false
    }

    var attributesLayer = _.findWhere(nextState.layers, {viewAttributes: true})
    if (attributesLayer) {
      attributeTable = <AttributeTable layer={attributesLayer} />
    } else {
      attributeTable = false
    }
  },

  render: function() {
    return (
      <div className="app">
        <Toolbar layers={this.state.layers} updateError={this.updateError} updateBaseMap={this.updateBaseMap} baseMap={this.state.baseMap}/>
        <div className="flex-row">
          <AddLayers />
          <LayerList layers={this.state.layers} />
          <div className="right-pane">
            <WorkSpace layers={this.state.layers} baseMap={this.state.baseMap}/>
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

module.exports = UGISApp