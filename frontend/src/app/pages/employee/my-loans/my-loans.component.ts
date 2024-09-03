import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { filter, map, Observable } from 'rxjs';
import { Loan } from 'src/app/models/loan.model';
import { AppState } from 'src/app/store/app.state';
import { createLoan, deleteLoan, generateAndDownloadPDF, getLoansByUserId, updateLoan } from 'src/app/store/loan/loan.actions';
import { selectLoansList } from 'src/app/store/loan/loan.selectors';
import { isSameDay } from 'src/app/utils/utils';

@Component({
  selector: 'app-my-loans',
  templateUrl: './my-loans.component.html',
  styleUrls: ['./my-loans.component.scss']
})
export class MyLoansComponent implements OnInit {

  modalRef: NgbModalRef;
  closeResult: string;
  loanIdToDelete: number;
  loanToUpdate: Loan;
  searchDate: NgbDate;

  addingLoanForm: FormGroup;
  editingLoanForm: FormGroup;

  loansList$: Observable<Loan[]>;
  constructor(private store: Store<AppState>, private modalService: NgbModal, private messageService: MessageService) { }

  ngOnInit(): void {
    this.store.dispatch(getLoansByUserId());

    this.setPointingsLists(null);

    this.initializeAddingLoanForm();
  }

  generateLoanReference() {
    return 'L-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0').toString();
  }

  initializeAddingLoanForm(){
    this.addingLoanForm = new FormGroup({
      pretRef: new FormControl(this.generateLoanReference(), Validators.required),
      dateObtention: new FormControl('', Validators.required),
      dateEcheance: new FormControl('', Validators.required),
      montantPret: new FormControl(null, Validators.required),
      montant1ereRemb: new FormControl(null, Validators.required),
      echanceNumber: new FormControl(null, Validators.required),
    })
  }

  initializeEditingLonForm(loan: Loan){
    this.loanToUpdate = loan;

    const dateObtention = new Date(loan.dateObtention);
    const dateEcheance = new Date(loan.dateEcheance);

    this.editingLoanForm = new FormGroup({
      pretRef: new FormControl(loan.pretRef, Validators.required),
      dateObtention: new FormControl(new NgbDate(dateObtention.getFullYear(), dateObtention.getMonth() + 1, dateObtention.getDate()), Validators.required),
      dateEcheance: new FormControl(new NgbDate(dateEcheance.getFullYear(), dateEcheance.getMonth() + 1, dateEcheance.getDate()), Validators.required),
      montantPret: new FormControl(loan.montantPret, Validators.required),
      montant1ereRemb: new FormControl(loan.montant1ereRemb, Validators.required),
      echanceNumber: new FormControl(loan.echanceNumber, Validators.required),
    })
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { windowClass: 'modal-mini', size: 'lg', centered: true, backdropClass: 'custom-modal-backdrop' });
    
    this.modalRef.result.then((result) => {
        this.closeResult = 'Closed with: $result';
    }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
        this.initializeAddingLoanForm();
    });
  }

  specialOpen(content, loan: Loan) {
    this.initializeEditingLonForm(loan);
    this.open(content);
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close(); 
    }
  }

  deleteLoan(loanId){
    this.loanIdToDelete = loanId;
    this.messageService.clear();
    this.messageService.add({key: 'delete', sticky: true, severity:'custom', summary:'Do you confirm the delete of the loan request?', detail:'Confirm to proceed'});
  }

  onConfirm() {
    this.store.dispatch(deleteLoan({ loanId: this.loanIdToDelete }));
    this.messageService.clear();
  }

  onReject() {
      this.messageService.clear('delete');
  }

  generateAndDownloadPDF(loanId: number){
    this.store.dispatch(generateAndDownloadPDF({ loanId }));
  }

  add(){
    const { dateObtention, dateEcheance , ...restLoan} = this.addingLoanForm.value;
    this.store.dispatch(createLoan({ loan: {
      ...restLoan,
      dateObtention: new Date(dateObtention.year, dateObtention.month - 1, dateObtention.day),
      dateEcheance: new Date(dateEcheance.year, dateEcheance.month - 1, dateEcheance.day)
    } }));
  }

  edit(){
    const { dateObtention: formDateObtention, dateEcheance: formDateEcheance, montantPret, montant1ereRemb, echanceNumber } = this.editingLoanForm.getRawValue();

    this.store.dispatch(updateLoan({ loan: {
      ...this.loanToUpdate,
      montantPret,
      montant1ereRemb,
      echanceNumber,
      dateObtention: new Date(formDateObtention.year, formDateObtention.month - 1, formDateObtention.day),
      dateEcheance: new Date(formDateEcheance.year, formDateEcheance.month - 1, formDateEcheance.day)
    }}));
  }

  setPointingsLists(searchDate: NgbDate){
    const filterDate = !!searchDate ? new Date(searchDate.year, searchDate.month - 1, searchDate.day) : null;

    this.loansList$ = this.store.select(selectLoansList).pipe(
      map(loansList => {
        if(!!filterDate){
          return loansList.filter(loan => isSameDay(loan.dateObtention, filterDate) ||isSameDay(loan.dateEcheance, filterDate))
        }

        return loansList
      })
    );
  }
}
