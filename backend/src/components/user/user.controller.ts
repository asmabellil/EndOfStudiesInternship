import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as userService from '@components/user/user.service';
import { IUser } from '@components/user/user.interface';


const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body as IUser;
    const result = await userService.create(user);
    res.status(result.status);
    if (result.user) {
      return res.send({ message: result.message, user: result.user });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const readUser = async (req: Request, res: Response) => {
  try {
    res.status(httpStatus.OK);
    const result = await userService.read( req.params.id );
    res.status(result.status);
    if (result.user) {
      return res.send({ message: result.message, user: result.user });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }

};

const updateUser = async (req: Request, res: Response) => {
  try {
    const user: IUser = { id: req.params.id, ...req.body };
    const result = await userService.update(user);
    res.status(result.status);
    if (result.user) {
      return res.send({ message: result.message, user });
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
    );
    res.status(result.status);
    res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

const listUser = async (req: Request, res: Response) => {
  try {
    const { searchWord } = req.query; // Extracting searchParams from query
    const result = await userService.getListUser(
      searchWord,
    );
    res.status(result.status);
    if (result.listUser) {
      return res.send({ message: result.message, users: result.listUser });
    }
    return res.send({ message: result.message });
  } catch (error) {
    res.status(error.status).send({ message: error.message });
  }
};

export {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  listUser,
};
