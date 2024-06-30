import express, { Application } from 'express';
import api from 'api';
import httpContext from 'express-http-context';
import consts from '@config/consts';
import httpLogger from '@core/utils/httpLogger';
import errorHandling from '@core/middlewares/errorHandling.middleware';
import uniqueReqId from '@core/middlewares/uniqueReqId.middleware';
import http404 from '@components/404/404.router';
import swaggerApiDocs from '@components/swagger-ui/swagger.router';
import authRouter from '@components/authentification/auth.router';
import cors from 'cors';
import path from 'path';

const app: Application = express();

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(cors());
app.use(httpContext.middleware);
app.use(httpLogger.successHandler);
app.use(httpLogger.errorHandler);
app.use(uniqueReqId);
app.use(express.json());
app.use(consts.API_ROOT_PATH, api);
app.use('/', authRouter);
app.use(swaggerApiDocs);
app.use(http404);

app.use(errorHandling);

export default app;