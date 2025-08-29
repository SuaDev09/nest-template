import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  APP_PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
  DB_SERVER: Joi.string().required(),
});
