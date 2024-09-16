import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-view-document',
  templateUrl: './modal-view-document.component.html',
  styleUrls: ['./modal-view-document.component.scss']
})
export class ModalViewDocumentComponent implements OnInit {
  detallePlan: any;
  trayectosData: any[];
  unidadesDataModal: any[];
  unidadesData: any[];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.detallePlan = this.detallePlan[0];
    this.trayectosData = this.trayectosData;
    this.unidadesDataModal = this.unidadesData;

    this.trayectosData.forEach(trayecto => {
      const unidadesTrayecto = this.unidadesDataModal.find(ud => ud.trayecto === trayecto.nombre_trayecto);
      if (unidadesTrayecto && unidadesTrayecto.unidades.some((u: { mensaje: any; }) => !u.mensaje)) {
        trayecto.unidades = unidadesTrayecto.unidades;
        trayecto.tieneUnidades = true;
      } else {
        trayecto.unidades = [{ mensaje: 'No hay unidades curriculares asociadas a este trayecto, verifique en la opción del Menú: Académico - Programas Académicos' }];
        trayecto.tieneUnidades = false;
      }
    });

    console.log(this.trayectosData);
  }

  


  onClose(): void {
    this.bsModalRef.hide();
  }
}
