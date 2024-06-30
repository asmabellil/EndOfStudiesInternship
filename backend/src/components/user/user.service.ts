/* eslint-disable import/no-import-module-exports */
import httpStatus from 'http-status';
import AppError from '@core/utils/appError';
import logger from '@core/utils/logger';
import bcrypt from 'bcrypt';
import UserModel from '@components/user/user.model';
import { IUser } from '@components/user/user.interface';
import { Op } from 'sequelize';
import verifyPasswordComplexity from '@core/utils/passwordComplexity';
import consts from '@config/consts';
import ScheduleModel from '@components/user/schedule.model';

const create = async (user: IUser, options: any = {}): Promise<any> => {
  try {
    const count = await UserModel.count({ where: { email: user.email } });
    if (count > 0) {
      return { status: 400, message: 'Email already used by another user' };
    }
    const passwordComplexity = verifyPasswordComplexity(user.password);
    if (passwordComplexity) {
      return { status: 400, message: passwordComplexity };
    }
    const saltRounds = 10;
    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    // Create the user with the hashed password
    const newUser = await UserModel.create(
      {
        last_name: user.last_name,
        first_name: user.first_name,
        role: user.role,
        email: user.email,
        language: user.language,
        comment: user.comment,
        password: hashedPassword,
      },
      options,
    );
    logger.debug(`User created: %O`, newUser);
    return { status: 200, message: 'User was created', user: newUser };
  } catch (err) {
    logger.error(`User create err: %O`, err.message);
    // Throw an error if user creation fails
    throw new AppError(httpStatus.BAD_REQUEST, 'User was not created!');
  }
};

// Get user by id
const read = async (id: string): Promise<IUser | null> => {
  logger.debug(`Sent user.id ${id}`);
  const user = await UserModel.findByPk(id);
  return user ? (user.toJSON() as IUser) : null;
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
    return { status: 404, message: 'User not found' };
  } catch (err) {
    logger.error(`User update err: %O`, err.message);
    return { status: 400, message: 'User was not updated' };
  }
};

