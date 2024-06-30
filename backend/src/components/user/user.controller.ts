import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as userService from '@components/user/user.service';
import { IUser } from '@components/user/user.interface';
import logger from '@core/utils/logger';
import consts from '@config/consts';
import jwt from 'jsonwebtoken';
import getToken from '@core/utils/getToken';

interface CreateUserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  language: string;
  comment: string;
}

const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body as IUser;
    const result = await userService.create(user);
    res.status(result.status);
    if (result.user) {
      // Filter out sensitive fields from the user object
      const filteredUser: CreateUserResponse = {
        id: result.user?.id || '',
        first_name: result.user?.first_name || '',
        last_name: result.user?.last_name || '',
        email: result.user?.email || '',
        language: result.user?.language || '',
        comment: result.user?.comment || '',
      };
      return res.send({ message: result.message, user: filteredUser });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const readUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const decodedToken = getToken(authHeader);
  res.status(httpStatus.OK);
  res.send({ message: 'Read', output: await userService.read( decodedToken.userId ) });
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = getToken(authHeader);
    const user: IUser = { id: decodedToken.userId, ...req.body };
    const result = await userService.update(user);
    res.status(result.status);
    if (result.user) {
      return res.send({ message: result.message, user: result.user });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteById(
      req.params.id,
      consts.ROLE.SURTEC_USER,
    );
    res.status(result.status);
    res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const listUser = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, ...searchParams } = req.query; // Extracting searchParams from query
    const listOptions = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };
    const result = await userService.getListUser(
      listOptions,
      consts.ROLE.SURTEC_USER,
      searchParams,
    );
    res.status(httpStatus.ACCEPTED).send(result);
  } catch (error) {
    logger.debug('Error fetching user list:', error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send('Failed to fetch user list');
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = getToken(authHeader);
    const result = await userService.changePassword(
      decodedToken.userId,
      req.body.oldPassword,
      req.body.newPassword,
    );
    res.status(result.status);
    res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};


const getTechnicians = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const listOptions = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };
    const result = await userService.getListTechnicians(
      listOptions
    );
    res.status(httpStatus.ACCEPTED).send(result);
  } catch (error) {
    logger.debug('Error fetching technician list:', error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send('Failed to fetch technician list');
  }
};

const createTechnician = async (req: Request, res: Response) => {
  try {
    const technicianData = req.body;
    const result = await userService.createTechnician(technicianData);
    res.status(result.status).send(result.message);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Failed to create technician');
  }
};

const updateTechnician = async (req: Request, res: Response) => {
  try {
    const technicianId = req.params.id;
    const technicianData = req.body;
    const result = await userService.updateTechnician(technicianId, technicianData);
    res.status(result.status).send(result.message);
  } catch (error) {
    logger.error('Failed to update technician: %O', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Failed to update technician');
  }
};

const deleteTechnician = async (req: Request, res: Response) => {
  try {
    const technicianId = req.params.id;
    const result = await userService.deleteTechnician(technicianId);
    res.status(result.status).send(result.message);
  } catch (error) {
    logger.error('Failed to delete technician: %O', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Failed to delete technician');
  }
};

export {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  listUser,
  changePassword,
  getTechnicians,
  createTechnician,
  updateTechnician,
  deleteTechnician
};
