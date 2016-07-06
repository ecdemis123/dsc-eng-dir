'use strict'
const casual = require('random-fixture-data');
const neo = require('../db/neo.js')

module.exports = {
  getSquads: (req, res, next) => {
    const allSquadsQuery = `MATCH (n:Squad) WITH COLLECT (n) AS squads
                            RETURN {squads: squads}`

    neo.runCypherStatementPromise(allSquadsQuery)
    .then(squadsObject => {
      res.json(squadsObject[0].squads);
    });

  },
  getSquad: (req, res, next) => {
    const singleSquadQuery = `MATCH (n:Squad{name:"${req.params.name}"})
                              RETURN n`
    neo.runCypherStatementPromise(singleSquadQuery)
    .then(squadObect => {
      res.json(squadObect);
    })
    .catch(error);

  },

  getEngineer: (req, res, next) => {
    const singleEngineerQuery = `MATCH (e:Engineer{name:"${req.params.name}"})-[r:INVOLVED_WITH]->(squad)
                                WITH COLLECT ({name: squad.name, current: r.current}) AS squads, e
                                RETURN {squads: squads, name: e.name}`
    neo.runCypherStatementPromise(singleEngineerQuery)
    .then(singleEngineerObject => {
      res.json(singleEngineerObject[0]);
    })

  },

  getEngineers: (req, res, next) => {
    const allEngineersQuery = `MATCH (n:Engineer) WITH COLLECT (n) AS eng
                                RETURN {engineers: eng}`
    neo.runCypherStatementPromise(allEngineersQuery)
    .then(engineersObject => {
      res.json(engineersObject[0].engineers);
    })

  },

  createEngineer: (req, res, next) => {
    let squads = req.body.squads;
    const addEngineerWithSquadsQuery = `MERGE (engineer:Engineer{name:"${req.body.name}", username:"${req.body.username}"})
                                        WITH engineer
                                        UNWIND {squads} AS squadData
                                        MATCH (squad:Squad{name:squadData.name})
                                        MERGE (engineer)-[:INVOLVED_WITH{current:squadData.current}]->(squad)
                                        RETURN engineer`
    let squadParams = {
      squads: squads
    };
   neo.runCypherStatementPromise(addEngineerWithSquadsQuery, squadParams)
   .then(engineer => {
     res.json(engineer[0]);
   })
  }
};



// function generateEngineer() {
//   return {
//     name: casual.name,
//     username: casual.username,
//     squads: [
//       generateSquad({ current: true }),
//       generateSquad({ current: false }),
//       generateSquad({ current: false }),
//       generateSquad({ current: false })
//     ]
//   };
// }

// function generateSquad(augment={}) {
//   return Object.assign({ name: casual.title }, augment);
// }
