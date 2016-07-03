'use strict'
const controller = require('./controllers/controller.js');
const jsonParser = require('body-parser').json();

module.exports = (app, express) => {
  app.get('/');
  app.get('/squads', controller.getSquads);
  app.get('/squads/:name', controller.getSquad);
  app.get('/engineers', controller.getEngineers);
  app.get('/engineers/:name', controller.getEngineer);
  app.post('/engineers', jsonParser, controller.createEngineer);
};
