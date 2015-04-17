var React = require('react')
  , palette = require('../utils/palette')
  , gjutils = require('../utils/gjutils')

var MessageBar = React.createClass({
  layerMessage: function() {
    var message = ''
    if (Object.keys(this.props.layers).length === 0) {
      message = '0 layers added.'
    } else {
      var selected = _.where(this.props.layers, {selected: true})
      if (selected.length == 0) {
        message = '0 layers selected.'
      } else if (selected.length == 1) {
        message = 'Layer "' + selected[0].name + '" selected.'
      } else {
        message = selected.length + ' layers selected.'
      }
      var selectedFeatureCount = 0
      for (var id in this.props.layers) {
        selectedFeatureCount += gjutils.findSelectedCount(this.props.layers[id].geojson)
      }
      message += ' ' + selectedFeatureCount + ' '
      message += (selectedFeatureCount == 1) ? 'feature selected.' : 'features selected.'
    }
    return message
  },
  render: function() {
    var msg = this.layerMessage()
    return (
      <div className="message-bar">
        <div className="message-bar-item message">{msg}</div>
        <div className="message-bar-item error">{this.props.error}</div>
        <div className="message-bar-item coordinates"></div>
      </div>
    )
  }
})

module.exports = MessageBar