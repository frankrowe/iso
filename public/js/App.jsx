var React = require('react')
  , AddLayers = require('./AddLayers.jsx')
  , LayerList = require('./LayerList.jsx')
  , WorkSpace = require('./WorkSpace.jsx')
  , hexagon = require('./hexagon.js')

var App = React.createClass({
  getInitialState: function() {
    return {
      workSpaceWidth: 0,
      layers: [{name: 'Test Layer', geojson: hexagon}]
    }
  },
  handleResize: function(e) {
    var workSpaceWidth = window.innerWidth - React.findDOMNode(this.refs.addlayers).offsetWidth - React.findDOMNode(this.refs.layerlist).offsetWidth
    this.setState({workSpaceWidth: workSpaceWidth})
  },
  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  makeMap: function() {
    var self = this
    this.map = L.map(this.refs.workspace.getDOMNode(), {
      attributionControl: false
    }).setView([38, -76], 6)
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png').addTo(this.map)
    this.workingLayers = L.layerGroup()
    this.state.layers.forEach(function(layer) {
      layer.mapLayer = L.geoJson(layer.geojson).addTo(self.map)
      self.workingLayers.addLayer(layer.mapLayer)
    })
    this.map.addLayer(this.workingLayers)
  },
  addLayer: function(layer) {
    var layers = this.state.layers
    layers.push({name: 'New Layer'})
    this.setState({layers: layers})
  },
  render: function() {
    var workSpaceWidth = this.state.workSpaceWidth + 'px'
    return (
      <div className="app">
        <AddLayers ref="addlayers" addLayer={this.addLayer}/>
        <LayerList ref="layerlist" layers={this.state.layers}/>
        <WorkSpace width={workSpaceWidth} layers={this.state.layers} ref="workspace"/>
      </div>
    )
  }
})

module.exports = App