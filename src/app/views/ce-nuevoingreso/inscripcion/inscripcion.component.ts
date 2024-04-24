import { Component, ViewChild } from '@angular/core';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalInscripcionComponent } from '../modal-inscripcion/modal-inscripcion.component';

export interface Estudiante {
  carnet: string;
  desc_estatus: string,
  nac: string,
  nombre_completo: string;
  ced_pas: number,
  pnf: string,
  codigo_pnf: string,
  ult_per_inscrito: string,
  cohorte: string
  trayecto: string,
  foto: string,
  cedula_formateada: string,
  carnet_formateado: string,
  estatus: string,
  email: string,
  tlf_cel: string
  // ... otros campos relevantes
}

export interface DocumentosEstudiante {
  nombreDocumento: string;
  entregado: string,
  estadoAprobacion: string,
  // ... otros campos relevantes
}

interface RespuestaServicio {
  success: boolean;
  message?: string; // Opcional, dependiendo de lo que tu API retorne
  // Puedes añadir más campos según la respuesta de tu API
}

@Pipe({ name: 'estatusExpedientePipe' })
export class EstatusExpedientePipe implements PipeTransform {
  transform(value: string): string {
    console.log('Valor recibido en el pipe:', value);
    switch (value) {
      case 'OKSICE':
        return 'REGISTRADO EN SICE';
      case 'NOKSICE':
        return 'NO REGISTRADO EN SICE';
      default:
        return 'DESCONOCIDO';
    }
  }
}

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent {

  estaInscrito: boolean;
  documentos: any[] = [];
  usr={
    nac:null,
    cedula:null,
    nombre_completo:null,
    nombre_corto:null,
    fecnac:null,
    carnet:null,
    pnf:null,
    email: null,
    saludo: null,
    usrsice: null,
  }

  modalRef: BsModalRef; 

  hayResultadosDocumentos: boolean = false;
  sinResultadosDocumentos: boolean = false;

  hayResultados: boolean = false;
  sinResultados: boolean = false;
  cargandoDatos = true; // Añade esto a tu componente

  dataSource = new MatTableDataSource<Estudiante>();

  dataSourceUC = new MatTableDataSource();

  datosEstudiante: any;
  datosInscripcion: any;
  cedulaActual: string;
  carnet!: string;
  cedula!: string;
  nombre!: string;

  @ViewChild('formSearchPersona') formSearchPersona!: NgForm;
  constructor(public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService: NotificacionService,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {  
    this.controlestudiosService.inscripcionCompletada$.subscribe(carnet => {
      this.findInscripcion(carnet); // Refrescar los datos del estudiante
    });
  }
  
  
  
  searchPersona(formSearchPersona: NgForm) {
    this.SpinnerService.show();
    this.controlestudiosService.findPersonaInscripcion(formSearchPersona.value).subscribe(
      (result: any) => {
        this.hayResultados = false;
        this.sinResultados = false;

        // Asumiendo que la respuesta tiene dos propiedades: 'estudiante' y 'documentos'
        if (result && result.estudiante) {
          this.dataSource.data = [result.estudiante]; // Almacena los datos del estudiante
          this.cedulaActual = result.estudiante.carnet;
          this.findInscripcion(this.cedulaActual);
          //this.dataSourceDocumentos.data = result.documentos; // Almacena los documentos en el dataSource de la tabla

          this.notifyService.showSuccess('Consulta de datos de estudiante');
          this.hayResultados = true; // Indica que hay resultados
          // Actualizar el FormArray
        //this.actualizarFormArrayConDocumentos(result.documentos);
        } else {
          // No se encontraron datos
          this.sinResultados = true;
          this.hayResultados = false;
        }

        this.SpinnerService.hide();
        this.formSearchPersona.reset();
      },
      error => {
        // Manejo de error
        console.error('Error al buscar datos: ', error);
        this.SpinnerService.hide();
        this.sinResultados = true;
        this.hayResultados = false;
        this.formSearchPersona.reset();
      }
    );
  }

  findInscripcion(carnet: any) {
    this.cargandoDatos = true;
    this.SpinnerService.show();
    
    this.controlestudiosService.getInscripcionUCEstudiante(carnet).subscribe(data => {
      this.hayResultadosDocumentos = data.length > 0;
      this.sinResultadosDocumentos = data.length === 0;
      this.dataSourceUC.data = data;
  
      if (this.hayResultadosDocumentos) {
        // Importante: actualizar el paginador después de asignar los datos
        //setTimeout(() => this.dataSource.paginator = this.paginatorProcesos);
      } else {
        //this.dataSource.data = [];
      }
  
      this.cargandoDatos = false;
      this.SpinnerService.hide();
    });
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
      default: return 'cilFrown';
    }
  }


  abrirModalInscripcion(carnet: string, pnf: string, trayecto: string) {
    // Utiliza los parámetros en la llamada al servicio
    this.controlestudiosService.getUCInscripcion(carnet, pnf, trayecto).subscribe(
      (result: any) => {
        const initialState = {
          trayectos: result.trayectos, // Directamente, ya que result es un objeto
          planSeleccionado: result.infoAdicional.planSeleccionado,
          carnet: this.cedulaActual
        };
        this.modalRef = this.modalService.show(ModalInscripcionComponent, { 
          initialState: initialState,
          class: 'modal-xl custom-modal-scrollable',
          ignoreBackdropClick: true,
          keyboard: false
        });
      },
      error => {
        // Manejo de error
        console.error('Error al obtener datos de inscripción:', error);
      }
    );
  }


}
