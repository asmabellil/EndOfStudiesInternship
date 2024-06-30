import * as authController from '@components/authentification/auth.controller';
import express from 'express';
import validation from '@core/middlewares/validate.middleware';
import * as loginValidation from './login.validation';

const app = express.Router();

// Route de connexion
app.post('/login', [validation(loginValidation.loginValidation)], async (req, res) => {
  authController.login(req, res);
});

app.post('/resetPassword', [validation(loginValidation.resetPasswordValidation)], async (req, res) => {
  authController.resetPasswordUser(req, res);
});

app.post('/resetPasswordMobile', [validation(loginValidation.resetPasswordValidation)], async (req, res) => {
  authController.resetPasswordUserMobile(req, res);
});

// Route to handle password reset link
app.get('/verifyLink', async (req, res) => {
  authController.handlePasswordResetLink(req, res);
});

// Route to handle password reset link
app.post('/verifyCode', async (req, res) => {
  authController.handlePasswordResetCode(req, res);
});

app.post('/updatePassword', [validation(loginValidation.changePasswordValidation)], async (req, res) => {
  authController.changePassword(req, res);
});

export default app;
