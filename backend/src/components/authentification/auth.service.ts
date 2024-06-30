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

// Function to generate reset token
const generateResetToken = (id) => {
  return jwt.sign({ data: 'reset', userId: id }, consts.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Function to handle reset password request
const resetPassword = async (email) => {
  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return { status: 400, message: "L'utilisateur n'existe pas" };

    // Generate reset token
    const token = generateResetToken(user.dataValues.id);

    // Store reset token in the database
    (user as any).resetToken = token;
    await user.save();

    const link = `${consts.FRONT_END_URL}/auth/lockscreen/${token}`;
    const mailOptions = {
      to: email,
      subject: 'Password Reset',
      html: `<p>You have requested a password reset. Click <a href="${link}">here</a> to reset your password.</p>`,
    };
    logger.debug(link);
    // Send email with password reset link
    await sendMail(mailOptions);

    return {
      status: 200,
      message: 'Lien de réinitialisation du mot de passe envoyé à votre adresse électronique',
    };
  } catch (error) {
    throw new Error(error.message || "Une erreur s'est produite");
  }
};

// Helper function to generate a secure random code
const generateSecureCode = () => {
  return crypto.randomBytes(3).toString('hex'); // Generates a 6-digit hexadecimal code
};

// Function to handle reset password request Mobile
const resetPasswordMobile = async (email) => {
  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return { status: 400, message: "L'utilisateur n'existe pas" };

    // Generate a secure random code
    const code = generateSecureCode();
    // Store the code in the database with an expiration time
    (user as any).resetCode = code;
    (user as any).resetCodeExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    const mailOptions = {
      to: email,
      subject: 'Password Reset Code',
      // eslint-disable-next-line max-len
      html: `<p>You have requested a password reset. Use the following code to reset your password: <strong>${code}</strong></p>`,
    };
    logger.debug(`Reset code for ${email}: ${code}`);
    
    // Send email with password reset code
    await sendMail(mailOptions);

    return {
      status: 200,
      message: 'Code de réinitialisation du mot de passe envoyé à votre adresse électronique',
    };
  } catch (error) {
    throw new Error(error.message || "Une erreur s'est produite");
  }
};

const verifyResetCodeMobile = async (email, code) => {
  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return { status: 400, message: "L'utilisateur n'existe pas" };

    // Check if the reset code and expiry date are valid
    const { resetCode, resetCodeExpiry } = user.dataValues;
    if (!resetCode || !resetCodeExpiry) {
      return { status: 400, message: 'Aucun code de réinitialisation trouvé' };
    }

    if (resetCode !== code) {
      return { status: 400, message: 'Code de réinitialisation incorrect' };
    }

    if (Date.now() > resetCodeExpiry) {
      return { status: 400, message: 'Code de réinitialisation expiré' };
    }

    return {
      status: 200,
      message: 'Code de réinitialisation vérifié avec succès',
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

export { authentification, verifyResetPasswordLink, resetPassword, updatePassword, resetPasswordMobile, verifyResetCodeMobile };
