let options = {
  detectRetina: true
};

export default {
  streets: {
    name: 'Streets',
    layer: L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.m05f0k04/{z}/{x}/{y}.png', options)
  },
  simple: {
    name: 'Simple',
    layer: L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.lkf1pigd/{z}/{x}/{y}.png', options)
  },
  satellite: {
    name: 'Satellite',
    layer: L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.m05elkbi/{z}/{x}/{y}.png', options)
  },
  satellitestreets: {
    name: 'Satellite Streets',
    layer: L.tileLayer('http://{s}.tiles.mapbox.com/v3/fsrw.m05ep5bc/{z}/{x}/{y}.png', options)
  },
  none: {
    name: 'None',
    layer: false
  }
};