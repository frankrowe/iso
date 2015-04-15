var React = require('react')
  , Toolbar = require('./Toolbar.jsx')
  , AddLayers = require('./AddLayers.jsx')
  , LayerList = require('./LayerList.jsx')
  , WorkSpace = require('./WorkSpace.jsx')
  , AttributeTable = require('./AttributeTable.jsx')
  , Editor = require('./Editor.jsx')
  , MessageBar = require('./MessageBar.jsx')
  , palette = require('../utils/palette')
  , vectorTools = require('../utils/VectorTools')
  , gjutils = require('../utils/gjutils')
  , pkg = require('../../package.json')

var appStyle = {
  backgroundColor: palette.darkest
}

var headerStyle = {
  backgroundColor: palette.dark,
  borderColor: palette.lightest
}

var App = React.createClass({
  getInitialState: function() {
    return {
      layers: [],
      message: '0 layers added.',
      error: false
    }
  },
  componentDidMount: function() {
    vectorTools.updateLayers = this.updateLayers
    vectorTools.addLayer = this.addLayer
  },
  layerMessage: function() {
    var message = ''
    if (this.state.layers.length === 0) {
      message = '0 layers added.'
    } else {
      var selected = _.where(this.state.layers, {selected: true})
      if (selected.length == 0) {
        message = '0 layers selected.'
      } else if (selected.length == 1) {
        message = 'Layer "' + selected[0].name + '" selected.'
      } else {
        message = selected.length + ' layers selected.'
      }
      var selectedFeatureCount = 0
      this.state.layers.forEach(function(layer) {
        selectedFeatureCount += gjutils.findSelectedCount(layer.geojson)
      })
      message += ' ' + selectedFeatureCount + ' '
      message += (selectedFeatureCount == 1) ? 'feature selected.' : 'features selected.'
    }
    return message
  },
  findLayer: function(layer) {
    var layers = this.state.layers
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].id === layer.id) {
        return layers[i]
      }
    }
  },
  updateMessage: function(message) {
    this.setState({message: message})
  },
  updateError: function(error) {
    this.setState({error: error})
  },
  updateLayer: function(layer) {
    var layers = this.state.layers
    var l = this.findLayer(layer)
    if (l) {
      l = layer
      this.setState({
        layers: layers,
        message: this.layerMessage()
      })
    }
  },
  updateLayers: function(layers) {
    this.setState({
      layers: layers,
      message: this.layerMessage()
    })
  },
  addLayer: function(layer) {
    var self = this
    var layers = this.state.layers
    layers.push(layer)
    this.setState({
      layers: layers,
      message: this.layerMessage()
    })
  },
  removeLayers: function() {
    var layers = this.state.layers
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].selected) {
        layers[i].mapLayer.clearLayers()
        layers[i].mapLayer = null
        layers.splice(i, 1)
      }
    }
    this.setState({
      layers: layers,
      message: this.layerMessage()
    })
  },
  onSelect: function(layer) {
    var layers = this.state.layers
    var l = this.findLayer(layer)
    if (l) {
      l.selected = layer.selected
      this.setState({
        layers: layers,
        message: this.layerMessage()
      })
    }
  },
  onEnable: function(layer) {
    var layers = this.state.layers
    var l = this.findLayer(layer)
    if (l) {
      l.enabled = layer.enabled
      this.setState({
        layers: layers,
        message: this.layerMessage()
      })
    }
  },
  render: function() {
    console.log('render App')
    var self = this
    vectorTools.setLayers(this.state.layers)
    var editor = false
    this.state.layers.forEach(function(l) {
      if (l.editGeoJSON) {
        editor = <Editor
          layer={l}
          updateLayer={self.updateLayer}
          updateMessage={self.updateMessage}
          updateError={self.updateError} />
      }
    })
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
          />
          <div className="right-pane">
            <WorkSpace
              layers={this.state.layers}
              updateLayer={this.updateLayer}
            />
            <AttributeTable
              layers={this.state.layers}
              updateLayer={this.updateLayer}
            />
          </div>
          {editor}
        </div>
        <MessageBar message={this.state.message} error={this.state.error}/>
      </div>
    )
  }
})

module.exports = App