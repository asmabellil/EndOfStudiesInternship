import { LoanStatus } from "./enums/loan-status.enum";

export class Loan {
    public id!: number;

    public pretRef!: string;
  
    public dateObtention!: Date;
  
    public dateEcheance!: Date;
  
    public montantPret!: number;
  
    public montantARemb!: number;
  
    public montant1ereRemb!: number;
  
    public montantRembParMois!: number;
  
    public echanceNumber!: number;
  
    public soldRest!: number;
  
    public status!: LoanStatus;
  
    public moneyStatus!: boolean;
  
    public userId!: number;
  
    public createdAt!: Date;
  
    public updatedAt!: Date;
}