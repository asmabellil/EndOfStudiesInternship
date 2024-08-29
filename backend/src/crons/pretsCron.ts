import { Pret } from 'db';
import cron from 'node-cron';
import { Op } from 'sequelize';

// This function will update the moneyStatus
async function updateMoneyStatus() {
  const prets = await Pret.findAll({
    where: {
      moneyStatus: false,
    },
  });

  const today = new Date();

  for (const pret of prets) {
    const expectedDate = new Date(pret.dateEcheance);
    expectedDate.setMonth(expectedDate.getMonth() + pret.echanceNumber);

    if (today > expectedDate) {
      await pret.update({ moneyStatus: true });
    }
  }
}

// Schedule the cron job to run daily at midnight
cron.schedule('28 18 * * *', async () => {
  console.log('Running daily cron job to update moneyStatus');
  await updateMoneyStatus();
});
