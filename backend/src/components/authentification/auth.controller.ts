import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  authentification,
  resetPassword,
  resetPasswordMobile,
  verifyResetPasswordLink,
  updatePassword,
  verifyResetCodeMobile
} from '@components/authentification/auth.service';
import jwt from 'jsonwebtoken';
import consts from '@config/consts';

// Login
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authentification(email, password);
    if (!token) {
      return res.status(401).json({ error: 'Adresse électronique ou mot de passe incorrect' });
    }

    res.status(httpStatus.CREATED).json({ token });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Une erreur est survenue lors de la connexion',
    });
  }
};

const resetPasswordUser = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await resetPassword(email);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite" });
  }
};

const resetPasswordUserMobile = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await resetPasswordMobile(email);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite" });
  }
};

const handlePasswordResetLink = async (req, res) => {
  try {
    const { token } = req.query;
    const result = await verifyResetPasswordLink(token);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite" });
  }
};

const handlePasswordResetCode = async (req, res) => {
  try {
    const result = await verifyResetCodeMobile(req.body.email, req.body.code);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite" });
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

export { login, resetPasswordUser, handlePasswordResetLink, changePassword, resetPasswordUserMobile, handlePasswordResetCode };
