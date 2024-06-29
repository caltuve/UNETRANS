import { Component, EventEmitter, Output  } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog-upload-grades',
  templateUrl: './confirm-dialog-upload-grades.component.html',
  styleUrls: ['./confirm-dialog-upload-grades.component.scss']
})
export class ConfirmDialogUploadGradesComponent {

  @Output() onClose = new EventEmitter<boolean>();

  isConfirmed = false;
  confirmationText = '';
  canConfirm = false;

  constructor(public bsModalRef: BsModalRef) {}

  checkConfirmation() {
    this.canConfirm = this.isConfirmed && this.confirmationText.toUpperCase() === 'CONFORME';
  }

  confirm() {
    this.onClose.emit(true);
    this.bsModalRef.hide();
  }

  cancel() {
    this.onClose.emit(false);
    this.bsModalRef.hide();
  }
}
