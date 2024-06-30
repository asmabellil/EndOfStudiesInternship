import { Server } from 'http';
import app from '@app';
import config from '@config/config';
import logger from '@core/utils/logger';
import errorHandler from 'core/utils/errorHandler';
import { initialize, close } from './db';

const { port } = config;

const server: Server = app.listen(port, async (): Promise<void> => {
  try {
    await initialize();
    logger.info(`Application listens on PORT: ${port}`);
  } catch (err) {
    logger.error('Error initializing database connection', err);
    process.exit(1);
  }
});

const exitHandler = (): void => {
  if (app) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error): void => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    exitHandler();
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', (reason: Error) => {
  throw reason;
});

process.on('SIGINT', async () => {
  try {
    await close();
    logger.info('Server and database connection pool closed');
    process.exit(0);
  } catch (err) {
    logger.error('Error closing server and database connection pool', err);
    process.exit(1);
  }
});