function GJUtils() {

}

GJUtils.prototype = {
  findSelectedCount: function(gj) {
    let count = 0;
    if (gj.type === 'FeatureCollection') {
      gj.features.forEach(function(f) {
        if (f.selected) count++
      })
    } else if (gj.type === 'Feature') {
      if (gj.selected) count++
    }
    return count
  },
  newFeatureCollection: () => ({
    "type": "FeatureCollection",
    "features": []
  })
}

export default new GJUtils();