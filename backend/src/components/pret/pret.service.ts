/* eslint-disable import/no-import-module-exports */
import logger from '@core/utils/logger';
import PretModel from '@components/pret/pret.model';
import { IPret } from '@components/pret/pret.interface';
import { Op } from 'sequelize';
import { Echance, Pret, User } from 'db';
import PDFDocument from 'pdfkit';
import path, { dirname } from 'path';
import fs from 'fs';
import moment from 'moment';
import { sendMail } from '@config/mail';

const create = async (pret: IPret, options: any = {}): Promise<any> => {
  try {
    const interest = parseFloat(process.env.INTEREST);
    const montantARemb = pret.montantPret + (pret.montantPret * interest) / 100;
    const montantRembParMois =
      (montantARemb - pret.montant1ereRemb) / pret.echanceNumber;
    const soldRest = montantARemb - pret.montant1ereRemb;
    const newPret: any = await PretModel.create(
      {
        pretRef: pret.pretRef,
        dateObtention: pret.dateObtention,
        dateEcheance: pret.dateEcheance,
        montantPret: pret.montantPret,
        montant1ereRemb: pret.montant1ereRemb,
        echanceNumber: pret.echanceNumber,
        userId: pret.userId,
        montantARemb,
        montantRembParMois,
        soldRest,
      },
      options,
    );
    logger.debug(`Pret created: %O`);

    return {
      status: 200,
      message: 'Pret was created',
      pret: newPret.toJSON(),
    };
  } catch (err) {
    logger.error(`Pret create err: %O`, err.message);
    // Throw an error if pret creation fails
    return { status: 400, message: `Pret was not created' ${err.message}` };
  }
};

// Get pret by id
const read = async (id: string): Promise<any> => {
  try {
    logger.debug(`Sent pret.id ${id}`);
    const pret = await PretModel.findByPk(id);

    if (pret) {
      return {
        status: 200,
        message: 'Pret found',
        pret: pret.toJSON() as IPret,
      };
    }
    return {
      status: 404,
      message: 'Pret not found',
      pret: null,
    };
  } catch (error) {
    return {
      status: 400,
      message: `Pret was not found: ${error.message}`,
    };
  }
};

const update = async (pret: IPret): Promise<any> => {
  try {
    console.log(pret);

    const interest = parseFloat(process.env.INTEREST);
    const montantARemb = pret.montantPret + (pret.montantPret * interest) / 100;
    const montantRembParMois =
      (montantARemb - pret.montant1ereRemb) / pret.echanceNumber;
    const soldRest = montantARemb - pret.montant1ereRemb;

    const fieldsToUpdate = {
      ...pret,
      montantARemb,
      montantRembParMois,
      soldRest,
    };
    console.log(fieldsToUpdate);

    delete fieldsToUpdate.id; // Exclude the ID field from being updated
    const affectedRows = await PretModel.update(fieldsToUpdate, {
      where: { id: pret.id },
    });
    if (affectedRows[0] > 0) {
      if (pret.status === 'Accepted') {
        try {
          const { echanceNumber } = pret;
          const dateEcheance = new Date(pret.dateEcheance);
          const pretId = pret.id;
          const echance = [];
          for (let i = 0; i < echanceNumber; i++) {
            const newDateEcheance = new Date(dateEcheance);
            newDateEcheance.setMonth(newDateEcheance.getMonth() + i);
            echance.push({
              dateEchance: newDateEcheance,
              montantRembourse: montantRembParMois,
              pretId,
            });
          }
          await Echance.bulkCreate(echance);

          // Send "Accepted" email
          const user = await User.findByPk(pret.userId); // Assuming you have a User model
          const mailOptions = {
            to: user.email,
            subject: 'Pret Accepted',
            template: 'pretAccepted',
            context: {
              firstName: user.firstName,
              pretRef: pret.pretRef,
              montantPret: pret.montantPret,
              montantARemb: montantARemb,
              dateEcheance: dateEcheance.toLocaleDateString(),
            },
          };
          await sendMail(mailOptions);

          return { status: 200, message: 'Pret updated and email sent', pret };
        } catch (error) {
          return {
            status: 400,
            message: `Error creating echances or sending email: ${error.message}`,
          };
        }
      } else if (pret.status === 'Rejected') {
        // Send "Rejected" email
        const user = await User.findByPk(pret.userId); // Assuming you have a User model
        const mailOptions = {
          to: user.email,
          subject: 'Pret Rejected',
          template: 'pretRejected',
          context: {
            firstName: user.firstName,
            pretRef: pret.pretRef,
          },
        };
        await sendMail(mailOptions);

        return { status: 200, message: 'Pret updated and rejection email sent', pret };
      } else {
        return { status: 200, message: 'Pret updated', pret };
      }
    }
    return { status: 400, message: 'Pret was not updated' };
  } catch (err) {
    logger.error(`Pret update err: %O`, err.message);
    return { status: 400, message: `Pret was not updated' ${err.message}` };
  }
};

