var React = require('react')
  , palette = require('./palette')
  , readFile = require('./lib/readfile')
  , hexagon = require('./hexagon.js')

var buttonStyle = {
  width: '30px',
  height: '30px',
  border: '1px solid ' + palette.lightest,
  margin: '10px auto',
  textAlign: 'center',
  lineHeight: '30px',
  backgroundColor: palette.dark
}

var test_layer = {
  enabled: true,
  selected: false
}

var AddLayerButton = React.createClass({
  onClick: function(e) {
    var form = React.findDOMNode(this.refs.addFile)
    form.click()
  },
  onChange: function(e) {
    var self = this
    var form = React.findDOMNode(this.refs.addFile)
    var files = form.files
    console.log(files[0])
    if (!(files && files[0])) return;
    readFile.readAsText(files[0], function(err, text) {
      readFile.readFile(files[0], text, function(err, gj, warning) {
        if (gj && gj.features) {
          var newLayer = JSON.parse(JSON.stringify(test_layer))
          newLayer.geojson = gj
          newLayer.name = files[0].name.split('.')[0]
          newLayer.id = Math.random().toString(36).slice(2)
          console.log(newLayer)
          self.props.addLayer(newLayer)
        }
      })
    })
  },
  render: function() {
    var style = { display: 'none'}
    return (
      <div>
        <div className="add-layer-item" style={buttonStyle} onClick={this.onClick}>+</div>
        <input ref="addFile" type="file" name="addFile" style={style} onChange={this.onChange}/>
      </div>
    )
  }
})

var RemoveLayerButton = React.createClass({
  onClick: function() {
    this.props.removeLayer(test_layer)
  },
  render: function() {
    return (
      <div className="add-layer-item" style={buttonStyle} onClick={this.onClick}>
        -
      </div>
    )
  }
})

var style = {
  borderColor: palette.lightest
}

var AddLayers = React.createClass({
  render: function() {
    return (
      <div className="add-layers" style={style}>
        <AddLayerButton addLayer={this.props.addLayer}/>
        <RemoveLayerButton removeLayer={this.props.removeLayer}/>
      </div>
    )
  }
})

module.exports = AddLayers