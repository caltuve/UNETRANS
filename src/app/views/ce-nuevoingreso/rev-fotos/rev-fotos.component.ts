import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

import { VerFotoModalComponent } from '../ver-foto-modal/ver-foto-modal.component';

@Component({
  selector: 'app-rev-fotos',
  templateUrl: './rev-fotos.component.html',
  styleUrls: ['./rev-fotos.component.scss']
})
export class RevFotosComponent implements OnInit {

  displayedColumnsPendientes: string[] = ['fecha_solicitud', 'id_estudiante', 'nombre_completo', 'accion'];
  displayedColumnsRevisadas: string[] = ['estatus','id_estudiante', 'nombre_completo', 'usr_procesa','accion' ];

  pendientes = new MatTableDataSource([]);
  revisadas = new MatTableDataSource([]);
  usrsice: string;
  cargandoDatos = false;
  datosRevisadasCargados = false;

  hayResultadosPendientes: boolean = false;
  sinResultadosPendientes: boolean = false;

  hayResultadosRevisadas: boolean = false;
  sinResultadosRevisadas: boolean = false;

  activeTabIndex: number = 0;

  modalRef: BsModalRef;

  @ViewChild('paginatorPendientes', { static: false }) paginatorPendientes: MatPaginator;
  @ViewChild('paginatorRevisadas', { static: false }) paginatorRevisadas: MatPaginator;


  constructor(
    private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService: NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private modalService: BsModalService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.obtenerUsuarioActual();
  }


  ngOnInit() {
    // Mostrar el spinner inmediatamente al cargar el componente
    this.cargarDatosPendientes();
  }


   
  obtenerUsuarioActual() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.usrsice = currentUser.usrsice;
  }

  cargarDatosPendientes(): void {
    this.cargandoDatos = true;
    this.SpinnerService.show();
  
    this.controlestudiosService.getRevFotosPendientes().subscribe(
      (response: any) => {
        if (response.estatus === 'OK' && response.datos) {
          this.pendientes.data = response.datos;
          this.hayResultadosPendientes = true;
          this.sinResultadosPendientes = false;
  
          // Inicializa el paginador después de que los datos estén listos y el DOM actualizado
          setTimeout(() => {
            if (this.paginatorPendientes) {
              this.pendientes.paginator = this.paginatorPendientes;
  
              // Configuración del paginador
              this.paginatorPendientes._intl.itemsPerPageLabel = 'Registros por página';
              this.paginatorPendientes._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
                if (length === 0 || pageSize === 0) {
                  return `Mostrando 0 de ${length}`;
                }
                const startIndex = page * pageSize;
                const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : length;
                return `Mostrando ${startIndex + 1} – ${endIndex} de ${length} registro(s)`;
              };
            } else {
              console.error('El paginador sigue sin inicializarse. Verifica que el mat-paginator esté presente en la vista.');
            }
          }, 0);
        } else {
          this.pendientes.data = [];
          this.hayResultadosPendientes = false;
          this.sinResultadosPendientes = true;
        }
        this.cargandoDatos = false;
        this.SpinnerService.hide();
      },
      (error) => {
        console.error('Error al cargar datos pendientes:', error);
        this.hayResultadosPendientes = false;
        this.sinResultadosPendientes = true;
        this.cargandoDatos = false;
        this.SpinnerService.hide();
      }
    );
  }
  
  
  
  cargarDatosRevisadas(): void {
    this.cargandoDatos = true;
    this.SpinnerService.show();
  
    this.controlestudiosService.getRevFotosRevisadas().subscribe(
      (response: any) => {
        if (response.estatus === 'OK' && response.datos) {
          this.revisadas.data = response.datos;
          this.hayResultadosRevisadas = true;
          this.sinResultadosRevisadas = false;
  
          // Inicializa el paginador después de que los datos estén listos y el DOM actualizado
          setTimeout(() => {
            if (this.paginatorRevisadas) {
              this.revisadas.paginator = this.paginatorRevisadas;
  
              // Configuración del paginador
              this.paginatorRevisadas._intl.itemsPerPageLabel = 'Registros por página';
              this.paginatorRevisadas._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
                if (length === 0 || pageSize === 0) {
                  return `Mostrando 0 de ${length}`;
                }
                const startIndex = page * pageSize;
                const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : length;
                return `Mostrando ${startIndex + 1} – ${endIndex} de ${length} registro(s)`;
              };
            } else {
              console.error('El paginador sigue sin inicializarse. Verifica que el mat-paginator esté presente en la vista.');
            }
          }, 0);
        } else {
          this.revisadas.data = [];
          this.hayResultadosRevisadas = false;
          this.sinResultadosRevisadas = true;
        }
        this.cargandoDatos = false;
        this.SpinnerService.hide();
      },
      (error) => {
        console.error('Error al cargar datos revisados:', error);
        this.hayResultadosRevisadas = false;
        this.sinResultadosRevisadas = true;
        this.cargandoDatos = false;
        this.SpinnerService.hide();
      }
    );
  }
  


  applyFilterPendientes(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.pendientes.filter = filterValue.trim().toLowerCase();
  
    if (this.pendientes.paginator) {
      this.pendientes.paginator.firstPage();
    }
  }

  applyFilterRevisadas(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.revisadas.filter = filterValue.trim().toLowerCase();
  
    if (this.revisadas.paginator) {
      this.revisadas.paginator.firstPage();
    }
  }

  verFoto(solicitud: any): void {
    this.SpinnerService.show();
  
    // Llama al servicio para obtener la foto usando `solicitud.codpersona`
    this.controlestudiosService.getFoto(solicitud.codpersona).subscribe(
      (fotoData) => {
        this.SpinnerService.hide();
  
        const base64Image = `data:image/jpeg;base64,${fotoData.foto}`;
        const initialState = {
          solicitud: solicitud,
          foto: base64Image, // Pasar la foto obtenida al modal
        };
  
        // Abre el modal con la foto y la información de la solicitud
        this.modalRef = this.modalService.show(VerFotoModalComponent, {
          ignoreBackdropClick: true,
          keyboard: false,
          class: 'modal-dialog-centered modal-lg',
          initialState: initialState,
        });
  
        // Suscribirse al resultado del modal (para aprobar o rechazar)
        this.modalRef.content.onAction?.subscribe((action: { aprobado: boolean; motivo?: string }) => {
          // Independientemente de la acción, recarga los datos pendientes
          this.cargarDatosPendientes();
        });
      },
      (error) => {
        console.error('Error al cargar la foto:', error);
        this.SpinnerService.hide();
      }
    );
  }


  verFotoProcesada(solicitud: any): void {
    this.SpinnerService.show();
  
    this.controlestudiosService.getFotoProcesada(solicitud.id_foto).subscribe(
      (fotoData) => {
        this.SpinnerService.hide();
  
        const base64Image = `data:image/jpeg;base64,${fotoData.foto}`;
        const initialState = {
          solicitud: solicitud,
          foto: base64Image,
          soloVisualizacion: true, // Modo solo visualización
        };
  
        this.modalRef = this.modalService.show(VerFotoModalComponent, {
          ignoreBackdropClick: true,
          keyboard: false,
          class: 'modal-dialog-centered modal-lg',
          initialState: initialState,
        });
      },
      (error) => {
        console.error('Error al cargar la foto:', error);
        this.SpinnerService.hide();
      }
    );
  }
  
  



  notificarExito(mensaje: string) {
    alert(mensaje);
  }
}
