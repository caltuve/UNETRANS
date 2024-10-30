import { Component } from '@angular/core';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { Observable, map } from 'rxjs';
import { style } from '@angular/animations';

import { Router } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { VerSolicitudModalComponent } from '../ver-solicitud-modal/ver-solicitud-modal.component';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent {

  displayedColumns: string[] = ['fecha_solicitud', 'estatus_solicitud', 'identificador_solicitud', 'total_doc', 'monto', 'acciones'];
  dataSource: MatTableDataSource<any>;

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

  tasaConversion: number = 44.42319324;

  hayResultados: boolean = false;
  sinResultados: boolean = false;
  cargandoDatos = true; // Añade esto a tu componente

  solicitud: any; // Aquí recibes la solicitud para mostrar sus detalles

  constructor(
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private router: Router,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    ) {

      this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
    }

    datosEstudiante: any;
    datosInscripcion: any;
  ngOnInit(): void {
    this.buscarSolicitudesDocumentos(this.usr.usrsice);
  this.findInscripcion(this.usr.usrsice);
    // Suponiendo que tienes una lógica para determinar si el estudiante está inscrito
    this.estaInscrito = true;

    if (this.estaInscrito) {
      this.documentos = [
        { nombre: 'Constancia de Estudios', disponible: false },
        { nombre: 'Constancia de Inscripción', disponible: true }
      ];
    }
  }

  // descargarDocumento(documento: string): void {
  //   this.controlestudiosService.getDatosConstancia(this.usr.usrsice).subscribe(response => {
  //     if (response && response.estudiante && response.inscripcion) {
  //       // Extrayendo los datos del estudiante y los datos de inscripción
  //       this.datosEstudiante = response.estudiante[0];
  //       this.datosInscripcion = response.inscripcion;
  
  //       // Llama a la función que genera el PDF pasando los datos necesarios
  //       //this.generarPDF(this.datosEstudiante, this.datosInscripcion, documento);
  //     } else {
  //       // Manejar la situación de que no hay datos disponibles
  //       console.error('No se recibieron los datos necesarios.');
  //     }
  //   }, error => {
  //     // Manejar error en la obtención de datos
  //     console.error('Error al obtener los datos:', error);
  //   });
  // }

  irANuevaSolicitud() {
    this.router.navigate(['/est-solicitud/documentos/nueva-solicitud']); // Ajusta la ruta según tu configuración de rutas
  }


  
  obtenerDatosEstudiante(usrsice: any): Observable<any> {
    return this.controlestudiosService.getDatosConstancia(usrsice).pipe(
      map((response: { data: string | any[]; }) => {
        console.log('Datos recibidos:', response); // Agrega esta línea para depuración
        // ...resto de tu lógica...
      })
    );
  }
  

  findInscripcion(usrsice: any) {
    this.cargandoDatos = true;
    this.SpinnerService.show();
    
    this.controlestudiosService.getInscripcionEstudiante(usrsice).subscribe(data => {
      this.hayResultados = data.length > 0;
      this.sinResultados = data.length === 0;
      //this.dataSource.data = data;
  
      if (this.hayResultados) {
        // Importante: actualizar el paginador después de asignar los datos
        //setTimeout(() => this.dataSource.paginator = this.paginatorProcesos);
      } else {
        //this.dataSource.data = [];
      }
  
      this.cargandoDatos = false;
      this.SpinnerService.hide();
    });
  }

  buscarSolicitudesDocumentos(usrsice: any): void {
    this.cargandoDatos = true;
    this.SpinnerService.show();
  
    this.controlestudiosService.getSolicitudesDocumentos(usrsice).subscribe(data => {
      
      this.dataSource = new MatTableDataSource(data.datos);
    
      this.cargandoDatos = false;
      this.SpinnerService.hide();
      this.hayResultados = data.length > 0;
      this.sinResultados = data.length === 0;
    }, error => {
      console.error('Error al obtener las solicitudes:', error);
      this.cargandoDatos = false;
      this.SpinnerService.hide();
    });
  }

  // Función para ver la solicitud
  verSolicitud(solicitud: any) {
    const initialState = {
      solicitud: solicitud // Pasar la solicitud como parte del estado inicial
    };
  
    const modalRef: BsModalRef = this.modalService.show(VerSolicitudModalComponent, {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-dialog-centered modal-lg', // Ajusta el tamaño del modal si es necesario
      initialState: initialState // Pasar el estado inicial al modal
    });
  
    modalRef.content.onClose?.subscribe((result: any) => {
      console.log('Modal cerrado:', result);
    });
  }
  

  editarSolicitud(solicitud: any) {
    console.log('Editar documentos de la solicitud', solicitud);
    // Aquí puedes abrir un modal o redirigir a una página de detalles
  }

  // Función para reportar pago
  reportarPago(solicitud: any) {
    console.log('Reportando pago para la solicitud', solicitud);
  }

  // Función para anular solicitud
  anularSolicitud(solicitud: any) {
    console.log('Anulando la solicitud', solicitud);
  }

  // Función para descargar documento
  descargarDocumento(solicitud: any) {
    console.log('Descargando documento de la solicitud', solicitud);
  }

  // Función para pagar solicitud
  pagarSolicitud(solicitud: any) {
    console.log('Pagando la solicitud', solicitud);
  }

}
