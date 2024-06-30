import Joi from 'joi';
import { ValidationSchema } from '@core/interfaces/validationSchema';

const loginValidation: ValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required(),
  }),
};

const resetPasswordValidation: ValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const changePasswordValidation: ValidationSchema = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export { loginValidation, resetPasswordValidation, changePasswordValidation };
