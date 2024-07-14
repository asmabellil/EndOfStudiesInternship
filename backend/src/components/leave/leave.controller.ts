import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as leaveService from '@components/leave/leave.service';
import { ILeave } from '@components/leave/leave.interface';

const createLeave = async (req: Request, res: Response) => {
  try {
    const leave = req.body as ILeave;
    const result = await leaveService.create(leave);
    res.status(result.status);
    if (result.leave) {
      return res.send({ message: result.message, leave });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const readLeave = async (req: Request, res: Response) => {
  try {
    res.status(httpStatus.OK);
    const result = await leaveService.read(req.params.id);
    res.status(result.status);
    if (result.leave) {
      return res.send({ message: result.message, leave: result.leave });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const readLeavesByUser = async (req: Request, res: Response) => {
  try {
    res.status(httpStatus.OK);
    const result = await leaveService.readAllByUserId(req.params.id);
    res.status(result.status);
    if (result.leaves) {
      return res.send({ message: result.message, leaves: result.leaves });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const updateLeave = async (req: Request, res: Response) => {
  try {
    const leave: ILeave = { id: req.params.id, ...req.body };
    const result = await leaveService.update(leave);
    res.status(result.status);
    if (result.leave) {
      return res.send({ message: result.message, leave });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const deleteLeave = async (req: Request, res: Response) => {
  try {
    const result = await leaveService.deleteById(req.params.id);
    res.status(result.status);
    res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const listLeave = async (req: Request, res: Response) => {
  try {
    const result = await leaveService.getList();
    res.status(result.status);
    if (result.listLeave) {
      return res.send({ message: result.message, leaves: result.listLeave });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

export {
  createLeave,
  readLeave,
  updateLeave,
  deleteLeave,
  listLeave,
  readLeavesByUser,
};
