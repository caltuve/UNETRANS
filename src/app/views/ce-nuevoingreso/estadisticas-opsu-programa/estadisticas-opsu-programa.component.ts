import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-estadisticas-opsu-programa',
  templateUrl: './estadisticas-opsu-programa.component.html',
  styleUrls: ['./estadisticas-opsu-programa.component.scss']
})
export class EstadisticasOpsuProgramaComponent {
  estadisticas: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private controlestudiosService: ControlEstudiosService,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.obtenerEstadisticas();
  }

  obtenerEstadisticas(): void {
    this.spinnerService.show();  // Mostrar spinner mientras se carga la data

    this.controlestudiosService.getEstadisticasOPSU().subscribe(
      (response: any) => {
        if (response.estatus === 'OK') {
          this.estadisticas = response.datos;
        } else {
          console.error('Error al obtener estadísticas:', response.mensaje);
        }
        this.spinnerService.hide();
      },
      (error) => {
        console.error('Error de servidor al obtener estadísticas:', error);
        this.spinnerService.hide();
      }
    );
  }

  // Método para calcular el total de estudiantes
  calcularTotalEstudiantes(): number {
    return this.estadisticas.reduce((total, estadistica) => total + estadistica.cant, 0);
  }

  decline(): void {
    this.bsModalRef.hide();
  }
}