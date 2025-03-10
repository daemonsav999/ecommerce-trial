const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return res.status(400).json({ errors });
    }
    
    next();
  };
};

// Validation schemas
const schemas = {
  userRegister: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  
  groupBuyCreate: Joi.object({
    product: Joi.string().required(),
    basePrice: Joi.number().positive().required(),
    minParticipants: Joi.number().integer().min(2).required(),
    maxParticipants: Joi.number().integer().min(Joi.ref('minParticipants')),
    endDate: Joi.date().greater('now').required(),
    description: Joi.string()
  }),
  
  productCreate: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    category: Joi.string().required(),
    basePrice: Joi.number().positive().required(),
    images: Joi.array().items(Joi.string().uri())
  })
};

module.exports = { validate, schemas };