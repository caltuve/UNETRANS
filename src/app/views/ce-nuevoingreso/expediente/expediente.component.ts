import { Component, ViewChild } from '@angular/core';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

export interface Estudiante {
  carnet: string;
  desc_estatus: string,
  nac: string,
  nombre_completo: string;
  ced_pas: number,
  pnf: string,
  ult_per_inscrito: string,
  cohorte: string
  trayecto: string,
  foto: string,
  cedula_formateada: string,
  carnet_formateado: string,
  estatus_exp: string,
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
    switch (value) {
      case '01':
        return 'PENDIENTE DE REVISIÓN';
      case '02':
        return 'REVISADO CONFORME';
      case '03':
        return 'INCOMPLETO';
      case '04':
        return 'INCONSISTENTE';
      default:
        return 'DESCONOCIDO';
    }
  }
}

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.scss']
})
export class ExpedienteComponent {

  miFormulario: FormGroup;

  displayedColumns: string[] = ['estatus', 'carnet', 'ult_per_ins', 'cohorte', 'annio', 'cedula', 'nombre_persona', 'pnf'];
  dataSource = new MatTableDataSource<Estudiante>();

  displayedColumnsDocumentos: string[] = ['idDoc','nombreDocumento', 'entregado', 'estadoAprobacion'];
  dataSourceDocumentos = new MatTableDataSource<DocumentosEstudiante>(); // Asegúrate de definir la clase o interfaz DocumentosEstudiante adecuadamente

  hayResultados: boolean = false;
  sinResultados: boolean = false;

  public visible = false;



  carnet!: string;
  cedula!: string;
  nombre!: string;
  resultados!: string[];
  carnetActual: string;
  usrsice: string;

  

  @ViewChild('formSearchPersona') formSearchPersona!: NgForm;
  constructor(public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService: NotificacionService,
    private fb: FormBuilder
  ) { 
    this.miFormulario = this.fb.group({
      documentos: this.fb.array([])
    });  
    this.obtenerUsuarioActual();
  }

   // Getter para acceder al FormArray de documentos
   get documentosFormArray(): FormArray {
    return this.miFormulario.get('documentos') as FormArray;
  }


  // searchPersona(formSearchPersona: NgForm) {
  //   this.SpinnerService.show(); 
  //   this.controlestudiosService.findPersonaExpediente(formSearchPersona.value).subscribe(
  //     (result: any) => {
  //         this.hayResultados = false;
  //         this.sinResultados = false;
  //         this.dataSource.data = result;
  //         if (this.dataSource.data.length == 0) {
  //           this.SpinnerService.hide();
  //           this.sinResultados = this.dataSource.data.length ==0
  //           this.hayResultados = false;
  //           this.formSearchPersona.reset();
  //         }
  //         else{
  //           this.notifyService.showSuccess('Consulta de datos de estudiante');
  //           this.SpinnerService.hide();
  //           this.hayResultados = this.dataSource.data.length >0
  //           this.formSearchPersona.reset();
  //         }   

  //   }
  //   );
  // }


