/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '@components/user/user.model';
import { IUser } from '@components/user/user.interface';
import logger from '@core/utils/logger';
import consts from '@config/consts';
import { sendMail } from '@config/mail';
import AppError from '@core/utils/appError';
import httpStatus from 'http-status';
import crypto from 'crypto';
import verifyPasswordComplexity from '@core/utils/passwordComplexity';
import { create } from '@components/user/user.service';

// Login
const authentification = async (email: string, password: string): Promise<string | null> => {
  try {
    // Recherche de l'utilisateur dans la base de données
    const userFound = await UserModel.findOne({ where: { email } });
    const user = userFound ? (userFound.toJSON() as IUser) : null;
    if (!user) {
      return null;
    }

    // Vérification du mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return null;
    }

    // Génération du jeton JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, consts.JWT_SECRET);
    return token;
  } catch (error) {
    logger.error(error);
    throw new Error('Une erreur est survenue lors de la connexion');
  }
};

const loginWithGmail = async (user: any): Promise<UserModel | any> => {
  try {
    // Recherche de l'utilisateur dans la base de données
    const userFound = await UserModel.findOne({ where: { email: user.email } });
    if(userFound){
      // Génération du jeton JWT
      const token = jwt.sign({ userId: userFound.id, role: userFound.role }, consts.JWT_SECRET);
      return token;
    }else {
      const newUser = await create(user);
      const token = jwt.sign({ userId: newUser.user.dataValues.id, role: newUser.user.dataValues.role }, consts.JWT_SECRET);
      return token;
    }
  } catch (error) {
    logger.error(error);
    throw new Error('Une erreur est survenue lors de la connexion avec google');
  }
};

// Function to generate reset token
const generateResetToken = (id) => {
  return jwt.sign({ data: 'reset', userId: id }, consts.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Function to handle reset password request
const resetPassword = async (email, primaryColor, secondaryColor) => {
  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return { status: 400, message: "L'utilisateur n'existe pas" };

    // Generate reset token
    const token = generateResetToken(user.dataValues.id);

    // Store reset token in the database
    (user as any).resetToken = token;
    await user.save();

    const link = `${consts.FRONT_END_URL}/#/auth/reset-password/${token}`;
    const mailOptions = {
      to: email,
      subject: 'Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; color: ${primaryColor};">
          <h1 style="color: ${primaryColor};">Password Reset Request</h1>
          <p>You have requested a password reset. Click the button below to reset your password.</p>
          <a href="${link}" style="background-color: ${secondaryColor}; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
      `,
    };
    logger.debug(link);
    // Send email with password reset link
    // await sendMail(mailOptions);

    return {
      status: 200,
      message: 'Lien de réinitialisation du mot de passe envoyé à votre adresse électronique',
    };
  } catch (error) {
    throw new Error(error.message || "Une erreur s'est produite");
  }
};

interface DecodedToken {
  userId: string;
  exp: number; // Expiry time in seconds since Unix epoch
}

interface VerifyResetPasswordLinkResponse {
  status: number;
  message: string;
}

const verifyResetPasswordLink = async (token: string): Promise<VerifyResetPasswordLinkResponse> => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, consts.JWT_SECRET) as DecodedToken;

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds since Unix epoch
    if (decoded.exp < currentTime) {
      return { status: 401, message: 'Le jeton a expiré' }; // Token is expired
    }

    // Check if the token matches a user in your database
    const user = await UserModel.findOne({
      where: { id: decoded.userId },
    });
    if (!user) {
      return {
        status: 401,
        message: "Le jeton ne correspond pas à l'utilisateur",
      };
    }

    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (user.dataValues.resetToken !== token) {
      return { status: 401, message: "Le jeton ne correspond pas à l'utilisateur" };
    }

    // If no errors occurred during verification, the token is valid
    return {
      status: 200,
      message: 'succès',
    };
  } catch (error) {
    logger.error(error);
    // If an error occurred during verification, the token is invalid
    return {
      status: 400,
      message: error.message,
    };
  }
};

const updatePassword = async (password: string, userId: any): Promise<any> => {
  try {
    const passwordComplexity = verifyPasswordComplexity(password);
    if (passwordComplexity) {
      return { status: 400, message: passwordComplexity };
    }
    const saltRounds = 10;
    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const affectedRows = await UserModel.update(
      {
        password: hashedPassword,
      },
      { where: { id: userId } },
    );
    if (affectedRows[0] > 0) {
      // logger.debug(`User updated: %O`, user);
      return { status: 200, message: 'Le mot de passe a été modifié avec succès' };
    }
  } catch (err) {
    logger.error(`User update err: %O`, err.message);
    throw new AppError(httpStatus.BAD_REQUEST, 'Password was not updated!');
  }
};

export { authentification, verifyResetPasswordLink, resetPassword, updatePassword, loginWithGmail };
