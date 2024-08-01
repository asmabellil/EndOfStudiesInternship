import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as checkInService from '@components/checkIn/checkIn.service';
import { ICheckIn } from '@components/checkIn/checkIn.interface';

const createCheckIn = async (req: Request, res: Response) => {
  try {
    const checkIn = req.body as ICheckIn;
    const result = await checkInService.create(checkIn);
    res.status(result.status);
    if (result.checkIn) {
      return res.send({ message: result.message, checkIn: result.checkIn });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const readCheckIn = async (req: Request, res: Response) => {
  try {
    res.status(httpStatus.OK);
    const result = await checkInService.read(req.params.id);
    res.status(result.status);
    if (result.checkIn) {
      return res.send({ message: result.message, checkIn: result.checkIn });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const readCheckInsByUser = async (req: Request, res: Response) => {
  try {
    res.status(httpStatus.OK);
    const result = await checkInService.readAllByUserId(req.params.id);
    res.status(result.status);
    if (result.checkIns) {
      return res.send({ message: result.message, checkIns: result.checkIns });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const updateCheckIn = async (req: Request, res: Response) => {
  try {
    const checkIn: ICheckIn = { id: req.params.id, ...req.body };
    const result = await checkInService.update(checkIn);
    res.status(result.status);
    if (result.checkIn) {
      return res.send({ message: result.message, checkIn });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const deleteCheckIn = async (req: Request, res: Response) => {
  try {
    const result = await checkInService.deleteById(req.params.id);
    res.status(result.status);
    res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const listCheckIn = async (req: Request, res: Response) => {
  try {
    const result = await checkInService.getList();
    res.status(result.status);
    if (result.listCheckIn) {
      return res.send({ message: result.message, checkIns: result.listCheckIn });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

export {
  createCheckIn,
  readCheckIn,
  updateCheckIn,
  deleteCheckIn,
  listCheckIn,
  readCheckInsByUser,
};
