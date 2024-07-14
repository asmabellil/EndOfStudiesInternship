import Joi from 'joi';
import { ValidationSchema } from '@core/interfaces/validationSchema';

import consts from '@config/consts';

const createUserValidation: ValidationSchema = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(consts.ROLE.ADMIN,consts.ROLE.EMPLOYEE).required(),
    email: Joi.string().email().required(),
    userRef: Joi.string().required(),
    // jobTitle: Joi.string().allow(null, ''),
    jobTitle: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string().valid(consts.GENDER.FEMALE,consts.GENDER.MALE).required(),
  }),
};

const updateUserValidation: ValidationSchema = {
  body: Joi.object().keys({
    id: Joi.number().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(consts.ROLE.ADMIN,consts.ROLE.EMPLOYEE).required(),
    email: Joi.string().email().required(),
    userRef: Joi.string().required(),
    // jobTitle: Joi.string().allow(null, ''),
    jobTitle: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string().valid(consts.GENDER.FEMALE,consts.GENDER.MALE).required(),
    enabled: Joi.boolean().required(),
  }),
};

export { createUserValidation, updateUserValidation };
