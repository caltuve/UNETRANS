import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface CalificacionEstudiante {
  acta: number;
  cod_ucurr: string;
  periodo: string;
  carnet: string;
  calificacion: number;
}

@Component({
  selector: 'app-detalle-acta-calificaciones-docente',
  templateUrl: './detalle-acta-calificaciones-docente.component.html',
  styleUrls: ['./detalle-acta-calificaciones-docente.component.scss']
})
export class DetalleActaCalificacionesDocenteComponent implements OnInit {
  
  form: FormGroup;
  
  idActa: number;
  notaMinima: number; 
  seccion: number;
  codigo_uc: string;
  periodo: string
  calificacion: number; 


  hayResultadosSecciones: boolean = false;
  sinResultadosSecciones: boolean = false;

  modalRef: BsModalRef; 

  detallesUC: any = {}; // Para almacenar los detalles de la UC
  detalle_acta : any []= [];
  inscritos : any []= [];

  usrsice: string;

  rol: any []= [];


  cargandoDatos = true; 
  detalleinscritos = new MatTableDataSource<any>(); // Para los estudiantes inscritos
  displayedColumnsDetail: string[] = ['orden','carnet','cedula','nombre_completo','calificacion', 'estatus'];

  constructor(private route: ActivatedRoute,
    private modalService: BsModalService,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    public bsModalRef: BsModalRef,
    private location: Location,
    private fb: FormBuilder) {
      this.obtenerUsuarioActual();
     }

  ngOnInit(): void {
    const idActaParam = this.route.snapshot.paramMap.get('idActa');
    if (idActaParam !== null) {
      this.idActa = +idActaParam; // El signo '+' convierte el string a number
    } else {
      // Aquí manejas el caso en que `idActa` no esté presente en la URL
      // Por ejemplo, asignando un valor predeterminado como 0 o lanzando un error
      this.idActa = 0; // O cualquier otro valor predeterminado que consideres apropiado
    }

    this.cargarSecciones(this.idActa);
  
    this.form = this.fb.group({
      estudiantes: this.fb.array(this.detalleinscritos.data.map(estudiante => this.fb.group({
        carnet: [estudiante.carnet, Validators.required],
        calificacion: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
        // Añade más controles según sea necesario
      })))
    });
  }

  regresar(): void {
    this.location.back();
  }

  get estudiantesFormArray() {
    return this.form.get('estudiantes') as FormArray;
  }


  cargarSecciones(idActa: number) {
    this.cargandoDatos = true;
    this.SpinnerService.show();
    this.controlestudiosService.getDetailActaCarga(idActa).subscribe(data => {
      this.SpinnerService.hide();
      if (data && data.length > 0 && data[0]['inscritos'] && data[0]['inscritos'].length > 0) {
        // Accede al objeto de detalles de la UC usando la clave "0"
        this.detallesUC = data[0]['0']; // Ahora detallesUC contiene los detalles de la UC
        this.notaMinima = this.detallesUC.nota_minima;
        this.seccion = this.detallesUC.seccion;
        this.codigo_uc = this.detallesUC.codigo_uc;
        this.periodo = this.detallesUC.periodo;

        this.detalleinscritos.data = data[0]['inscritos']; // Establece los estudiantes inscritos como dataSource
        this.hayResultadosSecciones = true;
        this.cargandoDatos = false;
      } else {
        this.sinResultadosSecciones = true;
        this.cargandoDatos = false;
      }
    }, error => {
      console.error(error);
      this.SpinnerService.hide();
    });
  }

