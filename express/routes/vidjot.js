const express = require('express')
const router = express.Router()
const index = require('../controller/vidjot')

router.route('/').get(index)

module.exports = router