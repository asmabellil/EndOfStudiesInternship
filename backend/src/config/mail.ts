/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
import {
  createTransport,
  getTestMessageUrl,
  SendMailOptions,
  Transporter,
} from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import path from 'path'; // Ensure you have this import

import consts from '@config/consts';
import logger from '@core/utils/logger';

const { NODE_ENV } = process.env;

interface MailOptions extends SendMailOptions {
  to?: string;
  subject?: any;
  from?: string;
  template?: string; // Add a template field to your MailOptions interface
  context?: any; // Add a context field to pass data to the template
  html?: string; // Add html as an optional property
}

async function getTransporter(): Promise<Transporter> {
  console.log(consts.MAIL_SENDER);
  
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
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth,
  });
}

// Function to read and compile Handlebars template
async function compileTemplate(
  templateName: string,
  context: any,
): Promise<string> {
  const templatePath = path.join(
    __dirname,
    '..',
    'emailTemplates',
    `${templateName}.hbs`,
  );
  const templateFile = await fs.promises.readFile(templatePath, 'utf8');
  const compiledTemplate = handlebars.compile(templateFile);
  return compiledTemplate(context);
}

// Modified sendMail function to use Handlebars template
export async function sendMail(mail: MailOptions): Promise<any> {
  // If there is no sender in payload, set default sender
  const payload: MailOptions = mail;
  if (!payload.from) {
    payload.from = consts.SMTP_USER;
  }

  // Compile the HTML content from template if provided
  if (mail.template && mail.context) {
    try {
      payload.html = await compileTemplate(mail.template, mail.context);
    } catch (error) {
      console.error('Error compiling email template:', error);
      throw error;
    }
  }

  // Create transporter
  const nodemailer: Transporter = await getTransporter();

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
    throw error;
  }
}
