import Joi from 'joi';
import { ValidationSchema } from '@core/interfaces/validationSchema';

import { Request, Response, NextFunction } from 'express';
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

const udateUserValidation: ValidationSchema = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
  }),
};

const validatePaginationParams = (req: Request, res: Response, next: NextFunction): void => {
  const { page: rawPage, limit: rawLimit } = req.query;

  const page = rawPage ? parseInt(rawPage as string, 10) : 1;
  const limit = rawLimit ? parseInt(rawLimit as string, 10) : 10;

  if (Number.isNaN(page) || page < 1 || Number.isNaN(limit) || limit < 1) {
    res.status(400).json({ message: 'Invalid_pagination_parameters' });
  }

  next();
};

const changePasswordValidation: ValidationSchema = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};


const createTechnicianValidation: ValidationSchema = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    language: Joi.string().required(),
    comment: Joi.string().allow(null, ''),
    schedules: Joi.array().items(Joi.object({
      day: Joi.string().valid('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche').required(),
      startTime: Joi.string().required(),
      endTime: Joi.string().required(),
    })).optional(),
  }),
};

const updateTechnicianValidation: ValidationSchema = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string(),
    language: Joi.string(),
    comment: Joi.string().allow(null, ''),
    schedules: Joi.array().items(Joi.object({
      day: Joi.string().valid('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche').required(),
      startTime: Joi.string().required(),
      endTime: Joi.string().required(),
    })).optional(),
  }),
};

export { createUserValidation, validatePaginationParams, changePasswordValidation, udateUserValidation, createTechnicianValidation, updateTechnicianValidation };
