import Joi from 'joi';
import { ValidationSchema } from '@core/interfaces/validationSchema';
import consts from '@config/consts';

const createCheckInValidation: ValidationSchema = {
  body: Joi.object().keys({
    checkInType: Joi.string().valid(consts.CHECKIN_TYPE.IN, consts.CHECKIN_TYPE.OUT).required().allow(null, ''),
    checkInDate: Joi.string().required().allow(null, ''),
    userId: Joi.number().required().allow(null, ''),
  }),
};

const updateCheckInValidation: ValidationSchema = {
  body: Joi.object().keys({
    checkInType: Joi.string().valid(consts.CHECKIN_TYPE.IN, consts.CHECKIN_TYPE.OUT).required().allow(null, ''),
    checkInDate: Joi.string().required().allow(null, ''),
    userId: Joi.number().required().allow(null, ''),
  }),
};

export { createCheckInValidation, updateCheckInValidation };
