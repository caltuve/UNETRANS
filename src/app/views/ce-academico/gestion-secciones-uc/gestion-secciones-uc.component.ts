import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

import { ShowActaComponent } from '../show-acta/show-acta.component';
import { EditActaCeComponent } from '../edit-acta-ce/edit-acta-ce.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-gestion-secciones-uc',
  templateUrl: './gestion-secciones-uc.component.html',
  styleUrls: ['./gestion-secciones-uc.component.scss']
})
export class GestionSeccionesUcComponent implements OnInit {
  
  codigoUC: string;
  periodo: string;

  hayResultadosSecciones: boolean = false;
  sinResultadosSecciones: boolean = false;

  modalRef: BsModalRef; 

  secciones = []; 
  detalle_acta : any []= [];
  inscritos : any []= [];

  constructor(private route: ActivatedRoute,
    private modalService: BsModalService,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    public bsModalRef: BsModalRef,
    private location: Location) { }

  ngOnInit(): void {
    this.codigoUC = this.route.snapshot.paramMap.get('codigoUC') ?? 'valorPredeterminado';
    this.periodo = this.route.snapshot.paramMap.get('periodo') ?? 'valorPredeterminado';

    this.cargarSecciones(this.codigoUC,this.periodo);
  
    // Cargar datos usando los parámetros
  }

  regresar(): void {
    this.location.back();
  }


  // Método para cargar los planes de estudios (ajustar según tu servicio)
  cargarSecciones(codigoUC: string, periodo: string) {
    this.SpinnerService.show();
    this.controlestudiosService.obtenerSeccionesPeriodo(codigoUC,periodo).subscribe(
      data => {
        this.hayResultadosSecciones = false;
        this.sinResultadosSecciones = false;
        this.secciones = data;
        if (this.secciones.length == 0) {
          this.sinResultadosSecciones = this.secciones.length == 0;
          this.hayResultadosSecciones = false;
          this.SpinnerService.hide();
         } else{
          this.secciones = data;
          this.hayResultadosSecciones = this.secciones.length > 0;
          this.SpinnerService.hide();
         }
        this.SpinnerService.hide();
        // Ahora los datos del programa están disponibles para ser utilizados en tu plantilla
      },
      error => {
        this.SpinnerService.hide();
        // Manejo de errores, por ejemplo, mostrar un mensaje de error
      }
    );
  }

  openActaDetail(actaId: any) {
    this.controlestudiosService.getDetailActa(actaId).subscribe(
      (result: any) => {
        //console.log('Detalle del acta:', result); 
        const initialState = {
          detalle_acta: result,
          inscritos: result[0].inscritos
        };
        this.modalRef = this.modalService.show(ShowActaComponent, { 
          initialState: initialState,
          class: 'modal-xl custom-modal-scrollable', // Tamaño extra grande y desplazable
          ignoreBackdropClick: true, // Evita cerrar el modal al hacer clic fuera
          keyboard: false             // Evita cerrar el modal con la tecla ESC
        });
      }
    );
  }

  editActaDetail(actaId: any) {
    this.controlestudiosService.getDetailActaEdit(actaId).subscribe(
      (result: any) => {
        const initialState = {
          detalle_acta: result,
          inscritos: result[0].inscritos
        };
        this.modalRef = this.modalService.show(EditActaCeComponent, { 
          initialState: initialState,
          class: 'modal-xl custom-modal-scrollable', // Tamaño extra grande y desplazable
          ignoreBackdropClick: true, // Evita cerrar el modal al hacer clic fuera
          keyboard: false             // Evita cerrar el modal con la tecla ESC
        });
      }
    );
  }

  exportarAExcel(): void {
    if (this.detalle_acta && this.detalle_acta.length > 0) {
      const primerDetalle = this.detalle_acta[0];
      const numeroActa = primerDetalle[0].acta || 'Acta';
      const numeroSeccion = primerDetalle[0].seccion || 'Seccion';
  
      const encabezado = [
        { A: 'Acta', B: primerDetalle[0].acta || '' },
        { A: 'Periodo Académico', B: primerDetalle[0].periodo || '' },
        { A: 'PNF', B: primerDetalle[0].nombre_programa || '' },
        { A: 'Unidad Curricular', B: (primerDetalle[0].cod_ucurr || '') + ' - ' + (primerDetalle[0].uni_curr || '') },
        { A: 'Sección', B: (primerDetalle[0].seccion || '') + ' - ' + (primerDetalle[0].tipo_sec || '') },
        { A: 'Docente', B: primerDetalle[0].prof_asignado || '' },
        // Una fila vacía como separador
        {},
      ];
  
      // Crear hoja de cálculo para el encabezado
      const wsEncabezado: XLSX.WorkSheet = XLSX.utils.json_to_sheet(encabezado, { skipHeader: true });
  
      // Agregar los datos de los inscritos a la hoja de cálculo
      XLSX.utils.sheet_add_json(wsEncabezado, this.inscritos, { skipHeader: true, origin: -1 });
  
      // Crear el libro y añadir la hoja
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsEncabezado, 'Estudiantes');
  
      const nombreArchivo = `Detalle_${numeroActa}_Seccion_${numeroSeccion}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    }
  }


}