import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { Console } from 'console';
import { SharedDataService } from '../../ce-academico/shared-data-service.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Observable, forkJoin, map } from 'rxjs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { ModalViewDocumentComponent } from '../modal-view-document/modal-view-document.component';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-gestion-plan-estudios',
  templateUrl: './gestion-plan-estudios.component.html',
  styleUrls: ['./gestion-plan-estudios.component.scss']
})
export class GestionPlanEstudiosComponent implements OnInit {

  modalRef: BsModalRef;

  idPrograma: number;
  datosPrograma: any = {}; // Aquí almacenarás los datos del programa
  planesEstudio = []; 
  menciones = [];
  trayectos: any[] = [];
  displayedColumns: string[] = ['codigoPlan', 'regimen', 'tipo', 'afilia','nombrePlan','estatus','mencion','gestion'];

  unidadesCurriculares: any[] = []; // Array para almacenar las unidades curriculares

  hayResultadosPlanes: boolean = false;
  sinResultadosPlanes: boolean = false;

  trayectoActual: string;
semestreActual: number | null;

    mencionActual: string;

    codPrograma: number;
    codOpsu: number;
    tipoProg: string;
    departamento: string;
    idDpto: number;
    nomPro: string;
    siglas: string;
    jefe: string;

  @ViewChild('paginatorProcesos') paginatorProcesos: MatPaginator;
  constructor(private route: ActivatedRoute,
    private modalService: BsModalService,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    public bsModalRef: BsModalRef,
    private sharedDataService: SharedDataService,
    private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.idPrograma = +idParam;
          this.cargarDatosPrograma(this.idPrograma);
          this.cargarPlanesEstudios(this.idPrograma);
        } else {
          // Manejo de la situación donde el id no está presente
          // Redireccionar o mostrar un mensaje de error, según sea necesario
        }
      });
    }
  
    cargarDatosPrograma(id: number): void {
      this.controlestudiosService.obtenerPrograma(id).subscribe(
        data => {
          this.datosPrograma = data;
          if (this.datosPrograma && this.datosPrograma.length > 0) {
            const programa = this.datosPrograma[0];
            this.codPrograma = programa.cod_programa;
            this.codOpsu = programa.cod_opsu;
            this.tipoProg = programa.tipo_prog;
            this.departamento = programa.departamento;
            this.idDpto = programa.id_dpto;
            this.nomPro = programa.nom_pro;
            this.siglas = programa.siglas;
            this.jefe = programa.jefe;
          }
          this.controlestudiosService.obtenerMenciones(id).subscribe(
            (            menciones: never[]) => {
              this.menciones = menciones;
              if (this.menciones.length === 0) {
                //this.gestionPlanForm.removeControl('mencion');
              }
            }
          );
        },
        error => {
          // Manejo de errores, por ejemplo, mostrar un mensaje de error
        }
      );
    }

  planSeleccionado: any = null; // El plan de estudios seleccionado

  // Método para cargar los planes de estudios (ajustar según tu servicio)
  cargarPlanesEstudios(id: number) {
    this.SpinnerService.show();
    this.controlestudiosService.obtenerPlanesEstudios(id).subscribe(
      data => {
        this.hayResultadosPlanes = false;
        this.sinResultadosPlanes = false;
        this.planesEstudio = data;
        if (this.planesEstudio.length == 0) {
          this.sinResultadosPlanes = this.planesEstudio.length == 0;
          this.hayResultadosPlanes = false;
          this.SpinnerService.hide();
         } else{
          this.planesEstudio = data;
          this.hayResultadosPlanes = this.planesEstudio.length > 0;
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

  // Método para manejar el clic en una fila del mat-table
  onFilaClic(codigoPlan: string) {

    this.planSeleccionado = codigoPlan;
    //console.log(this.planSeleccionado);
    // Aquí puedes cargar más detalles del plan si es necesario
    this.cargarTrayectos(codigoPlan);
  }

  cargarTrayectos(codigoPlan: string) {
    this.SpinnerService.show();
    // Lógica para cargar los trayectos del plan seleccionado
    this.controlestudiosService.obtenerTrayectosPorCodigoPlan(codigoPlan).subscribe(
      data => {
        this.trayectos = data; // Asegúrate de que el servicio retorne el formato adecuado
        this.SpinnerService.hide();
      },
      error => {
        // Manejo de errores
        console.error('Error al cargar los trayectos:', error);
        this.SpinnerService.hide();
      }
    );
  }

  verReportePlan(idPlan: number): void {
    this.SpinnerService.show();
    this.controlestudiosService.getImageReports().subscribe((data: any) => {
      const imagenIzquierda = data.imagenes.izquierda;
      const imagenDerecha = data.imagenes.derecha;

      this.controlestudiosService.obtenerDetallePlan(idPlan).subscribe((detallePlan: any) => {
        this.controlestudiosService.getCertificacionesYTitulos(idPlan).subscribe((certificacionesData: any[]) => {
          this.controlestudiosService.getTrayectosUC(idPlan).subscribe((trayectosData: any[]) => {
            this.loadUnidadesCurriculares(trayectosData).subscribe((unidadesData: any[]) => {
              // Asociar certificaciones con trayectos
              trayectosData.forEach(trayecto => {
                const anioTrayecto = trayecto.nombre_trayecto.slice(-1);
                const certificacion = certificacionesData.find(cert => cert.anio.toString().slice(-1) === anioTrayecto);
                trayecto.certificacion = certificacion;
              });

              const initialState = {
                detallePlan: detallePlan,
                trayectosData: trayectosData,
                unidadesData: unidadesData
              };

              this.modalRef = this.modalService.show(ModalViewDocumentComponent, {
                initialState: initialState,
                class: 'modal-xl custom-modal-scrollable',
              });
            });
            this.SpinnerService.hide();
          });
        });
      });
    });
  }

  loadUnidadesCurricularesVisor(trayectosData: any[]): Observable<any[]> {
    const unidadesRequests = trayectosData.map(trayecto =>
      this.controlestudiosService.getUnidadesAsociadas(trayecto.id_trayecto).pipe(
        map(unidades => ({
          nombre_trayecto: trayecto.nombre_trayecto,
          unidades: unidades.length > 0 ? unidades : [{ mensaje: 'No hay unidades curriculares asociadas a este trayecto, verifique en la opción del Menú: Académico - Programas Académicos' }]
        }))
      )
    );
    return forkJoin(unidadesRequests);
  }


  generarReportePlan(idPlan: number): void {
    this.SpinnerService.show();
    // Paso 1: Obtener imágenes del reporte
    this.controlestudiosService.getImageReports().subscribe((data: any) => {
      const imagenIzquierda = data.imagenes.izquierda;
      const imagenDerecha = data.imagenes.derecha;
      
      // Paso 2: Obtener detalle del plan
      this.controlestudiosService.obtenerDetallePlan(idPlan).subscribe((detallePlan: any) => {
        console.log(detallePlan);
        // Paso 3: Obtener certificaciones y títulos
        this.controlestudiosService.getCertificacionesYTitulos(idPlan).subscribe((certificacionesData: any[]) => {
          
          // Paso 4: Obtener trayectos
          this.controlestudiosService.getTrayectosUC(idPlan).subscribe((trayectosData: any[]) => {
            
            // Paso 5: Obtener unidades curriculares para los trayectos
            this.loadUnidadesCurriculares(trayectosData).subscribe((unidadesData: any[]) => {
              
              // Generar el PDF con todos los datos obtenidos
              this.generarPDF(detallePlan, imagenIzquierda, imagenDerecha, trayectosData, unidadesData, certificacionesData);
              this.SpinnerService.hide();
            });
          });
        });
      });
    });
  }
  
  loadUnidadesCurriculares(trayectosData: any[]): Observable<any[]> {
    const unidadesRequests = trayectosData.map(trayecto => 
      this.controlestudiosService.getUnidadesAsociadas(trayecto.id_trayecto).pipe(
        map(unidades => ({
          trayecto: trayecto.nombre_trayecto,
          id_trayecto: trayecto.id_trayecto,
          unidades: unidades.length > 0 ? unidades : [{ mensaje: 'No hay unidades curriculares asociadas a este trayecto, verifique en la opción del Menú: Académico - Programas Académicos' }]
        }))
      )
    );
    return forkJoin(unidadesRequests);
  }
  
  generarPDF(detallePlan: any, imagenIzquierda: string, imagenDerecha: string, trayectosData: any[], unidadesData: any[], certificacionesData: any[]): void {
    const docDefinition = {
      pageSize: 'Letter',
      pageMargins: [40, 30, 40, 105],
      content: [
        {
          columns: [
            {  // Imagen izquierda
              image: imagenIzquierda,
              fit: [110, 100],
              width: 75,
              alignment: 'left'
            },
            { text: 'República Bolivariana de Venezuela\nUniversidad Nacional Experimental del Transporte\nDirección de Control de Estudios', style: 'headerCenter', alignment: 'center' },
            {  // Imagen derecha
              image: imagenDerecha,
              width: 75,
              alignment: 'right'
            }
          ]
        },
        {
          text: 'Plan de Estudios / Malla Curricular',
          style: 'header',
          alignment: 'center',
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            body: [
              [
                { text: 'Nombre del programa:', bold: true, fontSize: 8 }, { text: detallePlan[0].nombre_programa, fontSize: 8 },
                { text: 'Mención:', bold: true, fontSize: 8 }, { text: detallePlan[0].sigla_mencion ? detallePlan[0].nombre_mencion : 'No aplica', fontSize: 8 }
              ],
              [
                { text: 'Nombre del plan:', bold: true, fontSize: 8 }, { text: detallePlan[0].nombre_plan, fontSize: 8 },
                { text: 'Tipo de plan:', bold: true, fontSize: 8 }, { text: detallePlan[0].tipo_plan, fontSize: 8 }
              ],
              [
                { text: 'Duración (en años):', bold: true, fontSize: 8 }, { text: detallePlan[0].duracion, fontSize: 8 },
                { text: 'Situación:', bold: true, fontSize: 8 }, { text: detallePlan[0].estatus, fontSize: 8 }
              ],
              [
                { text: 'Afiliación:', bold: true, fontSize: 8 }, { text: detallePlan[0].afiliacion, fontSize: 8 },
                { text: '', fontSize: 9 }, { text: '', fontSize: 8 }
              ]
            ]
          },
          layout: 'noBorders',
          margin: [0, 5, 0, 5]
        },
        ...trayectosData.map(trayecto => {
          const unidadesTrayecto = unidadesData.find(ud => ud.trayecto === trayecto.nombre_trayecto);
          const anioTrayecto = trayecto.nombre_trayecto.slice(-1);
          const certificacion = certificacionesData.find(cert => cert.anio.toString().slice(-1) === anioTrayecto);
  
          // Si no hay unidades, mostrar el mensaje
      const unidadRows = unidadesTrayecto.unidades.some((uc: { mensaje: any; }) => uc.mensaje)
      ? [[{ text: unidadesTrayecto.unidades[0].mensaje, colSpan: 3, alignment: 'center', style: 'tableContent' }, {}, {}]]
      : unidadesTrayecto.unidades.map((uc: { codigo_uc: any; nombre_reporte: any; creditos: any; }) => [
          { text: uc.codigo_uc, style: 'tableContent' },
          { text: uc.nombre_reporte, style: 'tableContent' },
          { text: uc.creditos, style: ['tableContent', 'centerAlign'] }
        ]);
  
          if (certificacion) {
            unidadRows.push([
              { text: certificacion.tipo_certificacion === 'T' ? `Titulación: ${certificacion.titulo_certificacion}` : `Certificación: ${certificacion.titulo_certificacion}`, colSpan: 3, alignment: 'center', fillColor: '#f2f2f2', bold: true, style: 'certificacionContent', margin: [0, 5, 0, 5] },
              {}, {}
            ]);
          }
  
          return {
            stack: [
              {
                text: `${trayecto.nombre_trayecto}`,
                style: 'trayectoHeader',
                alignment: 'left'
              },
              {
                table: {
                  headerRows: 1,
                  widths: ['11%', '79%', '10%'],
                  body: [
                    [
                      { text: 'Código', style: 'tableHeader' },
                      { text: 'Unidad Curricular', style: 'tableHeader' },
                      { text: 'Créditos', style: ['tableHeader', 'centerAlign'] }
                    ],
                    ...unidadRows
                  ]
                },
                layout: 'lightHorizontalLines',
                width: '*'
              }
            ],
            margin: [0, 0, 0, 10]
          };
        }),
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        certificacion: {
          fontSize: 8,
          margin: [0, 0, 0, 5]
        },
        trayectoHeader: {
          fontSize: 12,
          bold: true,
          margin: [0, 5, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 9,
          color: 'black'
        },
        tableContent: {
          fontSize: 8
        },
        certificacionContent: {
          fontSize: 8,
          fillColor: '#f2f2f2'
        },
        centerAlign: {
          alignment: 'center'
        },
        nota: {
          fontSize: 7,
          italics: true,
          alignment: 'justify',
          margin: [10, 0, 10, 0] // Ajusta el margen según sea necesario
        },
      },
      footer: (currentPage: number, pageCount: number) => {
        return {
          margin: [40, 10, 40, 10],
          stack: [
            {
              columns: [
                { 
                  width: '38%', 
                  text: 'Nota: Conforme al Decreto Nº 3.757 del 05-02-2019, publicado en la Gaceta Oficial de la República Bolivariana de Venezuela N° 41.579 de misma fecha, el Instituto Universitario de Tecnología Dr. Federico Rivero Palacio (IUT-RC) pasó a integrar la Universidad Nacional Experimental del Transporte (UNETRANS).',
                  style: 'nota'
                }
              ],
              margin: [0, 0, 0, 10]
            },
            {
              columns: [
                {
                  text: `Pág. ${currentPage} de ${pageCount}`,
                  fontSize: 7,
                  alignment: 'right',
                  bold: true
                }
              ]
            }
          ]
        };
      }
    };
  
    pdfMake.createPdf(docDefinition as any).download(`Detalle_${detallePlan[0].nombre_plan}.pdf`);
  }

}