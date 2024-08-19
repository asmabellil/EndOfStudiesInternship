import { agent as request } from 'supertest';
import httpStatus from 'http-status';
import app from '@app';
import AppError from '@core/utils/appError';

const createPret = jest.fn();
const updatePret = jest.fn();
const deletePret = jest.fn();

const pretMock = {
  name: 'John',
  email: 'john@miwu.pl',
};

const noDataPretMock = {};

// mock api key middleware to pass the test
jest.mock('@core/middlewares/apiKey.middleware', () =>
  jest.fn((req: Request, res: Response, next) => next()),
);

jest.mock('@components/pret/pret.service', () => ({
  create: () => createPret(),
  update: () => updatePret(),
  delete: () => deletePret(),
}));

describe('Pret API', () => {
  describe('Create Pret [POST] /pret/', () => {
    test('should return 201 status if pret created succesfully', async () => {
      await request(app)
        .post('/api/pret')
        .send(pretMock)
        .expect(httpStatus.CREATED);
    });

    test('should return 400 status with validation error message if missing pret data', async () => {
      const res = await request(app)
        .post('/api/pret')
        .send(noDataPretMock)
        .expect(httpStatus.BAD_REQUEST);
      expect(res.body.error).toContain('is required');
    });

    test('should return 400 status with error message if something went wrong with creating pret', async () => {
      const ERROR_MESSAGE = 'Pret was not created!';
      createPret.mockImplementation(() => {
        throw new AppError(httpStatus.BAD_REQUEST, ERROR_MESSAGE);
      });
      const res = await request(app)
        .post('/api/pret')
        .send(pretMock)
        .expect(httpStatus.BAD_REQUEST);
      expect(res.body.error).toBe(ERROR_MESSAGE);
    });
  });
});
