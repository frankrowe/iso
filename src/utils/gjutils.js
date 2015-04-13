function GJUtils() {

}

GJUtils.prototype = {
  findSelectedCount: function(gj) {
    var count = 0
    if (gj.type === 'FeatureCollection') {
      gj.features.forEach(function(f) {
        if (f.selected) count++
      })
    } else if (gj.type === 'Feature') {
      if (gj.selected) count++
    }
    return count
  },
  newFeatureCollection: function() {
    return {
      "type": "FeatureCollection",
      "features": []
    }
  }
}

module.exports = new GJUtils()