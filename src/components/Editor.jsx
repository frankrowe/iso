var React = require('react')
  , geojsonhint = require('geojsonhint')
  , vectorTools = require('../utils/vectorTools')

var Editor = React.createClass({
  componentDidMount: function() {
    var self = this
    this.editor = CodeMirror.fromTextArea(this.refs.textarea.getDOMNode(), {
      lineNumbers: true,
      mode: 'application/json',
      theme: 'tomorrow-night-bright'
    })
    this.editor.setValue(JSON.stringify(this.props.layer.geojson, null, 2))
    this.editor.refresh()
    this.editor.on('change', function(editor, changeObj) {
      if (changeObj.origin !== 'setValue') {
        var gj = editor.doc.getValue()
        self.cursorPosition = editor.doc.getCursor()
        try {
          gj = JSON.parse(gj)
          var isEqual = _.isEqual(gj, self.props.layer.geojson)
          if (!isEqual) {
            self.props.layer.geojson = gj
            var err = geojsonhint.hint(gj)
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
  },
  componentDidUpdate: function() {
    if (this.editor && this.props.layer) {
      this.editor.setValue(JSON.stringify(this.props.layer.geojson, null, 2))
      if (this.cursorPosition) {
        this.editor.doc.setCursor(this.cursorPosition)
      }
      this.editor.refresh()
    }
  },
  //only update editor if geojson is new
  shouldComponentUpdate: function(nextProps) {
    try {
      var gj = JSON.parse(this.editor.doc.getValue())
      return _.isEqual(nextProps.layer.mapLayer.toGeoJSON(), gj) == false
    } catch (e) {
      return false
    }
  },
  render: function() {
    var self = this
    var textareaStyle = {
      display: 'none'
    }
    var editorStyle = {}
    return (
      <div className="editor" style={editorStyle}>
        <textarea ref="textarea" style={textareaStyle}></textarea>
      </div>
    )
  }
})

module.exports = Editor