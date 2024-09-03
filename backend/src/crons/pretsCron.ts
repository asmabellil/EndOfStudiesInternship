import { Echance, Pret } from 'db';
import cron from 'node-cron';

// This function will update the moneyStatus
async function updateMoneyStatus() {
  const prets: any = await Pret.findAll({
    where: {
      moneyStatus: false,
    },
    include: [{
      model: Echance,
      order: [['dateEcheance', 'DESC']], // Order by dateEcheance to get the last one
    }],
  });

  const today = new Date();

  for (const pret of prets) {
    if (pret.Echances.length > 0) {
      const lastEchance = pret.Echances[0]; // The first one after sorting is the last `Echance`
      const expectedDate = new Date(lastEchance.dateEchance);
      

      if (today > expectedDate) {
        await pret.update({ moneyStatus: true });
      }
    }
  }
}

// Schedule the cron job to run daily at midnight
cron.schedule('0 8 * * *', async () => {
  console.log('Running daily cron job to update moneyStatus');
  await updateMoneyStatus();
});
