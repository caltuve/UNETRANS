import { Component, EventEmitter, Output  } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  @Output() onClose = new EventEmitter<boolean>();

  constructor(public bsModalRef: BsModalRef) {}

  decline(): void {
    this.onClose.emit(false);
    this.bsModalRef.hide();
  }

  accept(): void {
    this.onClose.emit(true);
    this.bsModalRef.hide();
  }
}
