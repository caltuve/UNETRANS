import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { BsModalRef } from 'ngx-bootstrap/modal';
import { debounceTime, filter, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-add-mod-aspirante',
  templateUrl: './modal-add-mod-aspirante.component.html',
  styleUrls: ['./modal-add-mod-aspirante.component.scss']
})
export class ModalAddModAspiranteComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

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
    private http: HttpClient
    ) {
      this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
    }

  ngOnInit(): void {
    this.findNac();
    this.findCarreras();
    this.findModIngreso();
    this.findEmpConvenio();
    // Inicializamos el formulario reactivo
    this.firstFormGroup = this.fb.group({
      nac: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      primer_apellido: ['', Validators.required],
      segundo_apellido: [''],
      pnf: ['', Validators.required],
      trayecto:  ['', Validators.required], // Trayecto es calculado y deshabilitado para el usuario
      tipoAspirante: ['', Validators.required], // Tipo de aspirante
      mingreso: ['', Validators.required],
      convenio: ['', Validators.required],
      tituloTSU: [''] // Solo se usa si es TSU
    });

    // Si es modo de edición, cargar datos
    if (this.isEditMode && this.aspirante) {
      this.firstFormGroup.patchValue(this.aspirante);
    }
    this.firstFormGroup.get('tipoAspirante')?.valueChanges.subscribe(value => {
      this.findTrayectos(value); // Carga trayectos y filtra basado en el tipo de aspirante
    });
    // Suscribirse a los cambios en los campos 'nac' y 'cedula'
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
  
    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB en bytes
      const allowedType = 'application/pdf';
  
      // Verificar el tamaño del archivo
      if (file.size > maxSizeInBytes) {
        this.notifyService.showWarning('El archivo supera el tamaño máximo permitido de 1 MB.');
        // Marcar el control como inválido si no cumple con el tamaño
        this.firstFormGroup.get('tituloTSU')?.setErrors({ invalidSize: true });
        return;
      }
  
      // Verificar el tipo de archivo
      if (file.type !== allowedType) {
        this.notifyService.showWarning('Solo se permiten archivos PDF.');
        // Marcar el control como inválido si no cumple con el tipo
        this.firstFormGroup.get('tituloTSU')?.setErrors({ invalidType: true });
        return;
      }
  
      // Si el archivo cumple con las condiciones, convertirlo a Base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result as string;
  
        // Asignar el archivo en Base64 al form
        this.firstFormGroup.patchValue({
          tituloTSU: base64File
        });
        this.firstFormGroup.get('tituloTSU')?.updateValueAndValidity();
      };
  
      // Leer el archivo como DataURL (Base64)
      reader.readAsDataURL(file);
    } else {
      // Marcar el campo como inválido si no se seleccionó un archivo
      this.firstFormGroup.get('tituloTSU')?.setErrors({ required: true });
    }
  }
  
  
  
  

  onBlurCedula(): void {
    const cedulaControl = this.firstFormGroup.get('cedula');
    const nacControl = this.firstFormGroup.get('nac');
    
    // Verificar si ambos controles son válidos cuando el campo pierde el foco
    if (cedulaControl?.valid && nacControl?.valid) {
      // Llamar a la API solo si ambos campos son válidos
      this.checkDni().subscribe();
    }
  }

  // Método para manejar la lógica cuando el aspirante es TSU y debe subir el título
