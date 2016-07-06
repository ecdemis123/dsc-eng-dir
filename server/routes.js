'use strict'
const controller = require('./controllers/controller.js');
const jsonParser = require('body-parser').json();
const express = require('express');

module.exports = (app, express) => {
  app.use((req,res,next) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.get('Access-Control-Request-Headers')) {
      res.set('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers'));
    }
    next();
  });
  app.use(express.static('public'));
  app.get('/');
  app.get('/squads', controller.getSquads);
  app.get('/squads/:name', controller.getSquad);
  app.get('/engineers', controller.getEngineers);
  app.get('/engineers/:name', controller.getEngineer);
  app.post('/engineers', jsonParser, controller.createEngineer);
};
