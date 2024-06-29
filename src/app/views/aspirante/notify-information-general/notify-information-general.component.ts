import { Component, EventEmitter, Output  } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-notify-information-general',
  templateUrl: './notify-information-general.component.html',
  styleUrls: ['./notify-information-general.component.scss']
})
export class NotifyInformationGeneralComponent {

  @Output() onClose = new EventEmitter<boolean>();

  constructor(public bsModalRef: BsModalRef) {}

  closeModal(): void {
   // this.onClose.emit(false);
    this.bsModalRef.hide();
  }

}
