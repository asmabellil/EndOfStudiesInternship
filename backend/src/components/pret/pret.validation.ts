import Joi from 'joi';
import { ValidationSchema } from '@core/interfaces/validationSchema';

const createPretValidation: ValidationSchema = {
  body: Joi.object().keys({
    pretRef: Joi.string().required(),
    dateObtention: Joi.date().required(),
    dateEcheance: Joi.date().required(),
    montantPret: Joi.number().required(),
    montant1ereRemb: Joi.number().required(),
    echanceNumber: Joi.number().required(),
    userId: Joi.number().required(),
  }),
};

const updatePretValidation: ValidationSchema = {
  body: Joi.object().keys({
    pretRef: Joi.string().required(),
    dateObtention: Joi.date().required(),
    dateEcheance: Joi.date().required(),
    montantPret: Joi.number().required(),
    montant1ereRemb: Joi.number().required(),
    echanceNumber: Joi.number().required(),
    status: Joi.string(),
    moneyStatus: Joi.boolean(),
    userId: Joi.number().required(),
  }),
};

export { createPretValidation, updatePretValidation };