const deleteById = async (id: string, role: string): Promise<any> => {
  try {
    const userExist = await UserModel.count({ where: { role, id } });

    if (userExist !== 1) {
      return { status: 400, message: 'User was not found!' };
    }
    // Count the number of users with the role "SURTECH_USER" excluding the user to be deleted
    const count = await UserModel.count({ where: { role } });

    if (count <= 1) {
      return {
        status: 400,
        message: 'Cannot delete the last user with role SURTECH_USER',
      };
    }
    const deletedRowsCount = await UserModel.destroy({
      where: { id, role },
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

interface PaginationOptions {
  page: number;
  limit: number;
}

const getListUser = async (
  paginationOptions: PaginationOptions,
  role: string,
  searchParams: any,
): Promise<any> => {
  try {
    const { page, limit } = paginationOptions;
    const offset = (page - 1) * limit;

    const whereClause: any = { role };

    if (searchParams) {
      Object.keys(searchParams).forEach((key) => {
        whereClause[key] = { [Op.like]: `%${searchParams[key]}%` };
      });
    }

    const listUser = await UserModel.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['resetToken', 'password', 'updatedAt', 'role'] },
      limit,
      offset,
    });
    return listUser;
  } catch (err) {
    logger.error(`Error fetching user list: %O`, err.message);
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to fetch user list');
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

const getListTechnicians = async (
  paginationOptions: PaginationOptions
): Promise<any> => {
  try {
    const { page, limit } = paginationOptions;
    const offset = (page - 1) * limit;

    const countResult = await UserModel.count({
      where: {
        role: consts.ROLE.INSTALLATEUR,
      },
    });

    const listTechnicians = await UserModel.findAll({
      where: {
        role: consts.ROLE.INSTALLATEUR
      },
      attributes: {
        exclude: [
          'resetToken',
          'password',
          'updatedAt',
          'role',
          'language',
          'comment',
        ],
      },
      include: [{
        model: ScheduleModel,
        as: 'schedule',
        attributes: ['day', 'startTime', 'endTime']
      }],
      limit,
      offset,
    });

    const result = {
      count: countResult,
      rows: listTechnicians,
    };

    return result;
  } catch (err) {
    logger.error(`Error fetching technician list: %O`, err.message);
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to fetch technician list');
  }
};

const createTechnician = async (technicianData: any): Promise<any> => {
    try {
      const count = await UserModel.count({ where: { email: technicianData.email } });
      if (count > 0) {
        return { status: 400, message: 'Email already used by another user' };
      }
      const passwordComplexity = verifyPasswordComplexity(technicianData.password);
      if (passwordComplexity) {
        return { status: 400, message: passwordComplexity };
      }
      const saltRounds = 10;
      // Hash the password asynchronously
      const hashedPassword = await bcrypt.hash(technicianData.password, saltRounds);
      // Create the user with the hashed password
      const newTechnician = await UserModel.create(
        {
          last_name: technicianData.last_name,
          first_name: technicianData.first_name,
          role: 'INSTALLATEUR',
          email: technicianData.email,
          language: technicianData.language,
          comment: technicianData.comment,
          password: hashedPassword,
        },
      );
  
      if (technicianData.schedules && technicianData.schedules.length > 0) {
        await Promise.all(
          technicianData.schedules.map(async (scheduleData) => {
            await ScheduleModel.create({
              day: scheduleData.day,
              startTime: scheduleData.startTime,
              endTime: scheduleData.endTime,
              userId: newTechnician.id,
            });
          })
        );
      }
      
  
      logger.debug(`Technician created: %O`, newTechnician);
      return { status: 200, message: 'User was created', user: newTechnician };
    } catch (err) {
      logger.error(`Technician create err: %O`, err.message);
      throw new AppError(httpStatus.BAD_REQUEST, 'Technician was not created!');
    }
  };


  const updateTechnician = async (technicianId: string, technicianData: any): Promise<any> => {
    try {
      const technician = await UserModel.findByPk(technicianId);
      if (!technician) {
        return { status: 404, message: 'Technician not found' };
      }
  
      if (technician.role !== 'INSTALLATEUR') {
        return { status: 400, message: 'User is not a technician' };
      }
  
      const existingUserCount = await UserModel.count({
        where: { email: technicianData.email, id: { [Op.ne]: technicianId } },
      });
      if (existingUserCount > 0) {
        return { status: 400, message: 'Email already used by another user' };
      }
  
      let updatedData: any = {
        last_name: technicianData.last_name,
        first_name: technicianData.first_name,
        email: technicianData.email,
        language: technicianData.language,
        comment: technicianData.comment,
      };
  
      if (technicianData.password) {
        const passwordComplexity = verifyPasswordComplexity(technicianData.password);
        if (passwordComplexity) {
          return { status: 400, message: passwordComplexity };
        }
  
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(technicianData.password, saltRounds);
        updatedData.password = hashedPassword;
      }
  
      const updatedTechnician = await technician.update(updatedData);
  
      if (technicianData.schedules && technicianData.schedules.length > 0) {
        await ScheduleModel.destroy({ where: { userId: technicianId } });
  
        await Promise.all(
          technicianData.schedules.map(async (scheduleData: any) => {
            await ScheduleModel.create({
              day: scheduleData.day,
              startTime: scheduleData.startTime,
              endTime: scheduleData.endTime,
              userId: technicianId,
            });
          })
        );
      }
  
      logger.debug(`Technician updated: %O`, updatedTechnician);
      return { status: 200, message: 'Technician updated successfully', user: updatedTechnician };
    } catch (err) {
      logger.error(`Technician update err: %O`, err.message);
      throw new AppError(httpStatus.BAD_REQUEST, 'Technician was not updated!');
    }
  };
  


  const deleteTechnician = async (technicianId: string): Promise<any> => {
    try {
      const technician = await UserModel.findByPk(technicianId);
      if (!technician) {
        return { status: 404, message: 'Technician not found' };
      }

      if (technician.role !== 'INSTALLATEUR') {
        return { status: 400, message: 'User is not a technician' };
      }
  
      await ScheduleModel.destroy({ where: { userId: technicianId } });
      await technician.destroy();
  
      logger.debug(`Technician deleted: %O`, technician);
      return { status: 200, message: 'Technician deleted successfully' };
    } catch (err) {
      logger.error(`Technician delete err: %O`, err.message);
      throw new AppError(httpStatus.BAD_REQUEST, 'Technician was not deleted!');
    }
  };
  

export {
  create,
  read,
  update,
  deleteById,
  getListUser,
  changePassword,
  getListTechnicians,
  createTechnician,
  updateTechnician,
  deleteTechnician
};
