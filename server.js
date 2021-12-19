const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path')
const { get } = require('request')
var multer = require('multer');
var upload = multer();

const app = express()
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// for parsing multipart/form-data
// app.use(upload.array()); 
// app.use(express.static('public'));

// app.use(bodyParser.urlencoded({ extended: 0 }));
// app.use(bodyParser.json());
require('./server/routes')(app);

global.__basedir = __dirname;


const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './vendor')))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, './public/weights')))
app.use(express.static(path.join(__dirname, './public/images')))

app.get('/', (req, res) => res.redirect('/face_detection'))
app.get('/face_matching', (req, res) => res.sendFile(path.join(viewsDir, 'index.html')))
app.get('/bbt_face_matching', (req, res) => res.sendFile(path.join(viewsDir, 'bbtFaceMatching.html')))

app.post('/fetch_external_image', async (req, res) => {
  const { imageUrl } = req.body
  if (!imageUrl) {
    return res.status(400).send('imageUrl param required')
  }
  try {
    const externalResponse = await request(imageUrl)
    res.set('content-type', externalResponse.headers['content-type'])
    return res.status(202).send(Buffer.from(externalResponse.body))
  } catch (err) {
    return res.status(404).send(err.toString())
  }
})

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

module.exports = app;