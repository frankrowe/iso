var React = require('react')

var AddLayerButton = React.createClass({
  render: function() {
    var style = {
      width: '30px',
      height: '30px',
      border: '1px solid #ddd',
      margin: '10px auto',
      textAlign: 'center',
      lineHeight: '30px'
    }

    return (
      <div className="add-layer" style={style} onClick={this.props.addLayer}>+</div>
    )
  }
})

var AddLayers = React.createClass({
  render: function() {
    return (
      <div className="add-layers">
        <AddLayerButton addLayer={this.props.addLayer}/>
      </div>
    )
  }
})

module.exports = AddLayers