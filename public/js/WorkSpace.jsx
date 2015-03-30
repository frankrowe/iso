var React = require('react')

var WorkSpace = React.createClass({
  componentDidMount: function() {

  },
  render: function() {
    console.log('render')
    if(this.map) this.map.invalidateSize()
    var style = {
      backgroundColor: '#ff0',
      width: this.props.width
    }
    console.log(style)
    return (
      <div className="work-space" ref="workspace" style={style}>
      </div>
    )
  }
})

module.exports = WorkSpace