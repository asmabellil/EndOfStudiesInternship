export interface IPret {
  id: number;
  pretRef: string;
  dateObtention: Date;
  dateEcheance: Date;
  montantPret: number;
  montantARemb: number;
  montant1ereRemb: number;
  montantRembParMois: number;
  soldRest: number;
  status: string;
  moneyStatus: boolean;
  echanceNumber: number;
  userId: number;
}
