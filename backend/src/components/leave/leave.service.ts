/* eslint-disable import/no-import-module-exports */
import logger from '@core/utils/logger';
import { ILeave } from '@components/leave/leave.interface';
import { Op } from 'sequelize';
import { sendMail } from '@config/mail';
import Leave from '@components/leave/leave.model';
import User from '@components/user/user.model';

const create = async (leave: ILeave, options: any = {}): Promise<any> => {
  try {
    const newLeave: any = await Leave.create(
      {
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
        status: leave.startDate,
        userId: leave.userId,
      },
      options,
    );
    logger.debug(`Leave created: %O`);
    return {
      status: 200,
      message: 'Leave was created',
      leave: newLeave,
    };
  } catch (err) {
    logger.error(`Leave create err: %O`, err.message);
    // Throw an error if leave creation fails
    return { status: 400, message: `Leave was not created' ${err.message}` };
  }
};

// Get leave by id
const read = async (id: string): Promise<any> => {
  try {
    logger.debug(`Sent leave.id ${id}`);
    const leave = await Leave.findByPk(id);

    if (leave) {
      return {
        status: 200,
        message: 'Leave found',
        leave: leave.toJSON() ,
      };
    }
    return {
      status: 404,
      message: 'Leave not found',
      leave: null,
    };
  } catch (error) {
    return {
      status: 400,
      message: `Leave was not found: ${error.message}`,
    };
  }
};

// Get all leaves for a user by userId
const readAllByUserId = async (userId: string): Promise<any> => {
  try {
    logger.debug(`Sent user.id ${userId}`);
    const leaves = await Leave.findAll({ where: { userId } });

    if (leaves.length > 0) {
      return {
        status: 200,
        message: 'Leaves found',
        leaves: leaves.map((leave) => leave.toJSON()),
      };
    }
    return {
      status: 404,
      message: 'No leaves found for this user',
      leaves: [],
    };
  } catch (error) {
    return {
      status: 400,
      message: `Leaves could not be retrieved: ${error.message}`,
    };
  }
};

const update = async (leave: any): Promise<any> => {
  try {
    const fieldsToUpdate = { ...leave };
    delete fieldsToUpdate.id; // Exclude the ID field from being updated
    const affectedRows = await Leave.update(fieldsToUpdate, {
      where: { id: leave.id },
    });
    // Fetch user details
    const user = await User.findByPk(leave.userId);

    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);

    console.log(user.email, leave.status);
    

    if (leave.status === 'Approved') {
      const mailOptions = {
        to: user.email,
        subject: 'Leave Request Accepted',
        template: 'leaveAccepted',
        context: {
          firstName: user.firstName,
          startDate: startDate.toDateString(),
          endDate: endDate.toDateString(),
          leaveType: leave.leaveType,
          reason: leave.reason
        }
      };
      await sendMail(mailOptions);
    } else if (leave.status === 'Rejected') {
      const mailOptions = {
        to: user.email,
        subject: 'Leave Request Declined',
        template: 'leaveDeclined',
        context: {
          firstName: user.firstName,
          startDate: startDate.toDateString(),
          endDate: endDate.toDateString(),
          leaveType: leave.leaveType,
          rejectionReason: leave.rejectionReason
        }
      };
      await sendMail(mailOptions);
    }
    if (affectedRows[0] > 0) {
      logger.debug(`Leave updated: %O`, leave);
      return { status: 200, message: 'Leave updated', leave };
    }
    return { status: 400, message: 'Leave was not updated' };
  } catch (err) {
    logger.error(`Leave update err: %O`, err.message);
    return { status: 400, message: `Leave was not updated' ${err.message}` };
  }
};

const deleteById = async (id: string): Promise<any> => {
  try {
    const leaveExist = await Leave.count({ where: { id } });

    if (leaveExist !== 1) {
      return { status: 400, message: 'Leave was not found!' };
    }
    const deletedRowsCount = await Leave.destroy({
      where: { id },
    });

    if (deletedRowsCount > 0) {
      logger.debug(`Leave ${id} has been removed`);
      return { status: 200, message: 'Leave was deleted successfully' };
    }
  } catch (err) {
    logger.error(`Leave delete err: %O`, err.message);
    return { status: 400, message: err.message };
  }
};

const getList = async (): Promise<any> => {
  try {
    const listLeave = await Leave.findAndCountAll();

    return { status: 200, message: 'Leaves fetched successfully', listLeave };
  } catch (err) {
    logger.error(`Error fetching leave list: %O`, err.message);
    return {
      status: 400,
      message: `Failed to fetch leave list: ${err.message}`,
    };
  }
};

export { create, read, update, deleteById, getList, readAllByUserId };