  enviarCalificaciones(): void {
    this.SpinnerService.show();
    const datosParaEnviar: CalificacionEstudiante[] = this.detalleinscritos.data.map(estudiante => {
      // Determinar el estado de la calificación
      const estadoCalificacion = estudiante.calificacion >= this.notaMinima ? "APROBADO" : "REPROBADO";
  
      return {
        acta: this.detallesUC.acta, // Asume que `acta` es un campo en `detallesUC`
        cod_ucurr: this.detallesUC.cod_ucurr,
        seccion: this.seccion,
        periodo: this.detallesUC.periodo,
        carnet: estudiante.carnet,
        calificacion: estudiante.calificacion,
        usrsice: this.usrsice,
        estado_calificacion: estadoCalificacion, // Agregar el nuevo valor aquí
      };
    });


    this.controlestudiosService.uploadCalificacionesDocente(datosParaEnviar).subscribe({
      next: (response) => {
        if (response.success) {

          this.SpinnerService.hide();
          this.notifyService.showSuccess('Calificaciones procesadas');

          this.regresar();
        } else if (response.error) {
          

          this.SpinnerService.hide();
          this.notifyService.showError(`Error al procesar las calificaciones: ${response.error}`);
          this.regresar();

        }
      },
      error: (error) => {
        this.notifyService.showError('Error al enviar los datos al servidor.');
        this.SpinnerService.hide();
        this.regresar();

      }
    });
  }

  todasCalificacionesValidas(): boolean {
    // Verifica si 'detalleinscritos.data' existe y tiene elementos
    if (!this.detalleinscritos || !this.detalleinscritos.data || this.detalleinscritos.data.length === 0) {
      return false;
    }
  
    return this.detalleinscritos.data.every(element => {
      const calificacion = element.calificacion;
      return calificacion >= 1 && calificacion <= 20;
    });
  }

  obtenerUsuarioActual() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.usrsice = currentUser.usrsice;
    this.rol = currentUser.rol;
  }



  descargarActa(idActa: number) {
    this.cargandoDatos = true;
    this.SpinnerService.show();
    this.controlestudiosService.getDetailActaCargada(idActa).subscribe(data => {
      this.SpinnerService.hide();
      if (data && data.length > 0 && data[0]['inscritos'] && data[0]['inscritos'].length > 0) {
        // Accede al objeto de detalles de la UC usando la clave "0"
        this.detallesUC = data[0]['0']; // Ahora detallesUC contiene los detalles de la UC
        this.notaMinima = this.detallesUC.nota_minima;
        this.seccion = this.detallesUC.seccion;
        this.codigo_uc = this.detallesUC.codigo_uc;
        this.periodo = this.detallesUC.periodo;

        this.inscritos = data[0]['inscritos']; // Establece los estudiantes inscritos como dataSource
        this.hayResultadosSecciones = true;
        this.cargandoDatos = false;

        this.generarPDF(this.detallesUC, this.inscritos)
      } else {
        this.sinResultadosSecciones = true;
        this.cargandoDatos = false;
      }
    }, error => {
      console.error(error);
      this.SpinnerService.hide();
    });
  }

   generarPDF(datosEstudiante: { acta: any; periodoacademico: any; notaMinima: number; }, datosInscripcion: any[]) {
    const fechaActual = new Date();
    const mesEnMayusculas = fechaActual.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
  
    const docDefinition = {
      pageSize: 'Letter',
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          text: 'Acta de Calificaciones',
          style: 'header',
        },
        // Espacio entre secciones
        {
          text: '\n\n',
        },
        // Texto introductorio antes de la tabla
        {
          text: [
            `A continuación se presentan las calificaciones correspondientes al acta número ${datosEstudiante.acta}, para el período ${datosEstudiante.periodoacademico}.`,
            '\n\n',
          ],
        },
        // Tabla de calificaciones
        {
          style: 'tablaCalificaciones',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              ['Carnet', 'Nombre Completo', 'Calificación', 'Estatus'].map(header => ({ text: header, style: 'tableHeader' })),
              ...datosInscripcion.map(item => [
                item.carnet,
                item.nombre_completo,
                { text: item.calificacion.toString(), alignment: 'center' },
                { text: item.calificacion >= datosEstudiante.notaMinima ? 'APROBADO' : 'REPROBADO', alignment: 'center' },
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20], // Ajustar según sea necesario
        },
        tableHeader: {
          fillColor: '#dddddd',
          bold: true,
        },
        tablaCalificaciones: {
          margin: [0, 5, 0, 15],
        },
      },
    };
  
    pdfMake.createPdf(docDefinition as any).download('Acta_Calificaciones.pdf');
  }

  

}