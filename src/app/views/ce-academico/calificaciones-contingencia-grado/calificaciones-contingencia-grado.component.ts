import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { ChangeDetectorRef } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MigrastudentService } from '../../migraestudiantes/migrastudent.service';
import { Console } from 'console';

interface UnidadCurricular {
  codigo_uc: string;
  nombre_uc: string;
  creditos: number;
  nota_minima: number;
  calificacion: number | null;
  periodoSeleccionado: string | null;
  noCursado: boolean;
  periodosFiltrados?: string[];
}

interface Periodo {
  nombre: string;
  materias: string[];
}

interface Materia {
  id: string;
  nombre: string;
}

interface Calificacion {
  materiaId: string;
  periodoAcademico: string;
  calificacion: string; // o 'number' si es numérico
  // Agrega otros campos como fecha, observaciones, etc., según sean necesarios
}

interface DatosReporte {
  periodos: { [key: string]: Periodo };
  materias: { [key: string]: Materia };
  calificaciones: Calificacion[];
}

@Component({
  selector: 'app-calificaciones-contingencia-grado',
  templateUrl: './calificaciones-contingencia-grado.component.html',
  styleUrls: ['./calificaciones-contingencia-grado.component.scss']
})
export class CalificacionesContingenciaGradoComponent {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel>;

  displayedColumns: string[] = ['carnet','cohorte', 'cedula', 'nombre_persona', 'pnf', 'grado', 'plan'];
  dataSource = new MatTableDataSource();
  hayResultados: boolean = false;
  sinResultados: boolean = false;

  sinResultadosUC: boolean = false;

  periodos: any[] = [];

  unidadesPorTrayectoYSemestre: { [key: string]: any[] } = {};

  public visible = false;

  planSeleccionado: any = null; // El plan de estudios seleccionado

  datosRegimen: any = null; // El plan de estudios seleccionado

  trayectos: any[] = [];

  unidadesCurriculares: any[] = []; // Array para almacenar las unidades curriculares

  carnet!: string;
  cedula!: string;
  nombre!: string;
  resultados!: string[];

  plan!: string;
  mensajeSinResultados!: string;

  usr = {
    nac: null,
    cedula: null,
    nombre_completo: null,
    nombre_corto: null,
    fecnac: null,
    carnet: null,
    pnf: null,
    email: null,
    saludo: null,
    usrsice: null,
  }

  detallesUC: any = {}; // Para almacenar los detalles de la UC
  estudiante: any[] = [];
  datosRector: any[] = [];
  datosSecretaria: any[] = [];
  escala: any[] = [];
  resumen: any = {}

  logounetrans: string;
  logosecretaria: string;

  @ViewChild('formSearchPersona') formSearchPersona!: NgForm;
  constructor(public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService: NotificacionService,
    private changeDetectorRef: ChangeDetectorRef,
    public aspiranteService: MigrastudentService
  ) {
    this.usr = JSON.parse(sessionStorage.getItem('currentUser')!);
  }


  searchPersona(formSearchPersona: NgForm) {
    this.SpinnerService.show();
    this.trayectos = []; // Limpia los trayectos existentes
    this.sinResultadosUC = false; // Resetea el estado de resultados UC
    this.planSeleccionado = null; // Resetea el plan seleccionado
    this.controlestudiosService.findPersonaCalificaciones(formSearchPersona.value).subscribe(
      (result: any) => {
        this.hayResultados = false;
        this.sinResultados = false;
        this.dataSource.data = result;
        if (this.dataSource.data.length == 0) {
          this.SpinnerService.hide();
          this.sinResultados = this.dataSource.data.length == 0
          this.hayResultados = false;
          this.formSearchPersona.reset();
        }
        else {
          this.notifyService.showSuccess('Consulta de datos de estudiante');
          this.SpinnerService.hide();
          this.hayResultados = this.dataSource.data.length > 0
          this.formSearchPersona.reset();
        }

      }
    );
  }


  // Método para manejar el clic en una fila del mat-table
  onFilaClic(tipo_titulacion: number, carnet: string) {
    this.sinResultadosUC = true;
    this.cargarTrayectos(tipo_titulacion,carnet);
    // Reiniciar el acordeón
    this.reiniciarAcordeon();
  }

  cargarTrayectos(tipo_titulacion: number, carnet: string ) {
    this.SpinnerService.show();
    // Lógica para cargar los trayectos del plan seleccionado
    this.controlestudiosService.obtenerTrayectosPorCodigoPlanYTrayecto(tipo_titulacion,carnet).subscribe(
      data => {
        this.trayectos = data; // Asegúrate de que el servicio retorne el formato adecuado
        console.log(this.trayectos)
        this.SpinnerService.hide();
        
      },
      error => {
        // Manejo de errores
        console.error('Error al cargar los trayectos:', error);
        this.SpinnerService.hide();
      }
    );
  }

  reiniciarAcordeon() {
    setTimeout(() => {
      this.accordion.closeAll();
    }, 0);
  }


  cargarUnidadesCurriculares(idTrayecto: number): void {
    this.SpinnerService.show();
    const carnetEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).carnet : null;

    // Reiniciar unidades curriculares y sinResultadosUC
    this.unidadesCurriculares = [];
    this.sinResultadosUC = false;

    this.controlestudiosService.obtenerUnidadesCurricularesGrado(idTrayecto, carnetEstudiante)
  .subscribe((data: any) => {
    if (data.mensaje) {
      this.sinResultadosUC = true;
      this.mensajeSinResultados = data.mensaje;  // Guarda el mensaje específico
      this.SpinnerService.hide();
    } else {
      this.sinResultadosUC = data.length === 0;
      if (!this.sinResultadosUC) {
        this.unidadesCurriculares = data.map((uc: UnidadCurricular) => ({
          ...uc,
          periodoSeleccionado: null,
          noCursado: uc.noCursado || false
        }));
      }
      this.SpinnerService.hide();
      this.findPeriodos();
    }
  });
  }

  copiarUC(ucOriginal: any): void {
    // Encuentra el índice de la unidad curricular actual en el array
    const indiceUCActual = this.unidadesCurriculares.indexOf(ucOriginal);

    // Copia la unidad curricular
    const nuevaUC = { ...ucOriginal, calificacion: null, periodoSeleccionado: null };

    // Actualizar la nueva UC con los períodos filtrados
    nuevaUC.periodosFiltrados = this.obtenerPeriodosFiltrados(ucOriginal);

    // Inserta la nueva UC justo después de la actual
    this.unidadesCurriculares.splice(indiceUCActual + 1, 0, nuevaUC);

    // Crear un nuevo array para asegurarse de que los cambios se detecten
    this.unidadesCurriculares = [...this.unidadesCurriculares];

    // Refresca el dataSource si estás utilizando MatTableDataSource
    // this.dataSource.data = [...this.unidadesCurriculares];

    // Forzar la detección de cambios si es necesario
    this.changeDetectorRef.detectChanges();
  }

  guardarCalificacionesTrayecto(trayecto: any) {
    // Añadir un nuevo registro de calificación para la misma UC pero con el próximo período
    // Puedes añadirlo al array de unidadesCurriculares u otro array dedicado a registros adicionales
  }

  findPeriodos() {
    this.SpinnerService.show();
    this.controlestudiosService.getPeriodosCalificaciones().subscribe(
      (data: any) => {

        // Filtrar los períodos por régimen
        this.periodos = data.filter((periodo: { periodicidad: string; }) => periodo.periodicidad === 'ANUAL');
        this.SpinnerService.hide();
      }
    );
  }

  onPeriodoChange(ucActual: any): void {
    if (ucActual.periodoSeleccionado) {
      this.controlestudiosService.obtenerNotaMinima(ucActual.codigo_uc, ucActual.periodoSeleccionado).subscribe({
        next: escalas => {
          ucActual.nota_minima = escalas.nota_minima;
          ucActual.nota_maxima = escalas.nota_maxima;
          ucActual.nota_aprobatoria = escalas.nota_aprobatoria;
          ucActual.nota_apro_proyecto = escalas.nota_apro_proyecto;
          ucActual.nota_aprobatoria_final = escalas.nota_aprobatoria_final;
  
          this.validarCalificacion(ucActual);
          this.validarCalificacionesCompletas();
        },
        error: err => {
          const errorMessage = err.error?.error || 'Error desconocido';
          this.notifyService.showError(`${errorMessage}`);
        }
      });
    }
  }

