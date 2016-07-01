'use strict'
var casual = require('random-fixture-data');

module.exports = {
  getSquads: (req, res, next) => {
    res.json([
      generateSquad(),
      generateSquad(),
      generateSquad(),
      generateSquad(),
      generateSquad(),
      generateSquad(),
      generateSquad(),
      generateSquad(),
      generateSquad()
    ]);
  },
  
  getSquad: (req, res, next) => {
    res.json(generateSquad());
  },
  
  getEngineer: (req, res, next) => {
    res.json(generateEngineer())
  },
  
  getEngineers: (req, res, next) => {
    res.json([
      generateEngineer(),
      generateEngineer(),
      generateEngineer(),
      generateEngineer(),
      generateEngineer()
    ]);
  },
  
  createEngineer: (req, res, next) => {
    var newEngineer = {
      name: "Brian McKelvey",
      username: "theturtle32",
      squads: [
        {
          name: "Core Services",
          current: true
        },
        {
          name: "Renegades",
          current: false
        }
      ]
    }
    res.json(newEngineer);
  }
};

function generateEngineer() {
  return {
    name: casual.name,
    username: casual.username,
    squads: [
      generateSquad({ current: true }),
      generateSquad({ current: false }),
      generateSquad({ current: false }),
      generateSquad({ current: false })
    ]
  };
}

function generateSquad(augment={}) {
  return Object.assign({ name: casual.title }, augment);
}
