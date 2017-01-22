const express = require('express');
const router = express.Router();

const TOMapper = require('../util/transportObjectMapper');
const Errors = require('../util/errors');

const DataBase = require('../model/index');
const Author = DataBase.sequelize.models.author;
const Event = DataBase.sequelize.models.event; 
const Paper = DataBase.sequelize.models.paper;
const Person = DataBase.sequelize.models.person;
const Speaker = DataBase.sequelize.models.speaker;

function personSubroutes (app) {

  // `/persons/:personId`
  app.subroute('/persons/:personId', (app) => {

    // GET retrieve single person
    app.get((req, res) => {
      const personId = req.params.personId;

      Person.findById(personId)
        .then(person => {
          res.json(TOMapper.toPersonTO(person));
        })
        .catch(err => res.status(404).json({
          error: true,
          success: false,
          message: 'Unknown person',
        }));
    });
  });

  app.subroute('/speaker/:personId/events', (app) => {
    // GET retrieve list of all events
    app.get((req, res) => {
      const personId = (req.params && req.params.personId);

      if (personId == null) {
        res.status(400).send();
        return;
      }

      Event.findAll({
        include: [
          { model: Paper }, // for title
          { model: Speaker, where: { personid: personId }, required: true },
        ]
      }).then((events) => {
         res.json(events.map(TOMapper.toEventTO));
      }).catch((err) => {
        if (process.env.ENV === 'development') {
          console.error(err);
        }
        res.status(500).json(new Errors.InternalServerError());
      });
    });
  });

  app.subroute('/author/:personId/papers', (app) => {
    // GET retrieve list of all papers the person is author
    app.get((req, res) => {
      const personId = (req.params && req.params.personId);

      if (personId == null) {
        res.status(400).send();
        return;
      }

      Paper.findAll({
        include: [
          { association: Paper.hasMany(Author, { foreignKey: 'paperid', as: 'filter' }),
            where: { personid: personId },
            required: true,
          },
          { model: Author, required: true, include: [
             { model: Person, required: true },
          ] },
        ]
      }).then((papers) => {
         res.json(papers.map(TOMapper.toPaperTO));
      }).catch((err) => {
        if (process.env.ENV === 'development') {
          console.error(err);
        }
        res.status(500).json(new Errors.InternalServerError());
      });
    });
  });


}
module.exports = personSubroutes;
