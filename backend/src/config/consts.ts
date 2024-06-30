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

// user Role
const ROLE = {
  SURTEC_USER: 'SURTEC_USER',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  INSTALLATEUR: 'INSTALLATEUR'
};

// Password Config
const PASSWORD_MIN_LENGTH = process.env.PASSWORD_MIN_LENGTH;
const PASSWORD_REQUIRE_UPPERCASE = process.env.PASSWORD_REQUIRE_UPPERCASE;
const PASSWORD_REQUIRE_LOWERCASE = process.env.PASSWORD_REQUIRE_LOWERCASE;
const PASSWORD_REQUIRE_DIGIT = process.env.PASSWORD_REQUIRE_DIGIT;
const PASSWORD_REQUIRE_SPECIAL_CHAR = process.env.PASSWORD_REQUIRE_SPECIAL_CHAR;

const initialConfigData = [
  { index: 0, label: 'Démarrage Centrale', notification: true, history: false },
  { index: 1, label: 'SOS', notification: true, history: false },
  { index: 2, label: 'Fraude', notification: true, history: false },
  { index: 3, label: 'Code sous contrainte', notification: true, history: false },
  { index: 4, label: 'Brouillage', notification: true, history: false },
  { index: 5, label: 'Feu', notification: true, history: false },
  { index: 6, label: 'Autoprotection périphérique', notification: true, history: false },
  { index: 7, label: 'Défaut pile périphérique', notification: true, history: false },
  { index: 8, label: 'Défaut supervision périphérique', notification: true, history: false },
  { index: 9, label: 'Inhibition périphérique', notification: true, history: false },
  { index: 10, label: 'Détecteur encrassé', notification: true, history: false },
  { index: 11, label: 'Antimasque', notification: true, history: false },
  { index: 12, label: 'Capture Image', notification: true, history: false },
  { index: 13, label: 'Défaut pile périphérique secondaire', notification: true, history: false },
  { index: 14, label: 'Entrée mode maintenance', notification: true, history: false },
  { index: 15, label: 'Autoprotection centrale', notification: true, history: false },
  { index: 16, label: 'Test cyclique système', notification: true, history: false },
  { index: 17, label: 'Défaut secteur centrale', notification: true, history: false },
  { index: 18, label: 'Défaut batterie centrale', notification: true, history: false },
  { index: 19, label: 'Défaut transmetteur', notification: true, history: false },
  { index: 20, label: 'Alarme filaire', notification: true, history: false },
  { index: 21, label: 'Détection 1', notification: true, history: false },
  { index: 22, label: 'Détection 2', notification: true, history: false },
  { index: 23, label: 'Détection 3', notification: true, history: false },
  { index: 24, label: 'Détection 4', notification: true, history: false },
  { index: 25, label: 'Détection 5', notification: true, history: false },
  { index: 26, label: 'Détection 6', notification: true, history: false },
  { index: 27, label: 'Détection 7', notification: true, history: false },
  { index: 28, label: 'Détection 8', notification: true, history: false },
  { index: 29, label: 'Détection 9', notification: true, history: false },
  { index: 30, label: 'Détection 10', notification: true, history: false },
  { index: 31, label: 'Détection 11', notification: true, history: false },
  { index: 32, label: 'Détection 12', notification: true, history: false },
  { index: 33, label: 'Détection 13', notification: true, history: false },
  { index: 34, label: 'Détection 14', notification: true, history: false },
  { index: 35, label: 'Détection 15', notification: true, history: false },
  { index: 36, label: 'Détection 16', notification: true, history: false },
  { index: 37, label: 'Détection 17', notification: true, history: false },
  { index: 38, label: 'Détection 18', notification: true, history: false },
  { index: 39, label: 'Détection 19', notification: true, history: false },
  { index: 40, label: 'Détection 20', notification: true, history: false },
  { index: 41, label: 'Détection 21', notification: true, history: false },
  { index: 42, label: 'Détection 22', notification: true, history: false },
  { index: 43, label: 'Détection 23', notification: true, history: false },
  { index: 44, label: 'Détection 24', notification: true, history: false },
  { index: 45, label: 'Détection 25', notification: true, history: false },
  { index: 46, label: 'Détection 26', notification: true, history: false },
  { index: 47, label: 'Détection 27', notification: true, history: false },
  { index: 48, label: 'Détection 28', notification: true, history: false },
  { index: 49, label: 'Détection 29', notification: true, history: false },
  { index: 50, label: 'Détection 30', notification: true, history: false },
  { index: 51, label: 'Mise en service 1 : Totale', notification: true, history: false },
  { index: 52, label: 'Mise en service 1 : Totale Forcée', notification: true, history: false },
  { index: 53, label: 'Mise en service 1 : Partielle', notification: true, history: false },
  { index: 54, label: 'Mise en service 1 : Partielle Forcée', notification: true, history: false },
  { index: 55, label: 'Mise en service 2 : Totale', notification: true, history: false },
  { index: 56, label: 'Mise en service 2 : Totale Forcée', notification: true, history: false },
  { index: 57, label: 'Mise en service 2 : Partielle', notification: true, history: false },
  { index: 58, label: 'Mise en service 2 : Partielle Forcée', notification: true, history: false },
  { index: 59, label: 'Mise en service 3 : Totale', notification: true, history: false },
  { index: 60, label: 'Mise en service 3 : Totale Forcée', notification: true, history: false },
  { index: 61, label: 'Mise en service 3 : Partielle', notification: true, history: false },
  { index: 62, label: 'Mise en service 3 : Partielle Forcée', notification: true, history: false },
  { index: 63, label: 'Mise en service 4 : Totale', notification: true, history: false },
  { index: 64, label: 'Mise en service 4 : Totale Forcée', notification: true, history: false },
  { index: 65, label: 'Mise en service 4 : Partielle', notification: true, history: false },
  { index: 66, label: 'Mise en service 4 : Partielle Forcée', notification: true, history: false },
  { index: 67, label: 'Refus Mode Maintenance', notification: true, history: false },
  { index: 68, label: 'Arrêt Centrale', notification: true, history: false },
];  

export const TECHNICAL = 'TECHNICAL';
export const REMOTESURVEILLANCE = 'REMOTESURVEILLANCE';

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
  FRONT_END_URL,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIRE_SPECIAL_CHAR,
  PASSWORD_REQUIRE_DIGIT,
  PASSWORD_REQUIRE_LOWERCASE,
  PASSWORD_REQUIRE_UPPERCASE,
  initialConfigData,
  TECHNICAL,
  REMOTESURVEILLANCE,
};
