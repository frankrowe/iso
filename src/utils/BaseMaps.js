module.exports = {
  streets: {
    name: 'Streets',
    layer: L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.m05f0k04/{z}/{x}/{y}.png')
  },
  simple: {
    name: 'Simple',
    layer: L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.lkf1pigd/{z}/{x}/{y}.png')
  },
  satellite: {
    name: 'Satellite',
    layer: L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.m05elkbi/{z}/{x}/{y}.png')
  },
  satellitestreets: {
    name: 'Satellite Streets',
    layer: L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.m05ep5bc/{z}/{x}/{y}.png')
  },
  none: {
    name: 'None',
    layer: false
  }
}