const deleteById = async (id: string): Promise<any> => {
  try {
    const pretExist = await PretModel.count({ where: { id } });

    if (pretExist !== 1) {
      return { status: 400, message: 'Pret was not found!' };
    }
    const deletedRowsCount = await PretModel.destroy({
      where: { id },
    });

    if (deletedRowsCount > 0) {
      logger.debug(`Pret ${id} has been removed`);
      return { status: 200, message: 'Pret was deleted successfully' };
    }
  } catch (err) {
    logger.error(`Pret delete err: %O`, err.message);
    return { status: 400, message: err.message };
  }
};

const getListPret = async (searchWord: any): Promise<any> => {
  try {
    const whereClause: any = {};

    const listPret = await PretModel.findAndCountAll({
      where: whereClause,
    });

    return { status: 200, message: 'Prets fetched successfully', listPret };
  } catch (err) {
    logger.error(`Error fetching pret list: %O`, err.message);
    return {
      status: 400,
      message: `Failed to fetch pret list: ${err.message}`,
    };
  }
};

const getListPretByUserId = async (userId: any): Promise<any> => {
  try {
    const listPret = await PretModel.findAndCountAll({
      where: { userId },
    });

    return { status: 200, message: 'Prets fetched successfully', listPret };
  } catch (err) {
    logger.error(`Error fetching pret list: %O`, err.message);
    return {
      status: 400,
      message: `Failed to fetch pret list: ${err.message}`,
    };
  }
};

const getListEchances = async (): Promise<any> => {
  try {
    const listEchances = await Echance.findAndCountAll({});

    return {
      status: 200,
      message: 'Echances fetched successfully',
      listEchances,
    };
  } catch (err) {
    logger.error(`Error fetching Echances list: %O`, err.message);
    return {
      status: 400,
      message: `Failed to fetch Echances list: ${err.message}`,
    };
  }
};

const getListEchancesByUserId = async (userId: any): Promise<any> => {
  try {
    const listEchances = await Echance.findAndCountAll({
      include: [{ model: PretModel, where: { userId } }],
    });

    return {
      status: 200,
      message: 'Echances fetched successfully',
      listEchances,
    };
  } catch (err) {
    logger.error(`Error fetching Echances list: %O`, err.message);
    return {
      status: 400,
      message: `Failed to fetch Echances list: ${err.message}`,
    };
  }
};

