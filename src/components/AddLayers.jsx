var React = require('react')
  , ReactDOM = require('react-dom')
  , LayerActions = require('../actions/LayerActions')
  , LayerStore = require('../stores/LayerStore')
  , Tooltip = require('./Tooltip')
  , palette = require('../utils/palette')
  , readFile = require('../utils/readfile')
  , defaultLayer = require('../utils/DefaultLayer')
  , Modals = require('./Modals.jsx')
  , normalize = require('geojson-normalize')
  , layerSaver = require('../utils/LayerSaver')

var LayerButton = React.createClass({
  getInitialState: function() {
    return {
      open: false
    }
  },
  onMouseEnter: function(e) {
    this.setState({open: true})
  },
  onMouseLeave: function(e) {
    this.setState({open: false})
  },
  render: function() {
    var tooltip
    if (this.state.open) {
      tooltip = <Tooltip text={this.props.tooltip} />
    }
    var className = "add-layer-item"
    if (!this.props.active) {
      className += ' disabled'
    }
    return (
        <div className={className} ref="addLayer" onClick={this.props.onClick} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          <img src={this.props.img} />
          {tooltip}
        </div>
    )
  }
})

var AddLayerButton = React.createClass({
  onClick: function(e) {
    var form = ReactDOM.findDOMNode(this.refs.addFile)
    form.click()
  },
  onChange: function(e) {
    var self = this
    var form = ReactDOM.findDOMNode(this.refs.addFile)
    var files = form.files
    if (!(files && files[0])) return;
    readFile.readAsText(files[0], function(err, text) {
      readFile.readFile(files[0], text, function(err, gj, warning) {
        if (gj && gj.features) {
          var newLayer = defaultLayer.generate()
          newLayer.geojson = normalize(gj)
          newLayer.fileName = files[0].name
          newLayer.name = files[0].name.split('.')[0]
          newLayer.vector = true
          LayerActions.importLayer(newLayer)
        }
      })
    })
  },
  render: function() {
    var style = { display: 'none'}
    return (
      <div>
        <LayerButton img={"img/AddVectorLayer.svg"} tooltip={'Import Vector Layer'} onClick={this.onClick} active={true}/>
        <input ref="addFile" type="file" name="addFile" style={style} onChange={this.onChange}/>
      </div>
    )
  }
})

var NewLayerButton = React.createClass({
  onClick: function(e) {
    var newLayer = defaultLayer.generate()
    newLayer.vector = true
    LayerActions.importLayer(newLayer)
  },
  render: function() {
    return (
      <LayerButton img={"img/NewVectorLayer.svg"} tooltip={'New Vector Layer'} onClick={this.onClick} active={true}/>
    )
  }
})

var AddTileLayerButton = React.createClass({
  onClick: function(e) {
    var self = this
    Modals.getTileURL(function(err, url) {
      var newLayer = defaultLayer.generate()
      newLayer.tile = true
      newLayer.vector = false
      newLayer.tileURL = url
      LayerActions.importLayer(newLayer)
    })
  },
  render: function() {
    return (
      <LayerButton img={"img/AddRasterLayer.svg"} tooltip={'New Tile Layer'} onClick={this.onClick} active={true}/>
    )
  }
})

var RemoveLayerButton = React.createClass({
  onClick: function() {
    LayerActions.destroySelected()
  },
  render: function() {
    var layers = LayerStore.getAllSelected()
    this.active = _.keys(layers).length > 0
    return (
      <LayerButton img={"img/RemoveLayer.svg"} tooltip={'Remove Selected Layers'} onClick={this.onClick} active={this.active}/>
    )
  }
})

var SaveLayerButton = React.createClass({
  onClick: function() {
    var self = this
    if (!this.active) {
      return
    }
    Modals.getSaveType(function(err, saveType) {
      switch (saveType) {
        case 'geojson':
          layerSaver.geojson()
          break;
        case 'kml':
          layerSaver.kml()
          break;
        case 'csv':
          layerSaver.csv()
          break;
        case 'wkt':
          layerSaver.wkt()
          break;
        case 'shp':
          layerSaver.shp()
          break;
      }
    })
  },
  render: function() {
    var layers = LayerStore.getAllSelected()
    this.active = _.keys(layers).length > 0
    return (
      <LayerButton img={"img/SaveLayer.svg"} tooltip={'Save Selected Layers'} onClick={this.onClick} active={this.active}/>
    )
  }
})

var AddLayers = React.createClass({
  render: function() {
    return (
      <div className="add-layers">
        <NewLayerButton />
        <AddLayerButton />
        <AddTileLayerButton />
        <RemoveLayerButton />
        <SaveLayerButton />
      </div>
    )
  }
})

module.exports = AddLayers
