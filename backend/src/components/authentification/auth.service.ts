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
import verifyPasswordComplexity from '@core/utils/passwordComplexity';

// Login
const authentification = async (
  email: string,
  password: string,
): Promise<any | null> => {
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
    if (user.enabled){
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        consts.JWT_SECRET,
      );
      return { status: 200, message: 'User found and connected', token };
    } else {
      return { status: 401, error: 'User is disabled. Contact your admin' };
    }
  } catch (error) {
    logger.error(error);
    throw new Error('An error has occurred during connection');
  }
};

const loginWithGmail = async (email: string): Promise<any> => {
  try {
    // Search for the user in the database
    const userFound = await UserModel.findOne({ where: { email } });
    if (userFound) {
      // Generate JWT token
      if (userFound.enabled){
        const token = jwt.sign(
          { userId: userFound.id, role: userFound.role },
          consts.JWT_SECRET,
        );
        return { status: 200, message: 'User found and connected', token };
      } else {
        return { status: 401, error: 'User is disabled. Contact your admin' };
      }
    }
    return { status: 404, message: 'User does not have an account.' };
  } catch (error) {
    logger.error(error);
    return { status: 400, message: 'An error has occurred during connection with Google' };
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
    if (!user) return { status: 400, message: 'The user was not found' };

    // Generate reset token
    const token = generateResetToken(user.dataValues.id);

    // Store reset token in the database
    (user as any).resetToken = token;
    await user.save();

    const link = `${consts.FRONT_END_URL}/#/auth/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      subject: 'Password Reset Request',
      template: 'passwordReset',
      context: { firstName: user.firstName, link }, // Pass data to the template
    };

    // Send email with reset password link
    await sendMail(mailOptions);

    return {
      status: 200,
      message: 'Password reset link sent to your e-mail address',
    };
  } catch (error) {
    throw new Error(error.message || 'An error has occurred');
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

const verifyResetPasswordLink = async (
  token: string,
): Promise<VerifyResetPasswordLinkResponse> => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, consts.JWT_SECRET) as DecodedToken;

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds since Unix epoch
    if (decoded.exp < currentTime) {
      return { status: 401, message: 'Token has expired' }; // Token is expired
    }

    // Check if the token matches a user in your database
    const user = await UserModel.findOne({
      where: { id: decoded.userId },
    });
    if (!user) {
      return {
        status: 401,
        message: 'The token does not correspond to the user',
      };
    }

    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (user.dataValues.resetToken !== token) {
      return {
        status: 401,
        message: 'The token does not correspond to the user',
      };
    }

    // If no errors occurred during verification, the token is valid
    return {
      status: 200,
      message: 'Success',
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
      return {
        status: 200,
        message: 'Password has been updated successfully',
      };
    }
  } catch (err) {
    logger.error(`User update err: %O`, err.message);
    throw new AppError(httpStatus.BAD_REQUEST, 'Password was not updated!');
  }
};

export {
  authentification,
  verifyResetPasswordLink,
  resetPassword,
  updatePassword,
  loginWithGmail,
};
