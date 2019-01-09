import React from 'react';
import geojsonhint from 'geojsonhint';
import vectorTools from '../utils/vectorTools';

class Editor extends React.Component {
  componentDidMount() {
    let self = this;
    this.editor = CodeMirror.fromTextArea(this.refs.textarea, {
      lineNumbers: true,
      mode: 'application/json',
      theme: 'tomorrow-night-bright'
    })
    this.editor.setValue(JSON.stringify(this.props.layer.geojson, null, 2))
    this.editor.refresh()
    this.editor.on('change', function(editor, changeObj) {
      if (changeObj.origin !== 'setValue') {
        let gj = editor.doc.getValue();
        self.cursorPosition = editor.doc.getCursor()
        if (gj === '') {
          gj = {
            "type": "FeatureCollection",
            "features": []
          }
          editor.doc.setValue(JSON.stringify(gj, null, 2))
        }
        try {
          gj = JSON.parse(gj)
          let isEqual = _.isEqual(gj, self.props.layer.geojson);
          if (!isEqual) {
            if (!gj.features) {
              self.props.layer.geojson = {
                "type": "FeatureCollection",
                "features": [gj]
              }
            } else {
              self.props.layer.geojson = gj
            }
            let err = geojsonhint.hint(gj);
            if (err.length) {
              self.props.updateError(err[0].message)
            } else {
              self.props.updateError(false)
              if (self.props.layer.mapLayer) {
                self.props.layer.mapLayer.clearLayers()
                if (self.props.layer.geojson) self.props.layer.mapLayer.addData(self.props.layer.geojson)
              }
            }
          }
        } catch (e) {
          self.props.updateError(e.message)
        }
      }
    })
  }

  componentDidUpdate() {
    if (this.editor && this.props.layer) {
      this.editor.setValue(JSON.stringify(this.props.layer.geojson, null, 2))
      if (this.cursorPosition) {
        this.editor.doc.setCursor(this.cursorPosition)
      }
      this.editor.refresh()
    }
  }

  //only update editor if geojson is new
  shouldComponentUpdate(nextProps) {
    try {
      let gj = JSON.parse(this.editor.doc.getValue());
      return _.isEqual(nextProps.layer.mapLayer.toGeoJSON(), gj) == false
    } catch (e) {
      return false
    }
  }

  render() {
    let textareaStyle = {
      display: 'none'
    };
    return (
      <div className="editor">
        <textarea ref="textarea" style={textareaStyle}></textarea>
      </div>
    )
  }
}

export default Editor;