  searchPersona(formSearchPersona: NgForm) {
    this.SpinnerService.show();
    this.controlestudiosService.findPersonaExpediente(formSearchPersona.value).subscribe(
      (result: any) => {
        this.hayResultados = false;
        this.sinResultados = false;

        // Asumiendo que la respuesta tiene dos propiedades: 'estudiante' y 'documentos'
        if (result && result.estudiante && result.documentos) {
          this.dataSource.data = [result.estudiante]; // Almacena los datos del estudiante
          this.carnetActual = result.estudiante.carnet;
          this.dataSourceDocumentos.data = result.documentos; // Almacena los documentos en el dataSource de la tabla

          this.notifyService.showSuccess('Consulta de datos de estudiante');
          this.hayResultados = true; // Indica que hay resultados
          // Actualizar el FormArray
        this.actualizarFormArrayConDocumentos(result.documentos);
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
  
  private actualizarFormArrayConDocumentos(documentos: any[]) {
    const arrayControl = this.documentosFormArray;
    arrayControl.clear(); // Limpia el FormArray
  
    documentos.forEach((doc, index) => {
      const entregadoControl = this.fb.control(doc.entregado);
      const validoControl = this.fb.control({ value: doc.valido, disabled: !doc.entregado });
  
      const grupo = this.fb.group({
        id_doc: [doc.id_doc],
        entregado: entregadoControl,
        valido: validoControl
      });
  
      // Suscribirse a cambios en 'entregado' para habilitar/deshabilitar 'valido'
      entregadoControl.valueChanges.subscribe(entregado => {
        if (entregado) {
          validoControl.enable();
        } else {
          validoControl.disable();
        }
      });
  
      arrayControl.push(grupo);
    });
  }

  enviarDatos(idDoc: number) {
    const index = this.documentosFormArray.value.findIndex((doc: { id_doc: number; }) => doc.id_doc === idDoc);
    if (index !== -1) {
      const documento = this.documentosFormArray.at(index).value;
  
      const datosActualizados = {
        carnet: this.carnetActual,
        id_doc: idDoc,
        entregado: documento.entregado,
        valido: documento.valido,
        usrrev: this.usrsice 
      };
  
      this.controlestudiosService.revisarExpediente(datosActualizados).subscribe(
        (respuesta: any) => {
          if (respuesta.success) {
            //this.notifyService.showSuccess('Documento verificado');
          } else {
            this.notifyService.showError('Error en la operación: ' + (respuesta.message || 'Error desconocido'));
          }
        },
        (error) => {
          this.notifyService.showError('Error en la solicitud: ' + error.message);
        }
      );
    }
    this.actualizarEstatusExpediente();
  }

  obtenerUsuarioActual() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.usrsice = currentUser.usrsice;
  }

  actualizarEstatusExpediente() {
    const documentos = this.documentosFormArray.value;
    let estatusExpediente = '01'; // Valor por defecto: Pendiente de revisión
  
    const todosEntregados = documentos.every((doc: { entregado: any; }) => doc.entregado);
    const todosValidos = documentos.every((doc: { valido: any; }) => doc.valido);
    const algunoNoEntregado = documentos.some((doc: { entregado: any; }) => !doc.entregado);
    const algunoInvalido = documentos.some((doc: { entregado: any; valido: any; }) => doc.entregado && !doc.valido);
  
    if (todosEntregados && todosValidos) {
      estatusExpediente = '02'; // Revisado conforme
    } else if (algunoNoEntregado) {
      estatusExpediente = '03'; // Incompleto
    } else if (algunoInvalido) {
      estatusExpediente = '04'; // Inconsistente
    }
  
    // Llamar a una función para actualizar el estatus en la base de datos
    this.enviarEstatusExpediente(estatusExpediente);
  }

  enviarEstatusExpediente(estatus: string) {
    const datosEstatus = {
      carnet: this.carnetActual,
      estatus: estatus,
      usrrev: this.usrsice // Usuario que revisa
    };
  
    this.controlestudiosService.actualizarEstatusExpediente(datosEstatus).subscribe(
      (respuesta: any) => {
        // Manejar respuesta
        if (respuesta.success) {
         // this.notifyService.showSuccess('Estatus del expediente actualizado');
        } else {
          this.notifyService.showError('Error al actualizar el estatus');
        }
      },
      error => {
        this.notifyService.showError('Error en la solicitud: ' + error.message);
      }
    );
  }

  obtenerClaseColor(estatus: string): string {
    switch (estatus) {
      case '01': return 'text-warning';
      case '02': return 'text-success';
      case '03': return 'text-danger';
      case '04': return 'text-orange';
      default: return '';
    }
  }
  
  obtenerNombreIcono(estatus: string): string {
    switch (estatus) {
      case '01': return 'cilHistory';
      case '02': return 'cilCheckCircle';
      case '03': return 'cilWarning';
      case '04': return 'cilBan';
      default: return 'cilFrown';
    }
  }


}
