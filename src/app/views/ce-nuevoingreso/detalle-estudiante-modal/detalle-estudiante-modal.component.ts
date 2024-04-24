import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-detalle-estudiante-modal',
  templateUrl: './detalle-estudiante-modal.component.html',
  styleUrls: ['./detalle-estudiante-modal.component.scss']
})
export class DetalleEstudianteModalComponent implements OnInit {

  estudianteBase: any; // Ajusta según el tipo de dato de tu estudiante
  inscrito: boolean = false;
  inscripcion: any []= [];

  

  constructor(public modalRef: BsModalRef,
    ) { }

  ngOnInit(): void {

  }

  obtenerClaseColor(estatus: string): string {
    switch (estatus) {
      case 'OKSICE': return 'text-success';
      case 'NOKSICE': return 'text-danger';
      default: return '';
    }
  }
  
  obtenerNombreIcono(estatus: string): string {
    switch (estatus) {
      case 'OKSICE': return 'cilCheckCircle';
      case 'NOKSICE': return 'cilBan';
      default: return 'cilBan';
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  
}
