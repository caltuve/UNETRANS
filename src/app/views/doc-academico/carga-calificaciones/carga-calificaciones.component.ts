import { AfterViewInit, Component, OnInit, ViewChild, } from '@angular/core';
import {FormBuilder, Validators,ValidatorFn, AbstractControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { ShowActaComponent } from '../../ce-academico/show-acta/show-acta.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface ErrorMensaje {
  titulo: string;
  mensaje: string;
}

@Component({
  selector: 'app-carga-calificaciones',
  templateUrl: './carga-calificaciones.component.html',
  styleUrls: ['./carga-calificaciones.component.scss']
})
export class CargaCalificacionesComponent implements AfterViewInit, OnInit {

  errorMessage: ErrorMensaje | null = null; 

  arrayDatos : any []= [];
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['pnf','periodo', 'acta', 'seccion', 'nombre_uc','tipo_sec','inscritos', 'estatus','gestion'];

  minDate1!: Date;
  maxDate1!: Date;

  dato: any []= [];
  nacs: any []= [];
  genero: any []= [];
  carreras: any []= [];
  carreras2: any []= [];
  aspirantes: any []= [];

  moding: any []= [];
  turnos: any []= [];
  trayectos: any []= [];
  convenios: any []= [];

  hayResultadosDocente: boolean = false;
  sinResultadosDocente: boolean = false;
  cargandoDatos = true; // Añade esto a tu componente

  hayResultadosSecciones: boolean = false;
  sinResultadosSecciones: boolean = false;

  modalRef: BsModalRef; 

  detallesUC: any = {}; // Para almacenar los detalles de la UC
  detalle_acta : any []= [];
  inscritos : any []= [];
  resumen :any = {}

  logounetrans: string;
  logosecretaria: string;

  usrsice: string;

  rol: any []= [];


  //@ViewChild('gestionNewAspConvenio') public gestionNewAspConvenio: ModalDirective;
  @ViewChild(MatPaginator, { static: false }) paginatorProcesos: MatPaginator;

  nac!: string;
  cedula!: number;
  fecnac!: Date;
  primer_nombre!: string;
  segundo_nombre!: string;
  primer_apellido!: string;
  segundo_apellido!: string;
  pnf!: string;
  trayecto!: string;
  mod_ingreso!: string;
  convenio!: string;

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
  
  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private modalService: BsModalService,
    private router: Router) {

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minDate1 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate1 = new Date(currentYear - 14, currentMonth, currentDay);

      this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
    }



  ngOnInit() {

    this.findDocentesDep(this.usr.usrsice);
}

ngAfterViewInit() {
  setTimeout(() => {
    if (this.paginatorProcesos) {
      this.paginatorProcesos._intl.itemsPerPageLabel = 'Registros por página';

  this.paginatorProcesos._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return 'Mostrando 0 de ' + length + ' registros';
    }
    const startIndex = page * pageSize;
    // Ajuste para evitar que el índice de inicio sea mayor que el total de registros
    const endIndex = Math.min(startIndex + pageSize, length);
    
    return 'Mostrando ' + (startIndex + 1) + ' – ' + endIndex + ' de ' + length + ' registros';
  };
  this.dataSource.paginator = this.paginatorProcesos;
    }
  });

    
}

findDocentesDep(usrsice: any) {
  this.cargandoDatos = true;
  this.SpinnerService.show();
  
  this.controlestudiosService.getCursosDocenteCargaNotas(usrsice).subscribe({
    next: (data) => {
      this.cargandoDatos = false;
      this.SpinnerService.hide();
      if (data.error) {
        // Manejar error desde el backend
        this.errorMessage = {
          titulo: data.error.titulo,
          mensaje: data.error.mensaje
        };
        this.sinResultadosDocente = true;
        this.hayResultadosDocente = false;
        this.dataSource.data = [];
      } else {
        // Asignar los datos al dataSource del mat-table
        this.dataSource.data = data;
        this.sinResultadosDocente = data.length === 0;
        this.hayResultadosDocente = data.length > 0;
        if (this.hayResultadosDocente) {
          setTimeout(() => this.dataSource.paginator = this.paginatorProcesos);
        }
      }
    },
    error: (error) => {
      // Manejar error de conexión o del lado cliente
      this.errorMessage = {
        titulo: "Error de Conexión:",
        mensaje: "Error al conectar con el servicio. Intente más tarde."
      };
      this.sinResultadosDocente = true;
      this.hayResultadosDocente = false;
      this.cargandoDatos = false;
      this.SpinnerService.hide();
    }
  });
}