onTipoAspiranteChange(tipoAspirante: string) {
  if (tipoAspirante === 'TSU') {
    this.firstFormGroup.get('tituloTSU')?.setValidators(Validators.required); // Requiere subir título
  } else {
    this.firstFormGroup.get('tituloTSU')?.clearValidators();
  }
  this.firstFormGroup.get('tituloTSU')?.updateValueAndValidity();
}
  

  checkDni() {
    this.SpinnerService.show();
    const nac = this.firstFormGroup.get('nac')?.value;
    const cedula = this.firstFormGroup.get('cedula')?.value;
  
    if (nac && cedula) {
      // Verificar primero si la cédula ya existe en la base de datos
      return this.controlestudiosService.getAspirantesConvenioVerify(cedula).pipe(
        switchMap((dbResponse: any) => {
          if (dbResponse && dbResponse.exists) {
            // Si ya existe, mostrar notificación y cerrar el modal
            this.notifyService.showWarning(dbResponse.mensaje); 
            this.decline(); // Cerrar el modal
            this.SpinnerService.hide();
            return of(null); // Finalizar el flujo
          } else {
            // Si no existe en la base de datos, proceder a la API externa
            const apiUrl = `https://apiseguridad.mppe.gob.ve/v1/shared/saime/checkDni?dni=${cedula}&type=${nac}`;
            return this.http.get(apiUrl).pipe(
              switchMap((response: any) => {
                if (response && response.cedula) {
                  // Llenar los campos del formulario si hay respuesta
                  this.firstFormGroup.patchValue({
                    primer_nombre: response.primerNombre?.toUpperCase(),
                    segundo_nombre: response.segundoNombre?.toUpperCase(),
                    primer_apellido: response.primerApellido?.toUpperCase(),
                    segundo_apellido: response.segundoApellido?.toUpperCase()
                  });                  
                } else {
                  // Si no hay datos en la API, limpiar los campos
                  this.firstFormGroup.patchValue({
                    primer_nombre: '',
                    segundo_nombre: '',
                    primer_apellido: '',
                    segundo_apellido: ''
                  });
                }
                this.SpinnerService.hide();
                return of(null); // Finalizar el flujo
              }),
              catchError((error) => {
                // Manejar el error cuando no se encuentra la cédula o cualquier otro error
                if (error.status === 400) {
                  // Si la cédula no se encuentra, limpiar los campos del formulario
                  this.notifyService.showInfo('Identificación no encontrada, ingrese los nombres y apellidos de forma manual');
                  this.firstFormGroup.patchValue({
                    primer_nombre: '',
                    segundo_nombre: '',
                    primer_apellido: '',
                    segundo_apellido: ''
                  });
                } else {
                  // Manejo genérico de errores
                  this.notifyService.showError('Ocurrió un error al consultar la API externa, ingrese los nombres y apellidos de forma manual');
                }
                this.SpinnerService.hide();
                return of(null); // Finalizar el flujo de errores
              })
            );
          }
        })
      );
    }
  
    // Si no hay datos, devolver observable vacío
    this.SpinnerService.hide();
    return of(null);
  }
  

  findNac(){
    this.SpinnerService.show();
    this.controlestudiosService.getNac().subscribe(
      (result: any) => {
          this.nacs = result;
    }
    );
    this.SpinnerService.hide();
  }
  
  findGen(){
    this.SpinnerService.show();
    this.controlestudiosService.getGen().subscribe(
      (result: any) => {
          this.genero = result;
    }
    );
    this.SpinnerService.hide();
  }
  
  findCarreras(){
    this.SpinnerService.show();
    this.controlestudiosService.getCarreras().subscribe(
      (result: any) => {
          this.carreras2 = result;
    }
    );
    this.SpinnerService.hide();
  }
  
  findModIngreso() {
    this.SpinnerService.show();
    this.controlestudiosService.getModIngreso().subscribe(
      (result: any) => {
        // Filtrar solo la opción con codelemento '013'
        const opcionSeleccionada = result.filter((moding: { codelemento: string }) => moding.codelemento === '013');
        
        // Asignar el valor al arreglo moding para que aparezca en el select
        this.moding = opcionSeleccionada;
  
        // Autoseleccionar la opción '013' en el formulario
        if (opcionSeleccionada.length > 0) {
          this.firstFormGroup.get('mingreso')?.setValue(opcionSeleccionada[0].codelemento);
          
          // Deshabilitar el campo para que no sea editable, pero su valor sea válido
          //this.firstFormGroup.get('mingreso')?.disable();
        }
  
        this.SpinnerService.hide();
      },
      (error) => {
        console.error('Error al obtener modalidades de ingreso:', error);
        this.SpinnerService.hide();
      }
    );
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
  
  
  findEmpConvenio() {
    this.SpinnerService.show();
  
    this.controlestudiosService.getEmpConvenio().subscribe(
      (result: any) => {
        let conveniosFiltrados;
  
        // Si id_ente no existe o es null, mostrar todos los convenios sin seleccionar ninguno
        if (!this.usr.id_ente) {
          conveniosFiltrados = result; // Mostrar todos los convenios
          this.firstFormGroup.get('convenio')?.reset(); // No autoseleccionar ningún valor
        } else {
          // Filtrar los convenios que coincidan con el id_ente
          conveniosFiltrados = result.filter((convenio: { codelemento: string }) => convenio.codelemento === this.usr.id_ente);
  
          // Si hay convenios filtrados, autoseleccionar el primero
          if (conveniosFiltrados.length > 0) {
            const convenioSeleccionado = conveniosFiltrados[0].codelemento;
            // Autoseleccionar el convenio en el formulario
            this.firstFormGroup.get('convenio')?.setValue(convenioSeleccionado);
          } else {
            console.log('No se encontró ningún convenio para el id_ente:', this.usr.id_ente);
          }
        }
  
        // Asignar los convenios filtrados (o todos) a la variable convenios
        this.convenios = conveniosFiltrados;
  
        this.SpinnerService.hide();
      },
      (error) => {
        console.error('Error al obtener convenios:', error);
        this.SpinnerService.hide();
      }
    );
  }
  
  
  

  guardar() {
    if (this.firstFormGroup.valid) {
      if (this.isEditMode) {
        // Lógica para editar el aspirante
        this.actualizarAspirante();
      } else {
        // Lógica para guardar un nuevo aspirante
        this.crearAspirante();
      }
    }
  }

  crearAspirante() {
    this.SpinnerService.show();
    const nuevoAspirante = {
      ...this.firstFormGroup.value,
      usrsice: this.usr.usrsice
    };
  
    this.controlestudiosService.createPersonConvenio(nuevoAspirante).subscribe(
      (response) => {
        this.notifyService.showSuccess('Aspirante creado');
        //console.log('Aspirante guardado exitosamente', response);
      },
      (error) => {
        this.notifyService.showError('Error al eliminar el aspirante.');
        console.error('Error al guardar aspirante:', error);
      }
    );
    this.SpinnerService.hide();
    this.onClose.emit(true);
    this.bsModalRef.hide();
  }
  

  actualizarAspirante() {
    const aspiranteActualizado = { ...this.aspirante, ...this.firstFormGroup.value };
    // Lógica para actualizar el aspirante
    console.log('Aspirante actualizado:', aspiranteActualizado);
    // Aquí puedes llamar a tu servicio para actualizar en la base de datos
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
}