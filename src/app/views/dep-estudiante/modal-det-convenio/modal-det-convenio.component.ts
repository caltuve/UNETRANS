import { Component, OnInit, EventEmitter, Output, Input  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { BsModalRef } from 'ngx-bootstrap/modal';
import { debounceTime, filter, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { HttpClient } from '@angular/common/http';

import { DomSanitizer, SafeResourceUrl  } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-det-convenio',
  templateUrl: './modal-det-convenio.component.html',
  styleUrls: ['./modal-det-convenio.component.scss']
})
export class ModalDetConvenioComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  @Input() solicitud: any; // Recibe los datos de la solicitud

  pdfUrl: SafeResourceUrl | null = null; // Almacena la URL del PDF

  
  trayectoForm: FormGroup;
  firstFormGroup: FormGroup;
  isEditMode: boolean = false;
  aspirante: any; // Este objeto contendrá los datos del aspirante que estás editando, si aplica

  nacs: any []= [];
  genero: any []= [];
  carreras: any []= [];
  carreras2: any []= [];
  aspirantes: any []= [];

  moding: any []= [];
  turnos: any []= [];
  trayectos: any []= [];
  convenios: any []= [];

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
    id_ente: null
  }

  constructor(private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private http: HttpClient,
    public sanitizer: DomSanitizer
    ) {
      this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
    }

ngOnInit(): void {
    // Verifica que la solicitud se haya recibido correctamente
    if (this.solicitud) {
      // Asegurarse de que el PDF base64 tiene el prefijo correcto
      if (this.solicitud?.titulo_pdf) {
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.solicitud.titulo_pdf);
      }
    } else {
      console.error('La solicitud no se ha pasado correctamente al modal');
    }
    this.trayectoForm = this.fb.group({
      trayecto: [null, Validators.required]
    });
  }


  
  findTrayectos(tipoAspirante: string) {
    this.SpinnerService.show();
  
    this.controlestudiosService.getTrayectos().subscribe(
      (result: any) => {
        // Filtrar los trayectos según el tipo de aspirante
        if (tipoAspirante === 'Bachiller') {
          this.trayectos = result.filter((trayecto: { codelemento: string }) => trayecto.codelemento === '0');
        } else if (tipoAspirante === 'TSU') {
          this.trayectos = result.filter((trayecto: { codelemento: string }) => trayecto.codelemento === '99');
        }
  
        // Ahora calculamos y seleccionamos el trayecto basándonos en el tipo de aspirante
        this.calcularTrayecto(tipoAspirante);
  
        this.SpinnerService.hide();
      },
      (error) => {
        console.error('Error al obtener trayectos:', error);
        this.SpinnerService.hide();
      }
    );
  }
  

  calcularTrayecto(tipoAspirante: string) {
    if (tipoAspirante === 'Bachiller') {
      const trayectoBachiller = this.trayectos.find((trayecto: { codelemento: string }) => trayecto.codelemento === '0');
      if (trayectoBachiller) {
        this.firstFormGroup.get('trayecto')?.setValue('0'); // Seleccionamos trayecto inicial
      }
    } else if (tipoAspirante === 'TSU') {
      const trayectoTSU = this.trayectos.find((trayecto: { codelemento: string }) => trayecto.codelemento === '99');
      if (trayectoTSU) {
        this.firstFormGroup.get('trayecto')?.setValue('99'); // Seleccionamos el trayecto de revisión
      }
    }
  }
  
  guardarCambios(): void {
    if (this.trayectoForm.valid) {
      const datosActualizados = {
        id_estudiante: this.solicitud.id_estudiante,  // Añadir id_estudiante
        trayecto: this.trayectoForm.value.trayecto    // Valor del trayecto seleccionado
      };
      // Aquí puedes manejar la lógica para guardar los cambios
      console.log('Datos actualizados:', datosActualizados);
      this.bsModalRef.hide();
    }
  }

  guardar() {
    if (this.trayectoForm.valid) {
        this.actualizarAspirante();
    }
  }



  actualizarAspirante() {
    this.SpinnerService.show();
    const datosActualizados = {
      id_estudiante: this.solicitud.id_estudiante,  // Añadir id_estudiante
      trayecto: this.trayectoForm.value.trayecto    // Valor del trayecto seleccionado
    };
  
    this.controlestudiosService.updatePersonConvenio(datosActualizados).subscribe(
      (response) => {
        this.notifyService.showSuccess('Aspirante actualizado');
        //console.log('Aspirante guardado exitosamente', response);
      },
      (error) => {
        this.notifyService.showError('Error al actualizar el aspirante.');
        console.error('Error al actualizar aspirante:', error);
      }
    );
    this.SpinnerService.hide();
    this.onClose.emit(true);
    this.bsModalRef.hide();
  }


  cargarAspiranteParaEditar(aspirante: any) {
    this.isEditMode = true;
    this.aspirante = aspirante;
    this.firstFormGroup.patchValue(aspirante);
  }

  decline(): void {
    this.onClose.emit(false);
    this.bsModalRef.hide();
  }

  descargarPdf() {
    const link = document.createElement('a');
    link.href = this.solicitud.titulo_pdf; // El valor en base64
    link.download = `${this.solicitud.nombre_completo}_titulo.pdf`; // Nombre del archivo a descargar
    link.click();
  }
}