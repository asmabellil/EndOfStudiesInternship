/* eslint-disable import/no-import-module-exports */
import httpStatus from 'http-status';
import AppError from '@core/utils/appError';
import logger from '@core/utils/logger';
import bcrypt from 'bcrypt';
import UserModel from '@components/user/user.model';
import { IUser } from '@components/user/user.interface';
import { Op } from 'sequelize';
import verifyPasswordComplexity from '@core/utils/passwordComplexity';
import { sendMail } from '@config/mail';

const create = async (user: IUser, options: any = {}): Promise<any> => {
  try {
    const count = await UserModel.count({ where: { email: user.email } });
    if (count > 0) {
      return { status: 400, message: 'Email already used by another user' };
    }

    const saltRounds = 10;

    const password = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);

    // Hash the password asynchronously
    const mailOptions = {
      to: user.email,
      subject: `Welcome to our platform ${user.firstName}`,
      html: `<p> Your password has been automatically generated ${password} </p>`,
    };
    logger.debug('------------ ', password);
    // Send email with password reset link
    // await sendMail(mailOptions);

    const newUser: any = await UserModel.create(
      {
        lastName: user.lastName,
        firstName: user.firstName,
        role: user.role,
        email: user.email,
        userRef: user.userRef,
        jobTitle: user.jobTitle,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        password: hashedPassword,
      },
      options,
    );
    logger.debug(`User created: %O`);

    const { password: _, ...userWithoutPassword } = newUser.dataValues;

    return {
      status: 200,
      message: 'User was created',
      user: userWithoutPassword,
    };
  } catch (err) {
    logger.error(`User create err: %O`, err.message);
    // Throw an error if user creation fails
    return { status: 400, message: `User was not created' ${err.message}` };
  }
};

// Get user by id
const read = async (id: string): Promise<any> => {
  try {
    logger.debug(`Sent user.id ${id}`);
    const user = await UserModel.findByPk(id);
    return {
      status: 200,
      message: 'User found',
      user: user ? (user.toJSON() as IUser) : null,
    };
  } catch (error) {
    return { status: 400, message: `User was not found' ${error.message}` };
  }
};

const update = async (user: IUser): Promise<any> => {
  try {
    const fieldsToUpdate = { ...user };
    delete fieldsToUpdate.id; // Exclude the ID field from being updated
    const affectedRows = await UserModel.update(fieldsToUpdate, {
      where: { id: user.id },
    });
    if (affectedRows[0] > 0) {
      logger.debug(`User updated: %O`, user);
      return { status: 200, message: 'User updated', user };
    }
    return { status: 400, message: 'User was not updated' };
  } catch (err) {
    logger.error(`User update err: %O`, err.message);
    return { status: 400, message: `User was not updated' ${err.message}` };
  }
};

const deleteById = async (id: string): Promise<any> => {
  try {
    const userExist = await UserModel.count({ where: { id } });

    if (userExist !== 1) {
      return { status: 400, message: 'User was not found!' };
    }
    const deletedRowsCount = await UserModel.destroy({
      where: { id },
    });

    if (deletedRowsCount > 0) {
      logger.debug(`User ${id} has been removed`);
      return { status: 200, message: 'User was deleted successfully' };
    }
  } catch (err) {
    logger.error(`User delete err: %O`, err.message);
    return { status: 400, message: err.message };
  }
};

const getListUser = async (searchWord: any): Promise<any> => {
  try {
    const whereClause: any = {};

    if (searchWord) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${searchWord}%` } },
        { lastName: { [Op.like]: `%${searchWord}%` } },
        { email: { [Op.like]: `%${searchWord}%` } },
        { role: { [Op.like]: `%${searchWord}%` } },
        { userRef: { [Op.like]: `%${searchWord}%` } },
        { phoneNumber: { [Op.like]: `%${searchWord}%` } },
        { jobTitle: { [Op.like]: `%${searchWord}%` } },
        { gender: { [Op.like]: `%${searchWord}%` } },
      ];
    }

    const listUser = await UserModel.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['resetToken', 'password'] },
    });

    return { status: 200, message: 'Users fetched successfully', listUser };
  } catch (err) {
    logger.error(`Error fetching user list: %O`, err.message);
    return {
      status: 400,
      message: `Failed to fetch user list: ${err.message}`,
    };
  }
};

// Function to change password with verification from database
async function changePassword(userId, oldPassword, newPassword): Promise<any> {
  // eslint-disable-next-line no-useless-catch
  try {
    // Find the user by ID
    const user = await UserModel.findByPk(userId);

    // If user not found, return an error
    if (!user) {
      return { status: 404, message: 'Failed to update password' };
    }

    // Verify that old and new passwords are not the same
    if (oldPassword === newPassword) {
      return {
        status: 400,
        message: 'Old and new passwords cannot be the same',
      };
    }

    const passwordComplexity = verifyPasswordComplexity(newPassword);
    if (passwordComplexity) {
      return { status: 400, message: passwordComplexity };
    }

    // Verify old password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    // If old password doesn't match, return an error
    if (!passwordMatch) {
      return { status: 400, message: 'Failed to update password' };
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password with the new hashed password
    await user.update({ password: hashedNewPassword });

    return { status: 200, message: 'Password updated successfully' };
  } catch (error) {
    // Handle any errors
    throw error;
  }
}

export { create, read, update, deleteById, getListUser, changePassword };
