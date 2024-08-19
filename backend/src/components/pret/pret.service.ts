/* eslint-disable import/no-import-module-exports */
import logger from '@core/utils/logger';
import PretModel from '@components/pret/pret.model';
import { IPret } from '@components/pret/pret.interface';
import { Op } from 'sequelize';
import { Echance, Pret, User } from 'db';
import PDFDocument from 'pdfkit';
import path, { dirname } from 'path';
import fs from 'fs';

const create = async (pret: IPret, options: any = {}): Promise<any> => {
  try {
    const interest = parseFloat(process.env.INTEREST);
    const montantARemb = pret.montantPret + ((pret.montantPret * interest) / 100);
    const montantRembParMois = ((montantARemb - pret.montant1ereRemb) / pret.echanceNumber);
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
    const montantARemb = pret.montantPret + ((pret.montantPret * interest) / 100);
    const montantRembParMois = ((montantARemb - pret.montant1ereRemb) / pret.echanceNumber);
    const soldRest = montantARemb - pret.montant1ereRemb;

    const fieldsToUpdate = { ...pret, montantARemb, montantRembParMois, soldRest };
    console.log(fieldsToUpdate);
    
    delete fieldsToUpdate.id; // Exclude the ID field from being updated
    const affectedRows = await PretModel.update(fieldsToUpdate, {
      where: { id: pret.id },
    });
    if (affectedRows[0] > 0) {
      if (pret.status === "Accepted"){
        try {
          const echanceNumber = pret.echanceNumber;
          let dateEcheance = new Date(pret.dateEcheance);
          const pretId = pret.id;
          const echance = [];
          for (let i = 0; i < echanceNumber; i++) {
            const newDateEcheance = new Date(dateEcheance);
            newDateEcheance.setMonth(newDateEcheance.getMonth() + i);
            echance.push({
              dateEchance: newDateEcheance,
              montantRembourse: montantRembParMois,
              pretId: pretId,
            });
          }
          await Echance.bulkCreate(echance);
          return { status: 200, message: 'Pret updated', pret };
        } catch (error) {
          return { status: 400, message: `Error creating echances: ${error.message}` };
        }
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
    const listEchances = await Echance.findAndCountAll({
    });

    return { status: 200, message: 'Echances fetched successfully', listEchances };
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

    return { status: 200, message: 'Echances fetched successfully', listEchances };
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
    const pret: any = await Pret.findByPk(pretId, {
      include: [
        { model: Echance },
        { model: User },
      ],
    });

    if (!pret) {
      throw new Error('Pret not found');
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4', font: 'Helvetica' });
    const filename = path.join(__dirname, '../../../public', `Pret_${pret.pretRef}.pdf`);

    doc.pipe(fs.createWriteStream(filename));

    // Colors
    const primaryColor = '#0000FF'; // Blue
    const secondaryColor = '#FFFFFF'; // White
    const textColor = '#000000'; // Black
    const tableHeaderColor = '#1E90FF'; // Lighter blue for table header

    // Header
    doc
      .fontSize(18)
      .fillColor(primaryColor)
      .text('Pret Details', { align: 'center' })
      .moveDown(1);

    // Pret Details Box
    const boxWidth = 250;
    const boxHeight = 180;

    doc
      .rect(doc.page.margins.left, doc.y, boxWidth, boxHeight)
      .stroke(primaryColor);

    const details = [
      { label: 'Pret Reference', value: pret.pretRef },
      { label: 'Date Obtention', value: pret.dateObtention ? pret.dateObtention.toDateString() : 'N/A' },
      { label: 'Date Echeance', value: pret.dateEcheance ? pret.dateEcheance.toDateString() : 'N/A' },
      { label: 'Montant Pret', value: pret.montantPret.toFixed(2) },
      { label: 'Montant à Remb', value: pret.montantARemb.toFixed(2) },
      { label: 'Montant 1ere Remb', value: pret.montant1ereRemb.toFixed(2) },
      { label: 'Montant Remb Par Mois', value: pret.montantRembParMois.toFixed(2) },
      { label: 'Sold Rest', value: pret.soldRest.toFixed(2) },
      { label: 'Status', value: pret.status || 'N/A' },
      { label: 'Money Status', value: pret.moneyStatus ? 'Paid' : 'Unpaid' },
    ];

    let currentY = doc.y + 10;
    details.forEach((detail) => {
      doc
        .fontSize(10)
        .fillColor(textColor)
        .text(detail.label, doc.page.margins.left + 10, currentY, { width: boxWidth / 2 - 10 })
        .text(detail.value, doc.page.margins.left + boxWidth / 2, currentY, { width: boxWidth / 2 - 10, align: 'right' });
      currentY += 16;
    });

    // User Details Box
    doc
      .rect(doc.page.width - doc.page.margins.right - boxWidth, doc.y, boxWidth, boxHeight)
      .stroke(primaryColor);

    doc
      .fontSize(12)
      .fillColor(primaryColor)
      .text('User Details:', doc.page.width - doc.page.margins.right - boxWidth + 10, doc.y + 10)
      .fontSize(10)
      .fillColor(textColor)
      .text(`Name: ${pret.User.firstName || 'N/A'} ${pret.User.lastName || 'N/A'}`, doc.page.width - doc.page.margins.right - boxWidth + 10, doc.y + 30)
      .text(`Email: ${pret.User.email || 'N/A'}`, doc.page.width - doc.page.margins.right - boxWidth + 10, doc.y + 50)
      .text(`Phone Number: ${pret.User.phoneNumber || 'N/A'}`, doc.page.width - doc.page.margins.right - boxWidth + 10, doc.y + 70);

    doc.moveDown(2);

    // Echances Table
    doc
      .fontSize(14)
      .fillColor(primaryColor)
      .text('Echances:', { underline: true })
      .moveDown(0.5);

    const tableTop = doc.y;
    const colWidths = [80, 200, 200];

    // Table Header
    doc
      .fillColor(tableHeaderColor)
      .rect(doc.page.margins.left, tableTop, colWidths.reduce((a, b) => a + b, 0), 20)
      .fill();

    doc
      .fillColor(secondaryColor)
      .fontSize(12)
      .text('Echance', doc.page.margins.left + 5, tableTop + 5)
      .text('Date Echeance', doc.page.margins.left + colWidths[0] + 5, tableTop + 5)
      .text('Montant Remboursé', doc.page.margins.left + colWidths[0] + colWidths[1] + 5, tableTop + 5);

    // Table Rows
    let rowY = tableTop + 20;
    pret.Echances.forEach((echance, index) => {
      const rowColor = index % 2 === 0 ? '#F0F0F0' : secondaryColor;

      doc
        .fillColor(rowColor)
        .rect(doc.page.margins.left, rowY, colWidths.reduce((a, b) => a + b, 0), 20)
        .fill();

      doc
        .fillColor(textColor)
        .fontSize(10)
        .text(`Echance ${index + 1}`, doc.page.margins.left + 5, rowY + 5)
        .text(echance.dateEchance instanceof Date ? echance.dateEchance.toDateString() : 'Invalid Date', doc.page.margins.left + colWidths[0] + 5, rowY + 5)
        .text(`${echance.montantRembourse.toFixed(2)}`, doc.page.margins.left + colWidths[0] + colWidths[1] + 5, rowY + 5);

      rowY += 20;
    });

    // Finalize the PDF and end the stream
    doc.end();

    return { status: 200, filename };
  } catch (error) {
    console.error(error);
    return { status: 400, message: error.message };
  }
};

export { create, read, update, deleteById, getListPret, getListPretByUserId, getListEchances, getListEchancesByUserId, generatePretPDF };
