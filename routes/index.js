const express = require('express')
const router = express.Router()

const fs = require('fs')
const path = require('path')

const gm = require('gm').subClass({ imageMagick: true })

/* GET home page. */
router.get('/', function (req, res, next) {
  fs.readdir(process.env.STATIC_PATH, function (err, list) {
    if (err) {
      return next()
    }

    const latestImageName = list.sort().filter((fileName) => {
      return fileName.match(/\.jpg$/i)
    }).pop()

    const imageSrc = `/${latestImageName}`

    const pathToLatestImage = path.join(
      process.env.STATIC_PATH,
      latestImageName
    )

    const pathToOptimizedImage = path.join(
      require('../helpers/tmp-folder'),
      latestImageName
    )

    const cb = function () {
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
    }

    const createOptimizedImage = function () {
      gm(pathToLatestImage)
        .resize('50%')
        .quality(85)
        .strip()
        .interlace('Plane')
        .write(pathToOptimizedImage, cb)
    }

    fs.access(pathToOptimizedImage, fs.constants.F_OK, (err) => {
      if (err) {
        createOptimizedImage()
        return
      }
      cb()
    })
  })
})

module.exports = router
