var defaultLayer = {
  name: 'Default',
  //checkbox
  enabled: true,
  //layer selected in layer list
  selected: true
}


function DefaultLayer() {

}

DefaultLayer.prototype = {
  generate: function() {
    return JSON.parse(JSON.stringify(defaultLayer))
  }
}

module.exports = new DefaultLayer()