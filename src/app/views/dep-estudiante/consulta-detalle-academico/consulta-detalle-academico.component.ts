import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { Console } from 'console';
import { NotificacionService } from './../../../notificacion.service'

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

@Component({
  selector: 'app-consulta-detalle-academico',
  templateUrl: './consulta-detalle-academico.component.html',
  styleUrls: ['./consulta-detalle-academico.component.scss']
})
export class ConsultaDetalleAcademicoComponent {
  displayedColumns: string[] = ['cohorte','plan', 'carnet', 'pnf', 'grado', 'condicion' ];
  dataSource2 = new MatTableDataSource();

  idPersona: number;
  usrsice: string;

  rol: any []= [];

  hayResultadosDocumentos: boolean = false;
  sinResultadosDocumentos: boolean = false;

  hayResultados: boolean = false;
  sinResultados: boolean = false;
  cargandoDatos = true; // Añade esto a tu componente

  dataSource = new MatTableDataSource<Estudiante>();
  cedulaActual: number;
  dataSourceUC = new MatTableDataSource();
  constructor(private route: ActivatedRoute,
    private modalService: BsModalService,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    public bsModalRef: BsModalRef,
    private router: Router,

    ) { 
      this.obtenerUsuarioActual();
    }

    ngOnInit(): void {
      this.route.paramMap.subscribe((params: { get: (arg0: string) => any; }) => {
        const idParam = params.get('id');
        if (idParam) {
          this.idPersona = +idParam;
          this.cargarDatosPersona(this.idPersona);
        } else {
          // Manejo de la situación donde el id no está presente
          // Redireccionar o mostrar un mensaje de error, según sea necesario
        }
      });
    }

    obtenerUsuarioActual() {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      this.usrsice = currentUser.usrsice;
      this.rol = currentUser.rol;
    }

    cargarDatosPersona(id: number): void {
      this.SpinnerService.show();
      this.controlestudiosService.findPersonaInscripcion({ cedula: id }).subscribe(
        (result: any) => {
          this.hayResultados = false;
          this.sinResultados = false;
    
          if (result && result.estudiante) {
            // Almacena los datos del estudiante
            this.dataSource.data = [result.estudiante];
            this.cedulaActual = id;
    
            this.controlestudiosService.findPersonaCalificaciones({ cedula: this.cedulaActual }).subscribe(
              (result: any) => {
                this.hayResultados = false;
                this.sinResultados = false;
                this.dataSource2.data = result;
    
                if (this.dataSource2.data.length == 0) {
                  this.SpinnerService.hide();
                  this.sinResultados = true;
                  this.hayResultados = false;
                } else {
                  this.notifyService.showSuccess('Consulta de datos de estudiante');
                  this.SpinnerService.hide();
                  this.hayResultados = true;
    
                  // Recorre todos los programas activos y llama a findInscripcion para cada carnet
                  this.dataSource.data.forEach((programa: any) => {
                    if (programa.carnet && programa.estatus === 1) {
                      this.findInscripcion(programa.carnet); // Invoca la función con el carnet del programa activo
                    }
                  });
                }
              }
            );
    
            this.hayResultados = true; // Indica que hay resultados
          } else {
            // No se encontraron datos
            this.sinResultados = true;
            this.hayResultados = false;
          }
    
          this.SpinnerService.hide();
        },
        error => {
          // Manejo de error
          console.error('Error al buscar datos: ', error);
          this.SpinnerService.hide();
          this.sinResultados = true;
          this.hayResultados = false;
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

}
