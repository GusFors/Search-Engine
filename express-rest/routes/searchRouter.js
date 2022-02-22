const express = require('express')
const router = express.Router()
const controller = require('../controllers/searchController')

router.route('/').get(controller.getSearch)

module.exports = router
