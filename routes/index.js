const express = require('express')
const router = express.Router()

const fs = require('fs')
const path = require('path')

/* GET home page. */
router.get('/', function (req, res, next) {
  fs.readdir(process.env.STATIC_PATH, function (err, list) {
    if (err) {
      return next()
    }

    const latestImage = list.sort().filter((fileName) => {
      return fileName.match(/\.jpg$/i)
    }).pop()

    const imageSrc = `/${latestImage}`
    const txtFile = path.join(process.env.STATIC_PATH, 'is-it-here-yet.txt')
    fs.readFile(txtFile, 'utf8', function (err, data) {
      if (err) {
        return next()
      }

      res.render('index', {
        title: 'Is it here yet?',
        imageSrc: imageSrc,
        answer: data
      })
    })
  })
})

module.exports = router
