import Joi from 'joi';
import { ValidationSchema } from '@core/interfaces/validationSchema';
import consts from '@config/consts';

const createLeaveValidation: ValidationSchema = {
  body: Joi.object().keys({
    leaveType: Joi.string().valid(consts.LEAVE_TYPE.Maternity, consts.LEAVE_TYPE.Sick, consts.LEAVE_TYPE.Vacation).required().allow(null, ''),
    startDate: Joi.string().required().allow(null, ''),
    endDate: Joi.string().required().allow(null, ''),
    reason: Joi.string().required().allow(null, ''),
    status: Joi.string().valid(consts.LEAVE_STATUS.Approved,consts.LEAVE_STATUS.Pending,consts.LEAVE_STATUS.Rejected).required().allow(null, ''),
    userId: Joi.number().required().allow(null, ''),
  }),
};

const updateLeaveValidation: ValidationSchema = {
  body: Joi.object().keys({
    leaveType: Joi.string().valid(consts.LEAVE_TYPE.Maternity, consts.LEAVE_TYPE.Sick, consts.LEAVE_TYPE.Vacation).required().allow(null, ''),
    startDate: Joi.string().required().allow(null, ''),
    endDate: Joi.string().required().allow(null, ''),
    reason: Joi.string().required().allow(null, ''),
    status: Joi.string().valid(consts.LEAVE_STATUS.Approved,consts.LEAVE_STATUS.Pending,consts.LEAVE_STATUS.Rejected).required().allow(null, ''),
    userId: Joi.number().required().allow(null, ''),
    rejectionReason: Joi.string().allow(null, ''),
  }),
};

export { createLeaveValidation, updateLeaveValidation };
