const express = require('express');
const { celebrate, Segments, Joi  } = require('celebrate');

const OngController = require('./controllers/OngController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();

/**
 * Recurso para realizar o Login de uma ONG (Usuário)
 */
routes.post('/sessions', SessionController.create);

/**
 * Recurso para listar todas as Ongs.
 */
routes.get('/ongs', OngController.index);

/**
 * Recurso para cadastrar uma nova Ong.
 */
routes.post('/ongs', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required().min(10).max(11),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2),
    })
}), OngController.create);

/**
 * Recurso para obter o Profile de uma ONG.
 */
routes.get('/profile', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
}), ProfileController.index);

/**
 * Recurso para listar todas os incidentes (Casos).
 */
routes.get('/incidents', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number(),
    })
}), IncidentController.index);

/**
 * Recurso para cadastrar um novo Incidente (Caso)
 */
routes.post('/incidents', celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required(),
    }).unknown(), 
    [Segments.BODY] : Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        value: Joi.number().required().positive(),
    }),
}), IncidentController.create);

/**
 * Recurso para deletar um incidente (Caso)
 */
routes.delete('/incidents/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), IncidentController.delete);

module.exports = routes;
