/* eslint-disable import/no-import-module-exports */
import logger from '@core/utils/logger';
import { ICheckIn } from '@components/checkIn/checkIn.interface';
import { sendMail } from '@config/mail';
import CheckIn from '@components/checkIn/checkIn.model';
import User from '@components/user/user.model';

const create = async (checkIn: ICheckIn, options: any = {}): Promise<any> => {
  try {
    const newCheckIn: any = await CheckIn.create(
      {
        checkInType: checkIn.checkInType,
        checkInDate: checkIn.checkInDate,
        userId: checkIn.userId,
      },
      options,
    );
    logger.debug(`CheckIn created: %O`);
    return {
      status: 200,
      message: 'CheckIn was created',
      checkIn: newCheckIn,
    };
  } catch (err) {
    logger.error(`CheckIn create err: %O`, err.message);
    // Throw an error if checkIn creation fails
    return { status: 400, message: `CheckIn was not created' ${err.message}` };
  }
};

// Get checkIn by id
const read = async (id: string): Promise<any> => {
  try {
    logger.debug(`Sent checkIn.id ${id}`);
    const checkIn = await CheckIn.findByPk(id);

    if (checkIn) {
      return {
        status: 200,
        message: 'CheckIn found',
        checkIn: checkIn.toJSON() ,
      };
    }
    return {
      status: 404,
      message: 'CheckIn not found',
      checkIn: null,
    };
  } catch (error) {
    return {
      status: 400,
      message: `CheckIn was not found: ${error.message}`,
    };
  }
};

// Get all checkIns for a user by userId
const readAllByUserId = async (userId: string): Promise<any> => {
  try {
    logger.debug(`Sent user.id ${userId}`);
    const checkIns = await CheckIn.findAll({ where: { userId } });

    if (checkIns.length > 0) {
      return {
        status: 200,
        message: 'CheckIns found',
        checkIns: checkIns.map((checkIn) => checkIn.toJSON()),
      };
    }
    return {
      status: 404,
      message: 'No checkIns found for this user',
      checkIns: [],
    };
  } catch (error) {
    return {
      status: 400,
      message: `CheckIns could not be retrieved: ${error.message}`,
    };
  }
};

const update = async (checkIn: any): Promise<any> => {
  try {
    const fieldsToUpdate = { ...checkIn };
    delete fieldsToUpdate.id; // Exclude the ID field from being updated
    const affectedRows = await CheckIn.update(fieldsToUpdate, {
      where: { id: checkIn.id },
    });

    if (affectedRows[0] > 0) {
      logger.debug(`CheckIn updated: %O`, checkIn);
      return { status: 200, message: 'CheckIn updated', checkIn };
    }
    return { status: 400, message: 'CheckIn was not updated' };
  } catch (err) {
    logger.error(`CheckIn update err: %O`, err.message);
    return { status: 400, message: `CheckIn was not updated' ${err.message}` };
  }
};

const deleteById = async (id: string): Promise<any> => {
  try {
    const checkInExist = await CheckIn.count({ where: { id } });

    if (checkInExist !== 1) {
      return { status: 400, message: 'CheckIn was not found!' };
    }
    const deletedRowsCount = await CheckIn.destroy({
      where: { id },
    });

    if (deletedRowsCount > 0) {
      logger.debug(`CheckIn ${id} has been removed`);
      return { status: 200, message: 'CheckIn was deleted successfully' };
    }
  } catch (err) {
    logger.error(`CheckIn delete err: %O`, err.message);
    return { status: 400, message: err.message };
  }
};

const getList = async (): Promise<any> => {
  try {
    const listCheckIn = await CheckIn.findAndCountAll();

    return { status: 200, message: 'CheckIns fetched successfully', listCheckIn };
  } catch (err) {
    logger.error(`Error fetching checkIn list: %O`, err.message);
    return {
      status: 400,
      message: `Failed to fetch checkIn list: ${err.message}`,
    };
  }
};

export { create, read, update, deleteById, getList, readAllByUserId };
