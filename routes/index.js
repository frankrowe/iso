var express = require('express')
  , pkg = require('../package.json')
  , router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'uGIS', pkg: pkg })
})

router.get('/ugis', function(req, res) {
  res.render('ugis', { title: 'uGIS', pkg: pkg })
})

module.exports = router
