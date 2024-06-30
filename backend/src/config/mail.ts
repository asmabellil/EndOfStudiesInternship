import {
  createTransport,
  getTestMessageUrl,
  SendMailOptions,
  Transporter,
} from 'nodemailer';
import consts from '@config/consts';
import logger from '@core/utils/logger';

const { NODE_ENV } = process.env;

interface MailOptions extends SendMailOptions {
  to?: string;
  subject?: any;
  html?: any;
  from?: string;
}

async function getTransporter(): Promise<Transporter> {
  let auth: { user: string; pass: string };
  if (!consts.SMTP_PASSWORD) {
    auth = {
      user: 'apikey',
      pass: consts.API_KEY,
    };
  } else {
    auth = {
      user: consts.MAIL_SENDER,
      pass: consts.SMTP_PASSWORD,
    };
  }
  return createTransport({
    host: 'smtp-mail.outlook.com',                  // hostname
    service: 'outlook',                             // service name
    secureConnection: false,
    tls: {
      ciphers: 'SSLv3'                            // tls version
    },
    port: 587,                                      // port
    auth: {
      user: consts.MAIL_SENDER,
      pass: consts.SMTP_PASSWORD,
    }
  });
}

// eslint-disable-next-line import/prefer-default-export
export async function sendMail(mail: MailOptions): Promise<any> {
  // If there is no sender in payload, set default sender
  const payload: MailOptions = mail;
  if (!payload.from) {
    payload.from = consts.SMTP_USER;
  }
  // Create transporter
  const nodemailer: Transporter = await getTransporter();
  // Send mail
  /* const mailInfo = await nodemailer.sendMail({
    ...payload,
    timeout: 5000,
  });

  if (mailInfo) {
    if (NODE_ENV !== 'production') {
      logger.info(`Mail Preview URL is ${getTestMessageUrl(mailInfo)}`);
    }

    // Return mail response
    return mailInfo;
  }
  return mailInfo; */

  try {
    const mailInfo = await nodemailer.sendMail(payload);
    if (mailInfo) {
      if (NODE_ENV !== 'production') {
        logger.info(`Mail Preview URL is ${getTestMessageUrl(mailInfo)}`);
      }
      return mailInfo;
    }
  } catch (error) {
    // Handle email sending errors
    console.error('Error sending email:', error);
    throw error; // Optionally re-throw the error if you want to handle it further up the call stack
  }

}