irAGestionActaCalificaciones(idActa: string): void {
  console.log(idActa);
  this.router.navigate(['/doc-academico/carga-calificaciones/detalle-acta-calificaciones-docente', idActa]);
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


descargarActa(idActa: number) {
  //this.cargandoDatos = true;
  this.SpinnerService.show();
  this.controlestudiosService.getDetailActaCargada(idActa).subscribe(data => {
    this.SpinnerService.hide();
    if (data && data.length > 0 && data[0]['inscritos'] && data[0]['inscritos'].length > 0) {
      // Accede al objeto de detalles de la UC usando la clave "0"
      this.detallesUC = data[0]['0']; // Ahora detallesUC contiene los detalles de la UC

      this.inscritos = data[0]['inscritos']; // Establece los estudiantes inscritos como dataSource
      this.resumen = data[0]['resumen'];
      this.logounetrans = data[0]['imagenIzquierda'];  // Extraer la imagen izquierda
      this.logosecretaria = data[0]['imagenDerecha'];  
      this.hayResultadosSecciones = true;
      this.cargandoDatos = false;

      this.generarPDF(this.detallesUC, this.inscritos, this.resumen, this.logounetrans, this.logosecretaria)
      if (this.hayResultadosDocente) {
        setTimeout(() => this.dataSource.paginator = this.paginatorProcesos);
      }
    } else {
      this.sinResultadosSecciones = true;
      this.cargandoDatos = false;
    }
  }, error => {
    console.error(error);
    this.SpinnerService.hide();
  });
}

 generarPDF(datosEstudiante: { nombre_programa: any, prof_asignado: any, cedula: any, nombre_jefe: any, cedula_jefe: any, acta: any; periodo: any; tipo_programa: any, cod_ucurr: any,uni_curr: any  }, 
            datosInscripcion: any[], 
            datosResumen: {totalInscritos: any, totalRetirados: any, totalAprobados: any, totalReprobados: any, tasaAprobacion: any},
            imagenIzquierda: string, 
            imagenDerecha: string) {
  const fechaActual = new Date();
  const mesEnMayusculas = fechaActual.toLocaleString('es-ES', { month: 'long' }).toUpperCase();

  const docDefinition = {
    pageSize: 'Letter',
    pageMargins: [40, 160, 40, 120],
    header: () => {
      return {
        margin: [40, 25, 40, 0], // Ajustar márgenes si es necesario
        stack: [
          {
            columns: [
              {
                // Imagen izquierda
                image: imagenIzquierda,
                fit: [110, 100],
                width: 80,
                alignment: 'left'
              },
              {
                // Texto central
                stack: [
                  { text: 'Universidad Nacional Experimental del Transporte', style: 'headerCenter' },
                  { text: 'Dirección de Control de Estudios', style: 'subHeaderCenter' }
                ],
                alignment: 'center',
                width: '*',
              },
              {
                // Imagen derecha
                image: imagenDerecha,
                width: 70,
                alignment: 'right'
              }
            ]
          },
          // Espacio adicional para separar el encabezado de las imágenes del texto del acta
          { text: '', margin: [0, 5, 0, 0] },
          {
            text: 'Acta de Calificaciones',
            style: 'header',
            alignment: 'center'
          },
          // Tabla de detalles del acta justo debajo del título
          {
            style: 'detailsTable',
            table: {
              widths: [90, '*', 90, 'auto'],
              body: [
                [
                  { text: 'Acta No.', bold: true },
                  { text: datosEstudiante.acta.toString() },
                  { text: 'Período Académico', bold: true },
                  { text: datosEstudiante.periodo }
                ],
                [
                  { text: 'Docente', bold: true },
                  { text: `${datosEstudiante.prof_asignado} (${datosEstudiante.cedula})`, colSpan: 3 }, {}, {},
                ],
                [
                  { text: 'Unidad Curricular', bold: true },
                  { text: `${datosEstudiante.uni_curr} (${datosEstudiante.cod_ucurr})`, colSpan: 3 }, {}, {},
                ],
                [
                  { text: 'Programa', bold: true },
                  { text: datosEstudiante.nombre_programa, colSpan: 3 }, {}, {},
                ]
              ]
            },
            layout: 'lightHorizontalLines' // Añade líneas horizontales para claridad
          }
        ]
      };
    },
    footer: (currentPage: number, pageCount: number) => {
      return {
        margin: [40, 25, 40, 0],  // Ajustar los márgenes como necesarios
        stack: [
          {
            table: {
              widths: ['33%', '33%', '34%'],  // Divide el footer en tres columnas
              body: [
                [
                  // Columna de firma del docente
                  {
                    stack: [
                      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 0.5 }], alignment: 'center' },
                      { text: datosEstudiante.prof_asignado, style: 'signatureName', alignment: 'center' },
                      { text: `C.I.: ${datosEstudiante.cedula}`, style: 'signatureCedula', alignment: 'center' },
                      { text: 'Docente', style: 'signatureTitle', alignment: 'center' }
                    ],
                    margin: [0, 0, 0, 5]  // Incrementa el espacio debajo de cada firma
                  },
                  {
                    stack: [
                      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 0.5 }], alignment: 'center' },
                      { text: datosEstudiante.nombre_jefe, style: 'signatureName', alignment: 'center' },
                      { text: `C.I.: ${datosEstudiante.cedula_jefe}`, style: 'signatureCedula', alignment: 'center' },
                      { text: 'Jefe Dpto. o Escuela', style: 'signatureTitle', alignment: 'center' }
                    ],
                    margin: [0, 0, 0, 5]
                  },
                  {
                    stack: [
                      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 0.5 }], alignment: 'center' },
                      { text: 'OROZCO ORTEGA, YURIKA ISABEL', style: 'signatureName', alignment: 'center' },
                      { text: 'C.I.: V-14574763', style: 'signatureCedula', alignment: 'center' },  // Líneas en blanco
                      { text: 'Dir. Control Estudios', style: 'signatureTitle', alignment: 'center' }
                    ],
                    margin: [0, 0, 0, 5]
                  }
                ]
              ]
            },
            layout: 'noBorders'  // Elimina las bordes de la tabla
          },
          {
            text: 'Este documento ha sido generado automáticamente por un sistema computarizado y es oficial solo en su forma original. Cualquier alteración, enmienda o tachadura invalida este documento de manera inmediata y completa.',
            style: 'smallFooter',
            margin: [0, 0, 0, 10]  // Añade un pequeño margen debajo para separar del resto del footer
          },
          {
            columns: [
              { 
                text: `${datosEstudiante.acta.toString()}-${datosEstudiante.cod_ucurr}, ${datosEstudiante.cedula}`,
                fontSize: 7,
                alignment: 'left',
                width: 'auto'
              },
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
    },
    content: [
      {
        text: 'Detalle de calificaciones del acta:',
        bold: true,
        fontSize: 9,
        style: 'subheader', // Estilo para el título de la sección
        margin: [0, 10, 0, 1] // Margen: [izquierda, arriba, derecha, abajo]
      },
      // Tabla de calificaciones
      {
        style: 'tablaCalificaciones',
        table: {
          headerRows: 1, 
          widths: [13, 38, 50, '*', 22, 52], // Ajusta según la necesidad de tu tabla
          body: [
            ['N°', 'Carnet', 'Cédula', 'Nombre Completo', 'Calif.', 'Estatus'].map(header => ({ text: header, style: 'tableHeader' })),
            ...datosInscripcion.map(item => [
              item.orden,
              item.carnet,
              item.cedula,
              item.nombre_completo,
              { text: item.calificacion.toString(), alignment: 'center', },
              item.estado_calificacion,
            ]),
          ],
        },
        layout: {
          hLineWidth: function(i: number, node: { table: { body: string | any[]; }; }) {
            return (i === 0 || i === node.table.body.length) ? 2 : 1; // Líneas más gruesas en la parte superior e inferior de la tabla
          },
          vLineWidth: function(i: any, node: any) {
            return 0; // Líneas verticales eliminadas
          },
          hLineColor: function(i: number, node: { table: { body: string | any[]; }; }) {
            return i === 0 || i === node.table.body.length ? 'black' : 'gray'; // Color de las líneas horizontales
          },
          paddingLeft: function(i: any, node: any) { return 10; },
          paddingRight: function(i: any, node: any) { return 10; },
          paddingTop: function(i: any, node: any) { return 2; },
          paddingBottom: function(i: any, node: any) { return 2; },
        }
      },
      {
        text: 'Resumen del acta:',
        bold: true,
        fontSize: 9,
        style: 'subheader', // Estilo para el título de la sección
        margin: [0, 10, 0, 1] // Margen: [izquierda, arriba, derecha, abajo]
      },
      {
        style: 'tablaCalificaciones',
        table: {
          widths: ['*', '*', '*', '*', '*'],  // Ajusta según necesidad
          body: [
            ['Total Inscritos', 'Total Retirados', 'Total Aprobados', 'Total Reprobados', 'Tasa de Aprobación'].map(header => ({ text: header, style: 'tableHeader' })),
            [
              { text: datosResumen.totalInscritos.toString(), alignment: 'center', },
              { text: datosResumen.totalRetirados.toString(), alignment: 'center', },
              { text: datosResumen.totalAprobados.toString(), alignment: 'center', },
              { text: datosResumen.totalReprobados.toString(), alignment: 'center', },
              { text:datosResumen.tasaAprobacion, alignment: 'center', },
            ]
          ]
        },
        layout: {
          hLineWidth: function(i: number, node: { table: { body: string | any[]; }; }) {
            return (i === 0 || i === node.table.body.length) ? 2 : 1;
          },
          vLineWidth: function(i: any, node: any) {
            return 0;  // Sin líneas verticales para mantener consistencia
          },
          hLineColor: function(i: number, node: { table: { body: string | any[]; }; }) {
            return i === 0 || i === node.table.body.length ? 'black' : 'gray';
          },
          paddingLeft: function(i: any, node: any) { return 10; },
          paddingRight: function(i: any, node: any) { return 10; },
          paddingTop: function(i: any, node: any) { return 2; },
          paddingBottom: function(i: any, node: any) { return 2; },
        }
      },
    ],
    styles: {
      header: {
        fontSize: 13,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 2], // Ajustar según sea necesario
      },
      tableHeader: {
        fillColor: '#dddddd',
        bold: true,
        alignment: 'center',
      },
      tablaCalificaciones: {
        fontSize: 9,
        margin: [0, 5, 0, 5],
      },signaturePlaceholder: {
        fontSize: 12,
        bold: true
      },
      signatureName: {
        fontSize: 7,
        bold: true
      },
      signatureCedula: {
        fontSize: 7
      },
      signatureTitle: {
        fontSize: 7,
        italics: true
      },
      smallFooter: {
        fontSize: 8,
        italics: true,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      },
      resumenStyle: {
        fontSize: 9,
        margin: [0, 10, 0, 10],
        alignment: 'left'
      },
      headerCenter: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 5]  // Margen: [izquierda, arriba, derecha, abajo]
      },
      subHeaderCenter: {
        fontSize: 12,
        bold: false,
        margin: [0, 0, 0, 0] // Minimizar los márgenes adicionales
      },
      detailsTable: {
        fontSize: 9,
        margin: [0, 0, 0, 5]
      },
    },
  };

  pdfMake.createPdf(docDefinition as any).download('Acta_Calificaciones.pdf');
}



}