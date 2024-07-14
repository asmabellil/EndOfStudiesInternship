/* eslint-disable prefer-destructuring */
require('dotenv').config({ path: '.env.local' });

// Routes
const API_ROOT_PATH = '/api';
const API_DOCS_PATH = '/api-docs';

// Token
const API_KEY_TOKEN = process.env.API_KEY_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

// MQTT CONFIG
const protocol = process.env.protocol;
const host = process.env.host;
const port = process.env.port;
const clientId = process.env.clientId;
const usernameMQTT = process.env.usernameMQTT;
const passwordMQTT = process.env.passwordMQTT;

// SMTP CONFIG
const SMTP_HOST = process.env.SMTP_HOST;
const SECURITY = process.env.SECURITY;
const SMTP_PORT = process.env.SMTP_PORT;
const API_KEY = process.env.API_KEY;
const MAIL_SENDER = process.env.MAIL_SENDER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_USER = process.env.SMTP_USER;

// Domain
const domain = process.env.domain;
const FRONT_END_URL = process.env.FRONT_END_URL;
const FRONT_END_URL_API = process.env.FRONT_END_URL_API;

// Colors
const MAIN_COLOR = process.env.MAIN_COLOR;
const SECOND_COLOR = process.env.SECOND_COLOR;

// user Role
const ROLE = {
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee',
};

const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
};

const LEAVE_TYPE = {
  Sick: 'Sick',
  Vacation: 'Vacation',
  Maternity: 'Maternity',
};

const LEAVE_STATUS = {
  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
};

// Google Config
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Password Config
const PASSWORD_MIN_LENGTH = process.env.PASSWORD_MIN_LENGTH;
const PASSWORD_REQUIRE_UPPERCASE = process.env.PASSWORD_REQUIRE_UPPERCASE;
const PASSWORD_REQUIRE_LOWERCASE = process.env.PASSWORD_REQUIRE_LOWERCASE;
const PASSWORD_REQUIRE_DIGIT = process.env.PASSWORD_REQUIRE_DIGIT;
const PASSWORD_REQUIRE_SPECIAL_CHAR = process.env.PASSWORD_REQUIRE_SPECIAL_CHAR;

export default {
  API_ROOT_PATH,
  API_DOCS_PATH,
  protocol,
  host,
  port,
  clientId,
  usernameMQTT,
  passwordMQTT,
  API_KEY_TOKEN,
  JWT_SECRET,
  SMTP_HOST,
  SECURITY,
  SMTP_PORT,
  API_KEY,
  MAIL_SENDER,
  SMTP_PASSWORD,
  SMTP_USER,
  domain,
  ROLE,
  GENDER,
  FRONT_END_URL,
  FRONT_END_URL_API,
  MAIN_COLOR,
  SECOND_COLOR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIRE_SPECIAL_CHAR,
  PASSWORD_REQUIRE_DIGIT,
  PASSWORD_REQUIRE_LOWERCASE,
  PASSWORD_REQUIRE_UPPERCASE,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  LEAVE_TYPE,
  LEAVE_STATUS,
};
