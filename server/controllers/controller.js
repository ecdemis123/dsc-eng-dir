'use strict'
const casual = require('random-fixture-data');
const neo = require('../db/neo.js')

module.exports = {
  getSquads: (req, res, next) => {
    const allSquadsQuery = `MATCH (n:Squad) WITH COLLECT (n) AS squads
                            RETURN {squads: squads}`

    neo.runCypherStatementPromise(allSquadsQuery)
    .then(squadsObject => {
      res.json(squadsObject.squads);
    })
    .catch(error);

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
    neo.runCypherStatementPromise(allEngineersQuery)
    .then(singleEngineerObject => {
      res.json(singleEngineerObject);
    })
    .catch(error)
  },

  getEngineers: (req, res, next) => {
    const allEngineersQuery = `MATCH (n:Engineer) WITH COLLECT (n) AS eng
                                RETURN {engineers: eng}`
    neo.runCypherStatementPromise(allEngineersQuery)
    .then(engineersObject => {
      res.json(engineersObject.engineers);
    })
    .catch(error)
  },

  createEngineer: (req, res, next) => {
    let engineer = {
      props: {
        name: req.body.name,
        username: req.body.username
      }
    };
    const addEngineerWithSquadsQuery = `MERGE (b:Engineer{props})
                                        FOREACH (squad IN [${req.body.squads}] |
                                        MERGE (n:Squad{name:squad.name})
                                        MERGE (b)-[:INVOLVED_WITH{current: squad.current}]->(n))`
   neo.runCypherStatementPromise(addEngineerWithSquadsQuery, engineer)
   .then(engineerWithSquads => {
     res.json(engineerWithSquads);
   })
   .catch(error);
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
