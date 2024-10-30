import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service';

@Component({
  selector: 'app-estadisticas-convenio-programa',
  templateUrl: './estadisticas-convenio-programa.component.html',
  styleUrls: ['./estadisticas-convenio-programa.component.scss']
})
export class EstadisticasConvenioProgramaComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  estadisticas: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private controlestudiosService: ControlEstudiosService,
    private notifyService: NotificacionService,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticasConvenio();
  }

  cargarEstadisticasConvenio(): void {
    this.spinnerService.show();
    this.controlestudiosService.getEstadisticasConvenio().subscribe(
      (response: any) => {
        if (response) {
          this.estadisticas = response;
        } else {
          this.notifyService.showWarning('No se encontraron registros.');
        }
        this.spinnerService.hide();
      },
      (error) => {
        this.notifyService.showError('Error al cargar las estadísticas.');
        console.error('Error:', error);
        this.spinnerService.hide();
      }
    );
  }

  getTotal(field: string): number {
    return this.estadisticas.reduce((total, programa) => total + (programa[field] || 0), 0);
  }

  decline(): void {
    this.onClose.emit(false);
    this.bsModalRef.hide();
  }
}
