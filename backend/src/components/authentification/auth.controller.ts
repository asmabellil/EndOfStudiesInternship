import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  authentification,
  resetPassword,
  verifyResetPasswordLink,
  updatePassword,
  loginWithGmail,
} from '@components/authentification/auth.service';
import jwt from 'jsonwebtoken';
import consts from '@config/consts';

// Login
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authentification(email, password);
    if (!token) {
      return res
        .status(401)
        .json({ error: 'Incorrect e-mail address or password' });
    }

    res.status(httpStatus.CREATED).json({ token });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'An error has occurred during connection',
    });
  }
};

const loginViaGmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await loginWithGmail(email);

    if (result.status === 200) {
      return res.status(result.status).json({ token: result.token });
    }
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'An error has occurred during connection',
    });
  }
};

const resetPasswordUser = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await resetPassword(email);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: 'An error has occurred' });
  }
};

const handlePasswordResetLink = async (req, res) => {
  try {
    const { token } = req.query;
    const result = await verifyResetPasswordLink(token);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: 'An error has occurred' });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { password, token } = req.body;
    const secretKey = consts.JWT_SECRET;

    const decoded = jwt.verify(token, secretKey);

    const result = await updatePassword(password, decoded.userId);
    res.status(result.status);
    res.send({ message: result.message });
  } catch (error) {
    res.status(401);
    res.send({ message: error.message });
  }
};

export {
  login,
  resetPasswordUser,
  handlePasswordResetLink,
  changePassword,
  loginViaGmail,
};