const generatePretPDF = async (pretId) => {
  try {
    // Fetch the Pret, User, and associated Echances
    const pret: any = await Pret.findByPk(pretId, {
      include: [
        {
          model: User,
          as: 'User',
        },
        {
          model: Echance,
          as: 'Echances',
        },
      ],
    });

    if (!pret) {
      throw new Error('Pret not found');
    }

    const user = pret.User;
    const echances = pret.Echances;
    const paymentStatus = pret.moneyStatus ? 'Fully Paid' : 'Not Fully Paid';

    // Create a new PDF document with margins
    const doc = new PDFDocument({ margin: 50 });

    // Set the file to write to
    const filePath = `./public/Pret_${pret.pretRef}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));

    // Draw a black border around the entire document
    doc
      .rect(10, 10, doc.page.width - 20, doc.page.height - 20)
      .strokeColor('black')
      .lineWidth(1)
      .stroke();

    // Set some styles and fonts
    doc.fontSize(12).font('Helvetica');

    // Add company details at the top
    doc
      .fontSize(10)
      .text('Entreprise Tunisienne d\'Activités Pétrolières', { align: 'left' })
      .text('54, Avenue Mohamed V - 1002 Tunis, Tunisie', { align: 'left' })
      .text('(+216) 71 28 50 97', { align: 'left' })
      .moveDown(2);

    // Add title
    doc.fontSize(18).text('Pret Details', { align: 'center' }).moveDown(1.5);

    // Pret Details Box
    doc
      .fillColor('black')
      .fontSize(12)
      .text(`Pret Ref: ${pret.pretRef}`, 60, 160)
      .text(
        `Date Obtention: ${moment(pret.dateObtention).format('DD-MM-YYYY')}`,
        60,
        180,
      )
      .text(
        `Date Echeance: ${moment(pret.dateEcheance).format('DD-MM-YYYY')}`,
        60,
        200,
      )
      .text(`Montant Pret: ${pret.montantPret}`, 60, 220)
      .text(`Montant à Rembourser: ${pret.montantARemb}`, 60, 240)
      .text(`Sold Rest: ${pret.soldRest}`, 60, 260)
      .text(`Status: ${pret.status}`, 60, 280)
      .text(`Payment Status: ${paymentStatus}`, 60, 300);

    // User Details Box
    doc
      .text(`UserName: ${user.firstName} ${user.lastName}`, 360, 160)
      .text(`Email: ${user.email}`, 360, 180)
      .text(`Phone: ${user.phoneNumber}`, 360, 200)
      .text(`Role: ${user.role}`, 360, 220);

    // Add a table for Echances
    doc
      .moveDown(2)
      .text('Echances:', 50, 330, { underline: true })
      .moveDown(0.5);

    if (echances.length === 0) {
      // No Echances message
      doc
        .fontSize(12)
        .fillColor('grey')
        .text('No Echances available for this Pret.', 50, 350);
    } else {
      // Define table headers with background colors
      const tableTop = 350;
      doc.rect(50, tableTop, 500, 20).fill('#e0e0e0').stroke();
      doc
        .fillColor('black')
        .fontSize(12)
        .text('Echance Date', 70, tableTop + 5)
        .text('Montant Rembourse', 200, tableTop + 5)
        .text('Status', 330, tableTop + 5);

      echances.forEach((echance, index) => {
        const isPaid = moment().isAfter(echance.dateEchance);
        const statusText = isPaid ? 'Paid' : 'Not Paid';
        const statusColor = isPaid ? 'black' : 'grey';
        const rowTop = tableTop + 25 + index * 20;

        // Alternate row color (white and grey)
        doc
          .rect(50, rowTop, 500, 20)
          .fill(index % 2 === 0 ? 'white' : '#f2f2f2')
          .stroke();

        doc
          .fillColor('black')
          .text(moment(echance.dateEchance).format('DD-MM-YYYY'), 70, rowTop + 5)
          .text(echance.montantRembourse, 200, rowTop + 5)
          .fillColor(statusColor)
          .text(statusText, 330, rowTop + 5);
      });
    }

    // Add a signature section at the end
    doc
      .moveDown(2)
      .fontSize(10)
      .text('Thank you for your business!', { align: 'center' })
      .moveDown(1)
      .text('If you have any questions about this invoice, please contact us:', { align: 'center' })
      .text('Name, Phone, email@address.com', { align: 'center' })
      .moveDown(2)
      .text('Signature:', 50, doc.y)
      .moveDown(2);

    // Finalize the PDF and end the document
    doc.end();

    return { status: 200, message: 'Doc generated', filePath };
  } catch (error) {
    {
      return { status: 400, message: error.message };
    }
  }
};


export {
  create,
  read,
  update,
  deleteById,
  getListPret,
  getListPretByUserId,
  getListEchances,
  getListEchancesByUserId,
  generatePretPDF,
};
