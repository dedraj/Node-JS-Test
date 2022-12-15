const Joi = require('@hapi/joi');

const authSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(3).required(),
    phoneNumber: Joi.string().min(10).max(10).required()
})

const authSchemaToDelete = Joi.object({
    id: Joi.string().required(),
})

const authSchemaToUpdate = Joi.object({
    name: Joi.string(),
    email: Joi.string().email().lowercase(),
    password: Joi.string().min(3),
    phoneNumber: Joi.string().min(10).max(10), 
    active: Joi.boolean(), 
    delete: Joi.boolean(), 
    isAdmin: Joi.boolean()
})

const authSchemaForLogin = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(3).required()
})

module.exports = {
    authSchema, 
    authSchemaToDelete, 
    authSchemaToUpdate, 
    authSchemaForLogin
}