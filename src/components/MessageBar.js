import React from 'react';
import palette from '../utils/palette';
import gjutils from '../utils/gjutils';

class MessageBar extends React.Component {
  layerMessage = () => {
    let message = '';
    if (Object.keys(this.props.layers).length === 0) {
      message = '0 layers added.'
    } else {
      let selected = _.where(this.props.layers, {selected: true});
      if (selected.length == 0) {
        message = '0 layers selected.'
      } else if (selected.length == 1) {
        message = 'Layer "' + selected[0].name + '" selected.'
      } else {
        message = selected.length + ' layers selected.'
      }
      let selectedFeatureCount = 0;
      for (let id in this.props.layers) {
        selectedFeatureCount += gjutils.findSelectedCount(this.props.layers[id].geojson)
      }
      message += ' ' + selectedFeatureCount + ' '
      message += (selectedFeatureCount == 1) ? 'feature selected.' : 'features selected.'
    }
    return message
  };

  render() {
    let msg = this.layerMessage();
    return (
      <div className="message-bar">
        <div className="message-bar-item message">{msg}</div>
        <div className="message-bar-item error">{this.props.error}</div>
        <div className="message-bar-item coordinates"></div>
      </div>
    )
  }
}

export default MessageBar;