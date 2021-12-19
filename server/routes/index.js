const frController = require('../controllers').fr;

const path = require('path')
const viewsDir = path.join(__dirname, '../../views')

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));

  app.get('/user/:nis', frController.user);
  app.get('/users/:id', frController.retrieve);
  app.get('/coco', frController.coco);
  app.get('/train-class', frController.trainClass);
  app.post('/trained/:uuid/:level', frController.trained);
};