isApproved(uc: any): boolean {
  return uc.calificacion >= uc.nota_aprobatoria && uc.calificacion <= uc.nota_maxima;
}

isOutOfRange(uc: any): boolean {
  return uc.calificacion > uc.nota_maxima;
}

isFailed(uc: any): boolean {
  return uc.calificacion < uc.nota_aprobatoria && uc.calificacion >= uc.nota_minima;
}

validarCalificacion(uc: any): void {
  if (uc.calificacion && uc.calificacion < uc.nota_minima) {
    this.copiarUC(uc);
    this.validarCalificacionesCompletas();
  }
}

  obtenerPeriodosFiltrados(ucActual: any): any[] {
    // Si la UC actual no tiene período seleccionado o no está reprobada, mostrar todos los períodos
    if (!ucActual.periodoSeleccionado || ucActual.calificacion >= ucActual.nota_minima) {
      return this.periodos;
    }

    // Encontrar el índice del período actual en el array de períodos
    const indicePeriodoActual = this.periodos.findIndex(p => p.periodo === ucActual.periodoSeleccionado);

    // Si no se encuentra el período, devolver todos los períodos
    if (indicePeriodoActual === -1) return this.periodos;

    // Devolver los períodos anteriores al actual
    // Asumiendo que la lista de períodos está ordenada de más reciente a más antiguo
    return this.periodos.slice(0, indicePeriodoActual);
  }


  guardarCalificaciones(): void {
    this.SpinnerService.show();
    if (!this.validarCalificacionesCompletas()) {
      console.error('No se han completado todas las calificaciones.');
      return;
    }

    // Suponiendo que 'carnet' es parte de la primera fila de dataSource
    const carnetEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).carnet : null;
    console.log(carnetEstudiante);
    if (!carnetEstudiante) {
      console.error('No se encontró el carnet del estudiante.');
      return;
    }

    const usrid = this.usr ? this.usr.usrsice : null; // Asegúrate de que 'id' es la propiedad correcta

    if (!usrid) {
      console.error('No se encontró el ID del usuario.');
      return;
    }

    const calificacionesParaEnviar = this.unidadesCurriculares
      .filter(uc => !uc.noCursado) // Excluir unidades curriculares marcadas como 'No Cursado'
      .map(uc => {
        // Determinar la condición de la UC
        const condicion = uc.calificacion == null || uc.calificacion === '' ? 'SIN_CALIFICAR' :
          uc.calificacion >= uc.nota_aprobatoria_final ? 'APROBADO' : 'REPROBADO';

        return {
          codigoUC: uc.codigo_uc,
          nombreUC: uc.nombre_uc,
          creditos: uc.creditos,
          calificacion: uc.calificacion,
          periodo: uc.periodoSeleccionado,
          condicion: condicion,
          usrid: usrid, // Añade el usrid a cada objeto de calificación
          carnet: carnetEstudiante
        };
      });




    this.controlestudiosService.enviarCalificaciones(calificacionesParaEnviar).subscribe({
      next: (response) => {
        if (response.success) {

          this.SpinnerService.hide();
          this.notifyService.showSuccess('Calificaciones procesadas');

        } else if (response.error) {

          this.SpinnerService.hide();
          this.notifyService.showError(`Error al procesar las calificaciones: ${response.error}`);

        }
      },
      error: (error) => {
        this.notifyService.showError('Error al enviar los datos al servidor.');
        this.SpinnerService.hide();

      }
    });
  }

  // Función para determinar la condición
  determinarCondicion(uc: any): string {
    if (uc.calificacion == null || uc.calificacion === '') {
      return 'SIN_CALIFICAR';
    } else if (uc.calificacion >= uc.nota_minima) {
      return 'APROBADO';
    } else {
      return 'REPROBADO';
    }
  }

  validarCalificacionesCompletas(): boolean {
    // Verifica si hay al menos una unidad curricular no marcada como 'No Cursado'
    const hayUCNoCursada = this.unidadesCurriculares.some(uc => !uc.noCursado);

    // Si todas las UC están marcadas como 'No Cursado', deshabilita el botón
    if (!hayUCNoCursada) {
      return false;
    }

    // Si al menos una UC no está marcada como 'No Cursado', verifica que todas las UC no marcadas como 'No Cursado' tengan calificación y período
    return this.unidadesCurriculares.every(uc =>
      uc.noCursado ||
      (uc.calificacion != null &&
        uc.periodoSeleccionado != null &&
        uc.calificacion >= 1 &&
        uc.calificacion <= 20)
    );
  }

  onNoCursadoChange(uc: any): void {
    if (uc.noCursado) {
      // Inhabilita el select de período y limpia los valores de calificación y período
      uc.periodoSeleccionado = null;
      uc.calificacion = null;
    }
  }

  trackByCodigoUC(index: number, uc: UnidadCurricular): string {
    return uc.codigo_uc;
  }

  trackByPeriodo(index: number, periodo: any): string {
    return periodo.periodo;
  }



  obtenerYDescargarPDF() {
    const carnetEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).carnet : null;
    this.carnet = carnetEstudiante;
    //console.log(this.carnet);

    this.controlestudiosService.buscarRecordAcademico(this.carnet).subscribe(data => {
      //const documentDefinition = this.getDocumentDefinition(data);
      //pdfMake.createPdf(documentDefinition as any).download(`RecordAcademico_${this.carnet}.pdf`);
    });
  }

  // getDocumentDefinition(data: any) {

  //   // Extraer los datos del estudiante antes de definir la función header
  //   const estudianteInfo = data.estudiante
  //     ? `${data.estudiante.cedula} - ${data.estudiante.nombreCompleto} (${data.estudiante.pnf})`
  //     : '';

  //   const resumenGeneral = data.resumen.general;

  //   const body = [];
  //   const encabezadoTabla = [
  //     { text: 'Periodo', style: 'tablaEncabezadoEstilo' },
  //     { text: 'Tray.', style: 'tablaEncabezadoEstilo' },
  //     { text: 'Código', style: 'tablaEncabezadoEstilo' },
  //     { text: 'Unidad Curricular', style: 'tablaEncabezadoEstilo' },
  //     { text: 'Cr', style: 'tablaEncabezadoEstilo', alignment: 'center' },
  //     { text: 'Nota', style: 'tablaEncabezadoEstilo', alignment: 'center' },
  //     { text: 'Estatus', style: 'tablaEncabezadoEstilo' }
  //   ];

  //   body.push(encabezadoTabla);

  //   // Iterar sobre cada periodo
  //   Object.values(data.periodos).forEach((periodo: any) => {
  //     // Para cada materia en el periodo
  //     periodo.materias.forEach((materiaId: string) => {
  //       const materia = data.materias[materiaId];
  //       const calificacionesMateria = data.calificaciones.filter((calificacion: any) => calificacion.materiaId === materiaId && calificacion.periodoAcademico === periodo.nombre);

  //       calificacionesMateria.forEach((calificacion: any) => {
  //         // Añadir una fila para cada materia en el periodo
  //         const fila = [
  //           { text: periodo.nombre, style: 'tablaEstilo' },
  //           { text: calificacion.trayecto, style: 'tablaEstilo', alignment: 'center' },
  //           { text: materia.id, style: 'tablaEstilo' },
  //           { text: materia.nombre, style: 'tablaEstilo' },
  //           { text: calificacion.creditos.toString(), style: 'tablaEstilo', alignment: 'center' }, // Asegúrate de que creditos es un número
  //           { text: calificacion.calificacion.toString(), style: 'tablaEstilo', alignment: 'center' },
  //           { text: calificacion.estatus, style: 'tablaEstilo' }
  //         ];
  //         body.push(fila);
  //       });
  //     });
  //     body.push([{ text: '', colSpan: 6, style: 'lineaDivisoria' }, {}, {}, {}, {}, {}, {}]);
  //   });

  //   return {
  //     content: [
  //       {
  //         columns: [
  //           {
  //             // Columna para la imagen
  //             image: imagenBase64,
  //             width: 120 // Ajusta el ancho según sea necesario
  //           },
  //           {
  //             // Columna para el texto
  //             width: 235, // Ocupa el espacio restante
  //             stack: [
  //               {
  //                 text: 'UNIVERSIDAD NACIONAL EXPERIMENTAL DEL TRANSPORTE',
  //                 style: 'header',
  //                 alignment: 'center' // Centra el texto en su columna
  //               },
  //               {
  //                 text: 'DIRECCIÓN DE CONTROL DE ESTUDIOS',
  //                 style: 'subheader',
  //                 alignment: 'center' // Centra el texto en su columna
  //               }
  //             ]
  //           },
  //           {
  //             // Columna para la imagen
  //             stack: [
  //               {
  //                 image: imagenBase64_2,
  //                 width: 80,
  //                 height: 50
  //               }
  //             ],
  //             alignment: 'right' // Alinea el contenido del stack a la derecha
  //           },
  //         ],
  //         columnGap: 10
  //       },
  //       {
  //         columns: [
  //           {
  //             width: 200, // Ancho definido para la columna del resumen
  //             table: {
  //               widths: ['*', '*', '*'], // Distribución uniforme del ancho entre las columnas
  //               body: [
  //                 ['Créditos Aprobados', 'Promedio General', 'Eficiencia'],
  //                 [
  //                   resumenGeneral.cantidadUCaprobadas.toString(), // Créditos Aprobados
  //                   resumenGeneral.promedioGeneral.toString(),     // Promedio General
  //                   resumenGeneral.indiceRendimiento.toString()    // Eficiencia
  //                 ]
  //               ]
  //             },
  //             style: 'resumenEstilo'
  //           },
  //           // Espacio entre columnas
  //           {
  //             width: 150,
  //             text: ''
  //           },
  //           // Columna para los datos del estudiante
  //           {
  //             width: 'auto',
  //             table: {
  //               body: [
  //                 [{ text: data.estudiante.pnf, style: 'primeraFilaEstudiante' }],
  //                 [{ text: data.estudiante.apellidos, style: 'datosEstudianteEstilo', margin: [0, 5, 0, 0] }],
  //                 [{ text: data.estudiante.nombres, style: 'datosEstudianteEstilo' }],
  //                 [{ text: data.estudiante.cedula, style: 'datosEstudianteEstilo' }],
  //                 [
  //                   {
  //                     text: [
  //                       { text: 'Carnet: ', style: 'datosEstudianteEstilo' }, // Agrega la palabra "Carnet"
  //                       { text: data.estudiante.carnet, style: 'datosEstudianteEstilo' } // Valor del carnet
  //                     ]
  //                   }
  //                 ]
  //               ]
  //             },
  //             layout: {
  //               hLineWidth: function (i: number) { return 0; },
  //               vLineWidth: function (i: number) { return 0; },
  //               paddingTop: function (i: number) { return 0.5; }, // Reducir el espacio superior
  //               paddingBottom: function (i: number) { return 0.5; } // Reducir el espacio inferior
  //             },
  //             style: 'datosEstudianteEstilo'
  //           },
  //           {
  //             // Columna para la foto del estudiante
  //             image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAADwCAMAAACe2r56AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBGNERCQTc5Q0MwMjExRTM5OEQwQTAyRDI4QkZFMjVBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBGNERCQTdBQ0MwMjExRTM5OEQwQTAyRDI4QkZFMjVBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEY0REJBNzdDQzAyMTFFMzk4RDBBMDJEMjhCRkUyNUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEY0REJBNzhDQzAyMTFFMzk4RDBBMDJEMjhCRkUyNUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7W2H3FAAABgFBMVEXMmUv/zIv/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', // reemplaza esto con la variable de tu imagen en base64
  //             fit: [40, 66] // Ajusta el 'width' y 'height' para coincidir con la altura de las filas
  //           }
  //         ]
  //       },
  //       // Título "HISTORIAL ACADÉMICO"
  //       {
  //         text: 'HISTORIAL ACADÉMICO',
  //         style: 'tituloHistorial'
  //       },

  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['auto', 'auto', 'auto', 'auto', 30, 30, 60], // Anchuras específicas para las columnas
  //           body: body
  //         },
  //         layout: 'lightHorizontalLines', // Puedes elegir un layout predefinido o personalizarlo
  //         width: '520', // Ancho fijo para la tabla completa
  //       },
  //       // ... El resto de tu contenido
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 12,
  //         bold: true,
  //         alignment: 'center',
  //         margin: [0, 0, 0, 5]  // Reduce el margen inferior para acercar el subtítulo
  //       },
  //       subheader: {
  //         fontSize: 9,
  //         bold: false,
  //         alignment: 'center',
  //         margin: [0, 5, 0, 15]  // Reduce el margen superior para acercar al título
  //       },
  //       studentInfo: {
  //         fontSize: 9,
  //         alignment: 'center',
  //         bold: true
  //       },
  //       periodoHeader: {
  //         fontSize: 8,
  //         bold: true,
  //         margin: [0, 10, 0, 10]
  //       },
  //       tituloHistorial: {
  //         fontSize: 9,
  //         bold: true,
  //         alignment: 'center',
  //         margin: [0, 20, 0, 10] // Ajusta los márgenes según sea necesario
  //       },
  //       tablaEstilo: {
  //         fontSize: 8 // Cambia el tamaño de la letra según necesites
  //       },
  //       lineaDivisoria: {
  //         margin: [0, 5, 0, 5], // Ajusta el margen según sea necesario
  //         border: [false, true, false, false], // Solo borde inferior
  //         borderColor: ['#000000'] // Color del borde
  //       },
  //       tablaEncabezadoEstilo: {
  //         fontSize: 10, // Cambia el tamaño de la letra según necesites
  //         bold: true // Opcional, si quieres que el encabezado sea en negrita
  //       },
  //       resumenEstilo: {
  //         fontSize: 9, // Cambia el tamaño de la letra según necesites
  //         alignment: 'center',
  //       },
  //       datosEstudianteEstilo: {
  //         fontSize: 8, // Cambia el tamaño de la letra según necesites
  //         alignment: 'right'
  //       },
  //       primeraFilaEstudiante: {
  //         fontSize: 8, // Cambia el tamaño de la letra según necesites
  //         alignment: 'right',
  //         bold: true
  //       },
  //     },
  //     watermark: {
  //       text: 'NO OFICIAL',
  //       color: 'grey', // Puedes cambiar el color si lo deseas
  //       opacity: 0.3, // Ajusta la opacidad según necesites
  //       bold: true, // Hace la marca de agua en negrita
  //       italics: false, // Puedes cambiar a true si prefieres cursiva
  //       fontSize: 100, // Ajusta el tamaño de la fuente
  //       angle: -45 // Ángulo de la marca de agua
  //     },
  //     footer: (currentPage: number, pageCount: number) => {
  //       return {
  //         columns: [
  //           { text: estudianteInfo, fontSize: 7, alignment: 'left', width: 'auto' }, // Información del estudiante alineada a la izquierda
  //           {
  //             text: `Pág. ${currentPage} de ${pageCount}`,
  //             fontSize: 9,
  //             alignment: 'right',
  //             bold: true
  //           }
  //         ],
  //         margin: [40, 10]
  //       };
  //     },
  //     header: (currentPage: number) => {
  //       let headerContent = [];

  //       // Contenido para la fecha de emisión
  //       headerContent.push({
  //         columns: [
  //           '',
  //           { text: `Emitido el: ${new Date().toLocaleString()}`, fontSize: 7, alignment: 'right' }
  //         ],
  //         margin: [40, 10]
  //       });

  //       return headerContent;
  //     },
  //     // ... (Configuraciones adicionales si son necesarias)
  //   };

  // }


  // obtenerResumen() {
  //   const carnetEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).carnet : null;
  //   this.carnet = carnetEstudiante;

  //   const planEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).codigo_plan : null;
  //   this.plan = planEstudiante;
  //   //console.log(this.carnet);

  //   const user = 25214717;

  //   this.controlestudiosService.buscarResumenAcademico(this.carnet,this.plan).subscribe(data => {
  //     this.inscritos = data[0]['inscritos']; // Establece los estudiantes inscritos como dataSource
  //     this.resumen = data[0]['resumen'];
  //     this.logounetrans = data[0]['imagenIzquierda'];  // Extraer la imagen izquierda
  //     this.logosecretaria = data[0]['imagenDerecha'];

  //     this.generarPDFResumen(this.detallesUC, this.inscritos, this.resumen, this.logounetrans, this.logosecretaria)

  //     const documentDefinition = this.getDocumentDefinitionResumen(data);
  //     pdfMake.createPdf(documentDefinition as any).download(`ResumenAcademico_${this.carnet}.pdf`);

  //   });
  // }


  obtenerResumen() {
    const carnetEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).carnet : null;
    this.carnet = carnetEstudiante;

    const planEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).codigo_plan : null;
    this.plan = planEstudiante;

    this.SpinnerService.show();
    // this.controlestudiosService.buscarResumenAcademico(this.carnet,this.plan).subscribe(data => {
    //   this.SpinnerService.hide();
    //   if (data && data.length > 0 && data['materias'] && data['materias'].length > 0) {
    //     // Accede al objeto de detalles de la UC usando la clave "0"
    //     this.detallesUC = data[0]['0']; // Ahora detallesUC contiene los detalles de la UC

    //     this.inscritos = data[0]['materias']; // Establece los estudiantes inscritos como dataSource
    //     //this.resumen = data[0]['resumen'];
    //     this.logounetrans = data[0]['imagenIzquierda'];  // Extraer la imagen izquierda
    //     this.logosecretaria = data[0]['imagenDerecha'];  

    //     this.generarPDFResumen(this.detallesUC, this.inscritos, //this.resumen, 
    //     this.logounetrans, this.logosecretaria)

    //   } else {
    //     console.log('Se fue por el else')
    //   }
    // }, error => {
    //   console.error(error);
    //   this.SpinnerService.hide();
    // });

    this.controlestudiosService.buscarResumenAcademico(this.carnet, this.plan).subscribe({
      next: (data) => {
        this.SpinnerService.hide();

        this.detallesUC = data.estudiante; // Asumiendo que 'estudiante' contiene detalles relevantes
        this.estudiante = data.estudiante; // Establece los estudiantes inscritos como dataSource
        this.logounetrans = data.imagenes.izquierda;  // Extraer la imagen izquierda
        this.logosecretaria = data.imagenes.derecha;  // Extraer la imagen derecha

        this.generarPDFResumen(data, this.estudiante, this.logounetrans, this.logosecretaria);

      },
      error: (error) => {
        this.SpinnerService.hide();
        console.error('Error al cargar datos:', error);
      }
    });

  }

  generarPDFResumen(data: any, datosEstudiante: any,
    //datosEstudiante: { nombre_programa: any, prof_asignado: any, cedula: any, nombre_jefe: any, cedula_jefe: any, acta: any; periodo: any; tipo_programa: any, cod_ucurr: any,uni_curr: any  }, 
    //datosInscripcion: any[], 
    //datosResumen: {totalInscritos: any, totalRetirados: any, totalAprobados: any, totalReprobados: any, tasaAprobacion: any},
    imagenIzquierda: string,
    imagenDerecha: string
  ) {

    const body = [];
    const encabezadoTabla = [
      { text: 'Tray', style: 'tablaEncabezadoEstilo', alignment: 'center' },
      { text: 'Código', style: 'tablaEncabezadoEstilo' },
      { text: 'Unidad Curricular', style: 'tablaEncabezadoEstilo' },
      { text: 'Cr', style: 'tablaEncabezadoEstilo', alignment: 'center' },
      { text: 'Nota', style: 'tablaEncabezadoEstilo', alignment: 'center' },
      { text: 'Periodo', style: 'tablaEncabezadoEstilo', alignment: 'center' },
      { text: 'Estatus', style: 'tablaEncabezadoEstilo' }
    ];

    body.push(encabezadoTabla);

    Object.entries(data.trayectos).forEach(([nombreTrayecto, trayecto]: [string, any]) => {
      trayecto.materias.forEach((codigoMateria: string) => {
        const materia = data.materias[codigoMateria];

        // Determinar si el fondo de la fila debe colorearse
        const esPorCursar = materia.estatus === 'POR CURSAR';
    const esReprobado = materia.estatus === 'REPROBADO';

    const estiloFondo = esPorCursar ? { fillColor: '#d3d3d3' } :
                       esReprobado ? { fillColor: '#a6a6a6', bold: true } : {};

        // Añadir una fila para cada materia en el trayecto
        const fila = [
          { text: nombreTrayecto, style: 'tablaEstilo', ...estiloFondo, alignment: 'center' },
          { text: codigoMateria, style: 'tablaEstilo', ...estiloFondo },
          { text: materia.nombre, style: 'tablaEstilo', ...estiloFondo },
          { text: materia.creditos.toString(), style: 'tablaEstilo', alignment: 'center', ...estiloFondo },
          { text: materia.calificacion, style: 'tablaEstilo', alignment: 'center', ...estiloFondo },
          { text: materia.periodo_academico, style: 'tablaEstilo', ...estiloFondo, alignment: 'center' },
          { text: materia.estatus, style: 'tablaEstilo', ...estiloFondo }
        ];
        body.push(fila);
      });

      body.push([{ text: '', colSpan: 6, style: 'lineaDivisoria' }, {}, {}, {}, {}, {}, {}]);
    });

    const docDefinition = {
      pageSize: 'Letter',
      pageMargins: [40, 160, 40, 65],
     
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
            { text: '', margin: [0, 10, 0, 0] }, // Espacio opcional
            {
              columns: [
                {
                  width: 200, // Ancho definido para la columna del resumen
                  table: {
                    widths: ['*', '*', '*'], // Distribución uniforme del ancho entre las columnas
                    body: [
                      ['Créd. Aprobados', 'Promedio General', 'Eficiencia'],
                      [
                        null,//resumenGeneral.cantidadUCaprobadas.toString(), // Créditos Aprobados
                        null,///resumenGeneral.promedioGeneral.toString(),     // Promedio General
                        null,///resumenGeneral.indiceRendimiento.toString()    // Eficiencia
                      ]
                    ]
                  },
                  style: 'resumenEstilo'
                },
                // Espacio entre columnas
                {
                  width: '*',
                  text: ''
                },
                // Columna para los datos del estudiante
                {
                  width: 'auto',
                  table: {
                    body: [
                      [{ text: datosEstudiante.pnf, style: 'primeraFilaEstudiante' }],
                      [{ text: datosEstudiante.apellidos, style: 'datosEstudianteEstilo' }],
                      [{ text: datosEstudiante.nombres, style: 'datosEstudianteEstilo' }],
                      [{ text: datosEstudiante.cedula, style: 'datosEstudianteEstilo' }],
                      [
                        {
                          text: [
                            { text: 'Carnet: ', style: 'datosEstudianteEstilo' }, // Agrega la palabra "Carnet"
                            { text: datosEstudiante.carnet, style: 'datosEstudianteEstilo' } // Valor del carnet
                          ]
                        }
                      ]
                    ]
                  },
                  layout: {
                    hLineWidth: function (i: number) { return 0; },
                    vLineWidth: function (i: number) { return 0; },
                    paddingTop: function (i: number) { return 0.5; }, // Reducir el espacio superior
                    paddingBottom: function (i: number) { return 0.5; } // Reducir el espacio inferior
                  },
                  style: 'datosEstudianteEstilo'
                },
                {
                  // Columna para la foto del estudiante
                  width: 'auto',
                  // Columna para la foto del estudiante
              image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAADwCAMAAACe2r56AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBGNERCQTc5Q0MwMjExRTM5OEQwQTAyRDI4QkZFMjVBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBGNERCQTdBQ0MwMjExRTM5OEQwQTAyRDI4QkZFMjVBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEY0REJBNzdDQzAyMTFFMzk4RDBBMDJEMjhCRkUyNUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEY0REJBNzhDQzAyMTFFMzk4RDBBMDJEMjhCRkUyNUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7W2H3FAAABgFBMVEXMmUv/zIv/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', // reemplaza esto con la variable de tu imagen en base64
              fit: [40, 55] // Ajusta el 'width' y 'height' para coincidir con la altura de las filas
                }
              ]
            },
            { text: '', margin: [0, 5, 0, 0] },
            {
              text: 'RESUMEN ACADÉMICO DE PROGRESO EN UNIDADES CURRICULARES',
              style: 'headerTitle',
              alignment: 'center'
            },
          ]
        };
      },

      footer: (currentPage: number, pageCount: number) => {
        return {
          margin: [40, 10, 40, 0], // Margen: [izquierda, arriba, derecha, abajo]
          stack: [
            {
              text: 'ESTE DOCUMENTO ES DE CARÁCTER INFORMATIVO, NO TIENE VALIDEZ LEGAL.',
              style: 'smallFooter',
              margin: [0, 0, 0, 5]  // Añade un pequeño margen debajo para separar del resto del footer
            },
            {
              columns: [
                { 
                  text: `${datosEstudiante.cedula}-${datosEstudiante.nombreCompleto} (${datosEstudiante.pnf})`,
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
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 20, 40, 60], // Anchuras específicas para las columnas
            body: body
          },
          layout: 'lightHorizontalLines', // Puedes elegir un layout predefinido o personalizarlo
          width: '*', // Ancho fijo para la tabla completa
        },

      ],
      styles: {
        header: {
          fontSize: 13,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 2], // Ajustar según sea necesario
        },
        headerTitle: {
          fontSize: 9,
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
        }, signaturePlaceholder: {
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
          bold: true,
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
        datosEstudianteEstilo: {
          fontSize: 8, // Cambia el tamaño de la letra según necesites
          alignment: 'right'
        },
        primeraFilaEstudiante: {
          fontSize: 8, // Cambia el tamaño de la letra según necesites
          alignment: 'right',
          bold: true
        },
        resumenEstilo: {
          fontSize: 9, // Cambia el tamaño de la letra según necesites
          alignment: 'center',
        },
        tablaEstilo: {
          fontSize: 8, // Cambia el tamaño de la letra según necesites
        },
        lineaDivisoria: {
          margin: [0, 5, 0, 5], // Ajusta el margen según sea necesario
          border: [false, true, false, false], // Solo borde inferior
          borderColor: ['#000000'] // Color del borde
        },
        tablaEncabezadoEstilo: {
          fontSize: 9, // Cambia el tamaño de la letra según necesites
          bold: true // Opcional, si quieres que el encabezado sea en negrita
        },

      },
      watermark: {
        text: 'USO INTERNO',
        color: 'grey', // Puedes cambiar el color si lo deseas
        opacity: 0.3, // Ajusta la opacidad según necesites
        bold: true, // Hace la marca de agua en negrita
        italics: false, // Puedes cambiar a true si prefieres cursiva
        fontSize: 100, // Ajusta el tamaño de la fuente
        angle: -45 // Ángulo de la marca de agua
      },
    };

    pdfMake.createPdf(docDefinition as any).download(`ResumenAcademico_${datosEstudiante.carnet}.pdf`);

  }

  obtenerNotasCertificadasSecre() {
    const carnetEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).carnet : null;
    this.carnet = carnetEstudiante;

    const planEstudiante = this.dataSource.data.length > 0 ? (this.dataSource.data[0] as any).codigo_plan : null;
    this.plan = planEstudiante;

    this.SpinnerService.show();
    this.controlestudiosService.buscarRecordAcademico(this.carnet).subscribe({
      next: (data) => {
        this.SpinnerService.hide();

        this.detallesUC = data.estudiante; // Asumiendo que 'estudiante' contiene detalles relevantes
        this.estudiante = data.estudiante; // Establece los estudiantes inscritos como dataSource
        this.logounetrans = data.imagenes.izquierda;  // Extraer la imagen izquierda
        this.logosecretaria = data.imagenes.derecha;  // Extraer la imagen derecha
        this.datosRector = data.autoridades.rector;
        this.datosSecretaria = data.autoridades.secretaria;
        this.escala = data.escalas;


        this.generaNotasCertifificadasSecre(data, this.estudiante, this.logounetrans, this.logosecretaria, this.datosRector, this.datosSecretaria,this.escala);

      },
      error: (error) => {
        this.SpinnerService.hide();
        console.error('Error al cargar datos:', error);
      }
    });

  }
  
  generaNotasCertifificadasSecre(data: any, datosEstudiante: any,
    imagenIzquierda: string,
    imagenDerecha: string,
    datosRector: any,
    datosSecretaria: any,
    escala: any
  ) {

     const body = [];
    const encabezadoTabla = [
      { text: 'Periodo', style: 'tablaEncabezadoEstilo' },
      { text: 'Tray.', style: 'tablaEncabezadoEstilo' },
      { text: 'Código', style: 'tablaEncabezadoEstilo' },
      { text: 'Unidad Curricular', style: 'tablaEncabezadoEstilo' },
      { text: 'Cr', style: 'tablaEncabezadoEstilo', alignment: 'center' },
      { text: 'Nota', style: 'tablaEncabezadoEstilo', alignment: 'center' },
      { text: 'Estatus', style: 'tablaEncabezadoEstilo' }
    ];

    body.push(encabezadoTabla);

    // Iterar sobre cada periodo
    Object.values(data.periodos).forEach((periodo: any) => {
      // Para cada materia en el periodo
      periodo.materias.forEach((materiaId: string) => {
        const materia = data.materias[materiaId];
        const calificacionesMateria = data.calificaciones.filter((calificacion: any) => calificacion.materiaId === materiaId && calificacion.periodoAcademico === periodo.nombre);

        calificacionesMateria.forEach((calificacion: any) => {
          // Añadir una fila para cada materia en el periodo
          const fila = [
            { text: periodo.nombre, style: 'tablaEstilo' },
            { text: calificacion.trayecto, style: 'tablaEstilo', alignment: 'center' },
            { text: materia.id, style: 'tablaEstilo' },
            { text: materia.nombre, style: 'tablaEstilo' },
            { text: calificacion.creditos.toString(), style: 'tablaEstilo', alignment: 'center' }, // Asegúrate de que creditos es un número
            { text: calificacion.calificacion.toString(), style: 'tablaEstilo', alignment: 'center' },
            { text: calificacion.estatus, style: 'tablaEstilo' }
          ];
          body.push(fila);
        });
      });
      body.push([{ text: '', colSpan: 6, style: 'lineaDivisoria' }, {}, {}, {}, {}, {}, {}]);
    });

    const docDefinition = {
      pageSize: 'Letter',
      pageMargins: [70, 40, 60, 120],
      content: [
        // Página de Certificación
        {
          stack: [
            {
              columns: [
                {  // Imagen izquierda
                  image: imagenIzquierda,
                  fit: [110, 100],
                  width: 75,
                  alignment: 'left' },
                { text: 'República Bolivariana de Venezuela\nUniversidad Nacional Experimental del Transporte\nDirección de Control de Estudios', style: 'headerCenter', alignment: 'center' },
                { // Imagen derecha
                  image: imagenDerecha,
                  width: 75,
                  alignment: 'right' }
              ]
            },
            { text: 'CERTIFICACIÓN', style: 'headerTitle', alignment: 'center', margin: [0, 20, 0, 10] },
            { text: `Quien suscribe, ${datosSecretaria.nombre}, titular de la cédula de identidad N° ${datosSecretaria.cedula}, ${datosSecretaria.cargo} de la Universidad Nacional Experimental del Transporte, certifico que ${datosEstudiante.pronombre_personal} ciudadan${datosEstudiante.genero_persona}:\n\n`, style: 'textoJustificado' },
            { text: datosEstudiante.nombreCompleto, style: 'nombreEstudiante', alignment: 'center' },
            { text: `\ntitular de la cédula de identidad N° ${datosEstudiante.cedula}, estuvo inscrit${datosEstudiante.genero_persona} en el Programa Académico:\n\n`, style: 'textoJustificado' },
            { text: datosEstudiante.pnf, style: 'programaEstudiante', alignment: 'center' },
            { text: `\ny que, de acuerdo a la información que reposa en nuestro registro académico obtuvo las notas que aparecen en el boletín de calificaciones anexo.\n\n`, style: 'textoJustificado' },
            { text: `Se hace constar que el sistema de calificaciones vigente para el período en que ${datosEstudiante.pronombre_personal} mencionad${datosEstudiante.genero_persona} ciudadan${datosEstudiante.genero_persona} cursó sus estudios era de ${escala.nota_minima_texto} a ${escala.nota_maxima_texto} puntos, siendo la nota mínima aprobatoria ${escala.nota_aprobatoria_texto} puntos para las unidades curriculares generales y ${escala.nota_apro_proyecto_texto} puntos para proyecto.\n\n`, style: 'textoJustificado' },
            { text: `La presente certificación se expide a petición de la parte interesada en los Salias a los ${new Date().getDate()} días del mes de ${new Date().toLocaleString('es-ES', { month: 'long' })} de ${new Date().getFullYear()}.\n\n\n`, style: 'textoJustificado' },
            {
              columns: [
                {
                  width: '60%',
                  text: ''
                },
                {
                  width: '40%',
                  stack: [
                    {
                      columns: [
                        {
                          width: '*',
                          text: ''
                        },
                        {
                          width: 'auto',
                          stack: [
                            { text: datosSecretaria.nombre, style: 'signatureName', alignment: 'center' },
                            { text: `C.I. ${datosSecretaria.cedula}`, style: 'signatureCedula', alignment: 'center' },
                            { text: `${datosSecretaria.cargo}`, style: 'signatureTitle', alignment: 'center' }
                          ],
                          alignment: 'center'
                        },
                        {
                          width: '*',
                          text: ''
                        }
                      ]
                    }
                  ],
                  margin: [0, 30, 0, 0]
                }
              ]
            },
            {
              text: `\n\n\n\nCertifico que la firma anterior corresponde efectivamente ${datosSecretaria.sust_genero} ciudadan${datosSecretaria.genero_persona}, ${datosSecretaria.nombre}, quién es para la fecha ${datosSecretaria.cargo} de la Universidad.\n\n`,
              style: 'textoJustificado'
            },
            {
              columns: [
                {
                  width: '60%',
                  text: ''
                },
                {
                  width: '40%',
                  stack: [
                    {
                      columns: [
                        {
                          width: '*',
                          text: ''
                        },
                        {
                          width: 'auto',
                          stack: [
                            { text: datosRector.nombre, style: 'signatureName', alignment: 'center' },
                            { text: `C.I. ${datosRector.cedula}`, style: 'signatureCedula', alignment: 'center' },
                            { text: `${datosRector.cargo}`, style: 'signatureTitle', alignment: 'center' }
                          ],
                          alignment: 'center'
                        },
                        {
                          width: '*',
                          text: ''
                        }
                      ]
                    }
                  ],
                  margin: [0, 30, 0, 0]
                }
              ]
            }
          ],
          pageBreak: 'after'
        },
        // Página de Boletín de Calificaciones
        {
          stack: [
            {
              columns: [
                { // Imagen izquierda
                  image: imagenIzquierda,
                  fit: [110, 100],
                  width: 75,
                  alignment: 'left' },
                { text: 'República Bolivariana de Venezuela\nUniversidad Nacional Experimental del Transporte\nDirección de Control de Estudios', style: 'headerCenter', alignment: 'center' },
                { // Imagen derecha
                  image: imagenDerecha,
                  width: 75,
                  alignment: 'right' }
              ]
            },
            { text: 'BOLETÍN DE CALIFICACIONES', style: 'headerTitle', alignment: 'center', margin: [0, 20, 0, 10] },
            {
              table: {
                body: [
                  [
                    { text: 'Apellidos y Nombres:', style: 'label' },
                    { text: datosEstudiante.nombreCompleto, style: 'value' },
                    { text: 'Cédula:', style: 'label' },
                    { text: datosEstudiante.cedula, style: 'value' }
                  ],
                  [
                    { text: 'Programa:', style: 'label' },
                    { text: datosEstudiante.pnf, style: 'value' },
                    { text: 'Carnet:', style: 'label' },
                    { text: datosEstudiante.carnet, style: 'value' }
                  ]
                ],
                widths: [79, 'auto', 28, '*'],
                margin: [0, 10, 0, 20]
              },
              layout: 'noBorders'
            },
            {
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 48, 'auto', 20, 40, 60],
                body: body
              },
              layout: 'lightHorizontalLines',
              width: '*'
            }
          ]
        }
      ],
      styles: {
        headerCenter: {
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        headerTitle: {
          fontSize: 12,
          bold: true,
          italics: true,
        },
        tablaEncabezadoEstilo: {
          fontSize: 9,
          bold: true
        },
        tablaEstilo: {
          fontSize: 8
        },
        lineaDivisoria: {
          margin: [0, 5, 0, 5],
          border: [false, true, false, false],
          borderColor: ['#000000']
        },
        textoJustificado: {
          alignment: 'justify',
          fontSize: 10
        },
        nota: {
          fontSize: 7,
          italics: true,
          alignment: 'justify',
          margin: [10, 0, 10, 0] // Ajusta el margen según sea necesario
        },
        signaturePlaceholder: {
          fontSize: 12,
          bold: true,
          alignment: 'right'
        },
        signatureName: {
          fontSize: 9,
          bold: true,
          alignment: 'right'
        },
        signatureCedula: {
          fontSize: 9,
          alignment: 'right'
        },
        signatureTitle: {
          fontSize: 9,
          italics: true,
          alignment: 'right'
        },
        nombreEstudiante: {
          fontSize: 10,
          bold: true,
          alignment: 'center'
        },
        programaEstudiante: {
          fontSize: 10,
          bold: true,
          alignment: 'center'
        },
        smallFooter: {
          fontSize: 8,
          italics: true,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        },
        label: {
          fontSize: 8,
          bold: true,
      
        },
        value: {
          fontSize: 8
        },
      },
      footer: (currentPage: number, pageCount: number) => {
        return {
          margin: [60, 10, 50, 20],
          stack: [
            {
              columns: [
                { 
                  width: '38%', 
                  text: 'Nota: Conforme al Decreto Nº 3.757 del 05-02-2019, publicado en la Gaceta Oficial de la República Bolivariana de Venezuela N° 41.579 de misma fecha, el Instituto Universitario de Tecnología Dr. Federico Rivero Palacio (IUT-RC) pasó a integrar la Universidad Nacional Experimental del Transporte (UNETRANS).',
                  style: 'nota'
                }
              ],
              margin: [0, 10, 0, 10]
            },
            {
              columns: [
                {
                  text: `${datosEstudiante.cedula}-${datosEstudiante.nombreCompleto} (${datosEstudiante.pnf})`,
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
      }
    };

    pdfMake.createPdf(docDefinition as any).download(`ResumenAcademico_${datosEstudiante.carnet}.pdf`);

  }
  // getDocumentDefinitionResumen(data: any) {

  //   // Extraer los datos del estudiante antes de definir la función header
  //   const estudianteInfo = data.estudiante
  //     ? `${data.estudiante.cedula} - ${data.estudiante.nombreCompleto} (${data.estudiante.pnf})`
  //     : '';

  //   // resumenGeneral = data.resumen.general;

  //   const body = [];
  //   const encabezadoTabla = [
  //     { text: 'Trayecto', style: 'tablaEncabezadoEstilo' },
  //     { text: 'Código', style: 'tablaEncabezadoEstilo' },
  //     { text: 'Unidad Curricular', style: 'tablaEncabezadoEstilo' },
  //     { text: 'Cr', style: 'tablaEncabezadoEstilo', alignment: 'center' },
  //     { text: 'Nota', style: 'tablaEncabezadoEstilo', alignment: 'center' },
  //     { text: 'Periodo', style: 'tablaEncabezadoEstilo' },
  //     { text: 'Estatus', style: 'tablaEncabezadoEstilo' }
  //   ];

  //   body.push(encabezadoTabla);

  //   Object.entries(data.trayectos).forEach(([nombreTrayecto, trayecto]: [string, any]) => {
  //     trayecto.materias.forEach((codigoMateria: string) => {
  //       const materia = data.materias[codigoMateria];

  //      // Determinar si el fondo de la fila debe ser rojo
  //      const esPorCursar = materia.estatus === 'POR CURSAR';
  //      const estiloFondo = esPorCursar ? { fillColor: '#d3d3d3', bold: true } : {}; // Estilo de fondo rojo si es "Por cursar"

  //      // Añadir una fila para cada materia en el trayecto
  //      const fila = [
  //       { text: nombreTrayecto, style: 'tablaEstilo', ...estiloFondo,alignment: 'center'  },
  //       { text: codigoMateria, style: 'tablaEstilo', ...estiloFondo },
  //       { text: materia.nombre, style: 'tablaEstilo', ...estiloFondo },
  //       { text: materia.creditos.toString(), style: 'tablaEstilo', alignment: 'center', ...estiloFondo },
  //       { text: materia.calificacion, style: 'tablaEstilo', alignment: 'center', ...estiloFondo },
  //       { text: materia.periodo_academico, style: 'tablaEstilo', ...estiloFondo, alignment: 'center' },
  //       { text: materia.estatus, style: 'tablaEstilo', ...estiloFondo }
  //     ];
  //     body.push(fila);
  //     });

  //     body.push([{ text: '', colSpan: 6, style: 'lineaDivisoria' }, {}, {}, {}, {}, {}, {}]);
  //   });


  //   return {
  //     content: [
  //       {
  //         columns: [
  //           {
  //             // Columna para la imagen
  //             image: imagenBase64,
  //             width: 120 // Ajusta el ancho según sea necesario
  //           },
  //           {
  //             // Columna para el texto
  //             width: 235, // Ocupa el espacio restante
  //             stack: [
  //               {
  //                 text: 'UNIVERSIDAD NACIONAL EXPERIMENTAL DEL TRANSPORTE',
  //                 style: 'header',
  //                 alignment: 'center' // Centra el texto en su columna
  //               },
  //               {
  //                 text: 'DIRECCIÓN DE CONTROL DE ESTUDIOS',
  //                 style: 'subheader',
  //                 alignment: 'center' // Centra el texto en su columna
  //               }
  //             ]
  //           },
  //           {
  //             // Columna para la imagen
  //             stack: [
  //               {
  //                 image: imagenBase64_2,
  //                 width: 80,
  //                 height: 50
  //               }
  //             ],
  //             alignment: 'right' // Alinea el contenido del stack a la derecha
  //           },
  //         ],
  //         columnGap: 10
  //       },
  //       {
  //         columns: [
  //           {
  //             width: 200, // Ancho definido para la columna del resumen
  //             table: {
  //               widths: ['*', '*', '*'], // Distribución uniforme del ancho entre las columnas
  //               body: [
  //                 ['Créditos Aprobados', 'Promedio General', 'Eficiencia'],
  //                 [
  //                   null,//resumenGeneral.cantidadUCaprobadas.toString(), // Créditos Aprobados
  //                   null,///resumenGeneral.promedioGeneral.toString(),     // Promedio General
  //                   null,///resumenGeneral.indiceRendimiento.toString()    // Eficiencia
  //                 ]
  //               ]
  //             },
  //             style: 'resumenEstilo'
  //           },
  //           // Espacio entre columnas
  //           {
  //             width: 150,
  //             text: ''
  //           },
  //           // Columna para los datos del estudiante
  //           {
  //             width: 'auto',
  //             table: {
  //               body: [
  //                 [{ text: data.estudiante.pnf, style: 'primeraFilaEstudiante' }],
  //                 [{ text: data.estudiante.apellidos, style: 'datosEstudianteEstilo', margin: [0, 5, 0, 0] }],
  //                 [{ text: data.estudiante.nombres, style: 'datosEstudianteEstilo' }],
  //                 [{ text: data.estudiante.cedula, style: 'datosEstudianteEstilo' }],
  //                 [
  //                   {
  //                     text: [
  //                       { text: 'Carnet: ', style: 'datosEstudianteEstilo' }, // Agrega la palabra "Carnet"
  //                       { text: data.estudiante.carnet, style: 'datosEstudianteEstilo' } // Valor del carnet
  //                     ]
  //                   }
  //                 ]
  //               ]
  //             },
  //             layout: {
  //               hLineWidth: function (i: number) { return 0; },
  //               vLineWidth: function (i: number) { return 0; },
  //               paddingTop: function (i: number) { return 0.5; }, // Reducir el espacio superior
  //               paddingBottom: function (i: number) { return 0.5; } // Reducir el espacio inferior
  //             },
  //             style: 'datosEstudianteEstilo'
  //           },
  //           {
  //             // Columna para la foto del estudiante
  //             image: 'data:image/png;base64, // reemplaza esto con la variable de tu imagen en base64
  //             fit: [40, 66] // Ajusta el 'width' y 'height' para coincidir con la altura de las filas
  //           }
  //         ]
  //       },
  //       // Título "HISTORIAL ACADÉMICO"
  //       {
  //         text: 'RESUMEN ACADÉMICO DE PROGRESO EN UNIDADES CURRICULARES',
  //         style: 'tituloHistorial'
  //       },

  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['auto', 'auto', 'auto', 'auto', 20, 40, 60], // Anchuras específicas para las columnas
  //           body: body
  //         },
  //         layout: 'lightHorizontalLines', // Puedes elegir un layout predefinido o personalizarlo
  //         width: '520', // Ancho fijo para la tabla completa
  //       },
  //       // ... El resto de tu contenido
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 12,
  //         bold: true,
  //         alignment: 'center',
  //         margin: [0, 0, 0, 5]  // Reduce el margen inferior para acercar el subtítulo
  //       },
  //       subheader: {
  //         fontSize: 9,
  //         bold: false,
  //         alignment: 'center',
  //         margin: [0, 5, 0, 15]  // Reduce el margen superior para acercar al título
  //       },
  //       studentInfo: {
  //         fontSize: 9,
  //         alignment: 'center',
  //         bold: true
  //       },
  //       periodoHeader: {
  //         fontSize: 8,
  //         bold: true,
  //         margin: [0, 10, 0, 10]
  //       },
  //       tituloHistorial: {
  //         fontSize: 9,
  //         bold: true,
  //         alignment: 'center',
  //         margin: [0, 20, 0, 10] // Ajusta los márgenes según sea necesario
  //       },
  //       tablaEstilo: {
  //         fontSize: 8, // Cambia el tamaño de la letra según necesites
  //       },
  //       lineaDivisoria: {
  //         margin: [0, 5, 0, 5], // Ajusta el margen según sea necesario
  //         border: [false, true, false, false], // Solo borde inferior
  //         borderColor: ['#000000'] // Color del borde
  //       },
  //       tablaEncabezadoEstilo: {
  //         fontSize: 9, // Cambia el tamaño de la letra según necesites
  //         bold: true // Opcional, si quieres que el encabezado sea en negrita
  //       },
  //       resumenEstilo: {
  //         fontSize: 9, // Cambia el tamaño de la letra según necesites
  //         alignment: 'center',
  //       },
  //       datosEstudianteEstilo: {
  //         fontSize: 8, // Cambia el tamaño de la letra según necesites
  //         alignment: 'right'
  //       },
  //       primeraFilaEstudiante: {
  //         fontSize: 8, // Cambia el tamaño de la letra según necesites
  //         alignment: 'right',
  //         bold: true
  //       },
  //     },
  //     watermark: {
  //       text: 'USO INTERNO',
  //       color: 'grey', // Puedes cambiar el color si lo deseas
  //       opacity: 0.3, // Ajusta la opacidad según necesites
  //       bold: true, // Hace la marca de agua en negrita
  //       italics: false, // Puedes cambiar a true si prefieres cursiva
  //       fontSize: 100, // Ajusta el tamaño de la fuente
  //       angle: -45 // Ángulo de la marca de agua
  //     },

  //     footer: (currentPage: number, pageCount: number) => {
  //       return {
  //         columns: [
  //           { text: estudianteInfo, fontSize: 7, alignment: 'left', width: 'auto' }, // Información del estudiante alineada a la izquierda
  //           {
  //             text: `Pág. ${currentPage} de ${pageCount}`,
  //             fontSize: 9,
  //             alignment: 'right',
  //             bold: true
  //           }
  //         ],
  //         margin: [40, 10]
  //       };
  //     },
  //     header: (currentPage: number) => {
  //       let headerContent = [];

  //       // Contenido para la fecha de emisión
  //       headerContent.push({
  //         columns: [
  //           '',
  //           { text: `Emitido el: ${new Date().toLocaleString()}`, fontSize: 7, alignment: 'right' }
  //         ],
  //         margin: [40, 10]
  //       });

  //       return headerContent;
  //     },
  //     // ... (Configuraciones adicionales si son necesarias)
  //   };

  // }


  getDocumentDefinitionFicha(data: any) {
    return {
      pageSize: 'LETTER',
      pageMargins: [40, 60, 40, 60], // Margen: izquierda, arriba, derecha, abajo
      header: function () {
        return {
          margin: [40, 20, 40, 0], // Ajusta este margen como necesites
          table: {
            widths: ['auto', '*', 'auto'],
            body: [
              [
                {
                  // Coloca aquí la ruta de la imagen de la izquierda
                  //image: 'ruta/a/la/imagen/izquierda.png',
                  //width: 50 // Ajusta el ancho como sea necesario
                },
                {
                  text: [
                    { text: 'UNIVERSIDAD NACIONAL EXPERIMENTAL DEL TRANSPORTE\n', style: 'headerCenter' },
                    { text: 'Dirección de Control de Estudios', style: 'subheaderCenter' }
                  ],
                  alignment: 'center'
                },
                {
                  // Coloca aquí la ruta de la imagen de la derecha
                  //image: 'ruta/a/la/imagen/derecha.png',
                  //width: 50 // Ajusta el ancho como sea necesario
                }
              ]
            ]
          },
          layout: 'noBorders'
        };
      },
      content: [
        , // Espacio adicional después del encabezado
        { text: 'Ficha de Registro Estudiantil', style: 'header' },
        {
          text: '1. Datos de identidad del estudiante',
          style: 'subheader'
        },
        {
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Cédula:', style: 'boldText' },
                { text: `${data.nac}-${data.ced_pas}`, style: 'normalSize' },
                { text: 'Nombres:', style: 'boldText' },
                { text: `${data.nombres}`, style: 'normalSize' },
                { text: 'Apellidos:', style: 'boldText' },
                { text: `${data.apellidos}`, style: 'normalSize' }
              ],
              [
                { text: 'Ubicación geográfica del lugar de nacimiento:', colSpan: 6, style: 'headerSize' }, {}, {}, {}, {}, {}
              ],
              [
                { text: 'Estado:', style: 'boldText' },
                { text: `${data.edonac}`, colSpan: 2, style: 'normalSize' }, {},
                { text: 'Municipio:', style: 'boldText' },
                { text: `${data.muninac}`, colSpan: 2, style: 'normalSize' }, {}
              ],
              [
                { text: 'Parroquia:', style: 'boldText', colSpan: 2 }, {},
                { text: `${data.parronac}`, colSpan: 4, style: 'normalSize' }, {}, {}, {}
              ]
            ]
          },
          layout: 'noBorders'
        },
        '\n',
        {
          text: [
            { text: 'Información de Contacto\n', style: 'subheader' },
            `Estado de Residencia: ${data.edores}\n`,
            `Municipio de Residencia: ${data.munires}\n`,
            `Parroquia de Residencia: ${data.parrores}\n`,
            `Dirección de Habitación: ${data.direccion_hab}\n`,
            `Teléfono Celular: ${data.tlf_cel}\n`,
            `Teléfono de Habitación: ${data.tlf_hab}\n`,
            `Teléfono de Emergencia: ${data.tlf_emergencia} (${data.parentesco_emergencia})\n`,
            `Contacto de Emergencia: ${data.nombcontacto}\n`,
            `Correo Electrónico: ${data.email}\n`,
            `Correo Electrónico Alternativo: ${data.email_alt}\n`,
          ],
        },
        '\n',
        {
          text: [
            { text: 'Información Académica\n', style: 'subheader' },
            `Plantel de Procedencia: ${data.plantel} (${data.edoplantel}, ${data.munplantel}, ${data.parplantel})\n`,
            `Mención: ${data.mencion}\n`,
            `Índice Académico: ${data.indice}\n`,
            `SNI/RUSNIES: ${data.sni}\n`,
            `Fecha de Graduación Educ. Media: ${data.gradoedumedia}\n`,
            `IES de Procedencia: ${data.nombies}\n`,
            `Título IES: ${data.tituloies}\n`,
            `Fecha de Graduación IES: ${data.gradoies}\n`,
            `Mención IES: ${data.mencionies}\n`,
          ],
        },
        '\n',
        {
          text: [
            { text: 'Información Universitaria\n', style: 'subheader' },
            `Carnet: ${data.carnet}\n`,
            `Programa Nacional de Formación (PNF): ${data.pnf}\n`,
            `Sede: ${data.sede}\n`,
            `Modalidad de Ingreso: ${data.mod_ingreso}\n`,
            `Trayecto de Ingreso: ${data.trayecto_ing}\n`,
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
          //margin: [0, 20, 0, 10] // Margen: izquierda, arriba, derecha, abajo
        },
        headerCenter: {
          fontSize: 10,
          bold: true,
        },
        subheaderCenter: {
          fontSize: 11,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 5], // Espacio antes de cada subencabezado
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        boldText: {
          bold: true
        },
        normalSize: {
          fontSize: 10
        },
        headerSize: {
          fontSize: 14,
          bold: true
        }
        // Estilos para subencabezados y texto como los has definido anteriormente...
      },
    };
  }



}
