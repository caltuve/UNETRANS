import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AspiranteService } from '../../aspirante/aspirante.service';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

interface RespuestaServidor {
  success?: boolean;
  error?: string;
}

function atLeastOneCheckboxSelectedValidator(group: FormGroup): ValidationErrors | null {
  let isAtLeastOneChecked = false;
  Object.keys(group.controls).forEach(key => {
    if (group.get(key)?.value) {
      isAtLeastOneChecked = true;
    }
  });

  return isAtLeastOneChecked ? null : { 'notChecked': true };
}

@Component({
  selector: 'app-det-migraestudiante-modal',
  templateUrl: './det-migraestudiante-modal.component.html',
  styleUrls: ['./det-migraestudiante-modal.component.scss']
})
export class DetMigraestudianteModalComponent implements OnInit {


  
  firstFormGroup1: FormGroup;
  secondFormGroup2: FormGroup;
  thirdFormGroup3: FormGroup;

  form: FormGroup;
  form2: FormGroup;
  firstFormGroup: FormGroup;
  estudianteBase: any; // Ajusta según el tipo de dato de tu estudiante
  inscrito: boolean = false;
  inscripcion: any []= [];

  usrsice: string;

  nacs: any []= [];
  genero: any []= [];
  edocivil: any []= [];
  gruposan: any []= [];

  minDate1!: Date;
  maxDate1!: Date;
  minDate2!: Date;
  maxDate2!: Date;
  minDate3!: Date;
  maxDate3!: Date;

  termsAccepted: boolean = false; // Para controlar el checkbox de términos y condiciones
  email: string = '';
  emailVerified: boolean = false;
  validationCode: string = ''; // Almacena el código de validación introducido

  showIncorrectDataForm: boolean = false;

  solicitarRevisionEnabled: boolean = false; 

  emailDuplicado: boolean = false;

  codigoValidado: boolean = false;

  visible: boolean = true;

  fileBase64: string | ArrayBuffer | null = null;

  fileError: string | null = null;
  
  openIncorrectDataForm(): void {
    this.showIncorrectDataForm = true;
  }

  constructor(public modalRef: BsModalRef,
    public aspiranteService: AspiranteService,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minDate1 = new Date(currentYear - 90, currentMonth, currentDay); 
      this.maxDate1 = new Date(currentYear - 14, currentMonth, currentDay);
      this.minDate2 = new Date(currentYear - 69, currentMonth, currentDay);
      this.maxDate2 = new Date(currentYear , currentMonth, currentDay);
      this.minDate3 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate3 = new Date(currentYear - 14, currentMonth, currentDay);
      this.obtenerUsuarioActual();
      
      setTimeout(() => {
        this.visible = false;
      }, 12000);
     }

     ngOnInit(): void {
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@gmail.com')]],
        validationCode: [{value: '', disabled: true}, [Validators.required, Validators.minLength(6)]]
      });
    
      // Suscribirse a cambios en el campo de correo electrónico
      this.form.get('email')?.valueChanges.subscribe(() => {
        // Restablecer emailDuplicado a falso cuando el usuario cambie el correo
        this.emailDuplicado = false;
        // Opcionalmente, podrías querer restablecer también el estado de emailVerified
        this.emailVerified = false;
      });
     

      this.firstFormGroup1 = this._formBuilder.group({
        datosCorrectos: ['', Validators.required]
      });
  
      this.secondFormGroup2 = this._formBuilder.group({
        declaracion: [''],  // Campo para la declaración jurada
        confirmacion: ['', [Validators.required, Validators.pattern(/^ACEPTO$/)]],
        cohorte: [''],
        pnfCarrera: [''],
        multipleCarrera: [''],
        nombresApellidos: [''],
        primerNombre: ['', Validators.required], 
        segundoNombre: [''],
        primerApellido: ['', Validators.required],
        segundoApellido: [''],
        file: [null, Validators.required],
      }, { validator: atLeastOneCheckboxSelectedValidator });
  
      this.thirdFormGroup3 = this._formBuilder.group({
        email: [{ value: this.estudianteBase.email, disabled: this.estudianteBase.estatus_migra === 5 }, 
          [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@gmail.com')]],
        validationCode: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]]
      });

       // Suscribirse a cambios en el campo de correo electrónico
       this.thirdFormGroup3.get('email')?.valueChanges.subscribe(() => {
        // Restablecer emailDuplicado a falso cuando el usuario cambie el correo
        this.emailDuplicado = false;
        // Opcionalmente, podrías querer restablecer también el estado de emailVerified
        this.emailVerified = false;
      });

      this.firstFormGroup1.get('datosCorrectos')?.valueChanges.subscribe(() => {
        this.updateValidationsBasedOnDataCorrectness(); // Actualiza las validaciones según sea necesario
      });

      // Observar cambios en el checkbox 'nombresApellidos'
        this.secondFormGroup2.get('nombresApellidos')?.valueChanges.subscribe(value => {
          this.updateNameFieldsValidation(value);
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
      default: return 'cilBan';
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  findNac(){
    this.aspiranteService.getNac().subscribe(
      (result: any) => {
          this.nacs = result;
    }
    );
  }
  
  findGen(){
    this.aspiranteService.getGen().subscribe(
      (result: any) => {
          this.genero = result;
    }
    );
  }
  
  
  findEdoCivil(){
    this.aspiranteService.getEdoCivil().subscribe(
      (result: any) => {
          this.edocivil = result;
    }
    );
  }
  
  findGrupoSan(){
    this.aspiranteService.getGrupoSan().subscribe(
      (result: any) => {
          this.gruposan = result;
    }
    );
  }

  onStepChange(event: any) {
    if (event.selectedIndex === 2 && this.estudianteBase.estatus_migra === 5) {
      this.sendOtp();
    }
  }

  sendOtp() {
    const email = this.estudianteBase.email;
    const cedula = this.estudianteBase.cedula;
    const nombre = this.estudianteBase.nombre_completo;
    const nombrecorto = this.estudianteBase.nombre_corto;
    this.SpinnerService.show();
    this.controlestudiosService.generaOtpVerificado({ email: email, cedula: cedula, nombre: nombre, nombrecorto: nombrecorto }).subscribe({
      next: (otpResponse) => {
        // Manejar la respuesta del servicio generaOtp
        if(otpResponse.success) {
          // Si el OTP se generó y envió correctamente
          this.notifyService.showSuccess('Se ha enviado un código de validación a tu correo electrónico, tiene una duración de 5 minutos.');
          this.thirdFormGroup3.get('validationCode')?.enable(); // Habilitar el campo de código de validación

          this.SpinnerService.hide();
        } else {
          // Manejar caso de fallo en la generación/envío del OTP
          this.notifyService.showError('No se pudo generar o enviar el OTP.');
          this.SpinnerService.hide();
          this.closeModal();
        }
      },
      error: (error) => {
       this.notifyService.showError(`Ha ocurrido un error al generar/enviar el OTP: ${error}`);
      }
    });
  }

  toUpperCase(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase();
    this.secondFormGroup2.get(controlName)?.setValue(value);
  }
  

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileSizeInMB = file.size / (1024 * 1024);
      const maxFileSizeInMB = 2; // Tamaño máximo del archivo en MB

      if (file.type !== 'image/jpeg') {
        this.fileError = 'Solo se permiten archivos JPG.';
        this.fileBase64 = null;
        this.secondFormGroup2.patchValue({ file: null });
        return;
      }

      if (fileSizeInMB > maxFileSizeInMB) {
        this.fileError = `El archivo es demasiado grande. El tamaño máximo permitido es ${maxFileSizeInMB} MB.`;
        this.fileBase64 = null;
        this.secondFormGroup2.patchValue({ file: null });
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileBase64 = reader.result;
        this.fileError = null;
        this.secondFormGroup2.patchValue({
          file: this.fileBase64
        });
      };
    }
  }

  convertirFecha(fechaStr: string): Date {
    if (!fechaStr) { // Esto comprueba si fechaStr es null, undefined, o una cadena vacía
      return new Date(); // O cualquier otra fecha por defecto que desees usar
    }
  
    const partes = fechaStr.split('-');
    if (partes.length === 3) {
      const fecha = new Date(parseInt(partes[2], 10), parseInt(partes[1], 10) - 1, parseInt(partes[0], 10));
      return fecha;
    }
    return new Date(); // Retorna una fecha por defecto si el formato no es correcto
  }

  enviarDatos() {
    this.SpinnerService.show();
    if (this.firstFormGroup.valid) {
      this.controlestudiosService.actualizarDatos(this.firstFormGroup.value).subscribe({
        next: (response: RespuestaServidor) => {
          if (response.success) {
            this.closeModal();
            this.SpinnerService.hide();
            this.notifyService.showSuccess('Los datos del estudiante han sido actualizados correctamente.');
            
          } else if (response.error) {
            
            this.closeModal();
            this.SpinnerService.hide();
            this.notifyService.showError(`Error al actualizar los datos: ${response.error}`);
          }
        },
        error: (error) => {
          this.notifyService.showError('Error al enviar los datos al servidor.');
          this.closeModal();
        }
      });
  }
}

obtenerUsuarioActual() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  this.usrsice = currentUser.usrsice;
}

verifyEmail(): void {
  this.SpinnerService.show();
  const email = this.form.get('email')?.value;
  const cedula = this.estudianteBase.cedula;
  const nombre = this.estudianteBase.nombre_completo;
  const nombrecorto = this.estudianteBase.nombre_corto;
  if (this.form.get('email')?.valid) {
    this.controlestudiosService.verificarEmailExist(this.form.value.email).subscribe({
      next: (response) => {
        if (response.exists) {
          this.emailDuplicado = true;
          this.form.get('email')?.setErrors({ 'emailDuplicado': true });
          this.SpinnerService.hide();
        } else {
         // El correo no existe, es válido para proceder con la generación del OTP
         this.emailDuplicado = false;
         // Ahora invocamos el servicio para generar el OTP
         this.SpinnerService.show();
         this.controlestudiosService.generaOtp({ email: email, cedula: cedula, nombre: nombre, nombrecorto: nombrecorto }).subscribe({
           next: (otpResponse) => {
             // Manejar la respuesta del servicio generaOtp
             if(otpResponse.success) {
               // Si el OTP se generó y envió correctamente
               this.notifyService.showSuccess('Se ha enviado un código de validación a tu correo electrónico, tiene una duración de 5 minutos.');
               this.emailVerified = true;
               this.form.get('validationCode')?.enable(); // Habilitar el campo de código de validación
               this.form.get('email')?.disable(); // Deshabilitar el campo de correo y el botón de verificar
               this.SpinnerService.hide();
             } else {
               // Manejar caso de fallo en la generación/envío del OTP
               this.notifyService.showError('No se pudo generar o enviar el OTP.');
               this.SpinnerService.hide();
               this.closeModal();
             }
           },
           error: (error) => {
            this.notifyService.showError(`Ha ocurrido un error al generar/enviar el OTP: ${error}`);
           }
         });
         
       }
      },
      error: (error) => {
        this.notifyService.showError(`Ha ocurrido un error durante la verificación del correo: ${error}`);
      }
    });
  }
}

validateCode(): void {
  this.SpinnerService.show(); // Muestra un spinner de carga
  const email = this.form.get('email')?.value;
  const codigo = this.form.get('validationCode')?.value;
  const cedula = this.estudianteBase.cedula;
  const nombre = this.estudianteBase.nombre_completo;
  const nombrecorto = this.estudianteBase.nombre_corto;
  const estatus_migra = this.estudianteBase.estatus_migra;

  // Suponiendo que `validarOTP` es un método en tu servicio que espera un objeto con email, codigo, y cedula
  this.controlestudiosService.validarOTP({ email, codigo, cedula, nombre, nombrecorto, estatus_migra }).subscribe({
    next: (response) => {
      this.SpinnerService.hide(); // Oculta el spinner de carga
      if (response.codigoEsValido) {
        // Código es válido
        this.notifyService.showSuccess('Código validado exitosamente. Hemos registrado tu solicitud de revisión de datos, revisa tu correo electrónico');
        this.closeModal();
        // Aquí puedes realizar acciones adicionales basadas en la validación exitosa
      } else {
        // Código no es válido
        this.notifyService.showError('El código no es valido o ha expirado.');
        
      }
    },
    error: (error) => {
      this.SpinnerService.hide(); // Oculta el spinner de carga en caso de error
      console.error("Error al validar el código:", error);
    }
  });
}


verifyEmail2(): void {
  this.SpinnerService.show();
  const email = this.thirdFormGroup3.get('email')?.value;
  const cedula = this.estudianteBase.cedula;
  const nombre = this.estudianteBase.nombre_completo;
  const nombrecorto = this.estudianteBase.nombre_corto;
  if (this.thirdFormGroup3.get('email')?.valid) {
    this.controlestudiosService.verificarEmailExist(this.thirdFormGroup3.value.email).subscribe({
      next: (response) => {
        if (response.exists) {
          this.emailDuplicado = true;
          this.thirdFormGroup3.get('email')?.setErrors({ 'emailDuplicado': true });
          this.SpinnerService.hide();
        } else {
         // El correo no existe, es válido para proceder con la generación del OTP
         this.emailDuplicado = false;
         // Ahora invocamos el servicio para generar el OTP
         this.SpinnerService.show();
         this.controlestudiosService.generaOtp({ email: email, cedula: cedula, nombre: nombre, nombrecorto: nombrecorto }).subscribe({
           next: (otpResponse) => {
             // Manejar la respuesta del servicio generaOtp
             if(otpResponse.success) {
               // Si el OTP se generó y envió correctamente
               this.notifyService.showSuccess('Se ha enviado un código de validación a tu correo electrónico, tiene una duración de 5 minutos.');
               this.emailVerified = true;
               this.thirdFormGroup3.get('validationCode')?.enable(); // Habilitar el campo de código de validación
               this.thirdFormGroup3.get('email')?.disable(); // Deshabilitar el campo de correo y el botón de verificar

               this.SpinnerService.hide();
             } else {
               // Manejar caso de fallo en la generación/envío del OTP
               this.notifyService.showError('No se pudo generar o enviar el OTP.');
               this.SpinnerService.hide();
               this.closeModal();
             }
           },
           error: (error) => {
            this.notifyService.showError(`Ha ocurrido un error al generar/enviar el OTP: ${error}`);
           }
         });
         
       }
      },
      error: (error) => {
        this.notifyService.showError(`Ha ocurrido un error durante la verificación del correo: ${error}`);
      }
    });
  }
}

validateCode2(): void {
  this.SpinnerService.show(); // Muestra un spinner de carga
  const allData = {
    ...this.firstFormGroup1.value,
    ...this.secondFormGroup2.value,
    ...this.thirdFormGroup3.value,
    cedula: this.estudianteBase.cedula,
    nombre: this.estudianteBase.nombre_completo,
    nombrecorto: this.estudianteBase.nombre_corto,
    estatus_migra: this.estudianteBase.estatus_migra,
    email: this.thirdFormGroup3.get('email')?.value,
    codigo: this.thirdFormGroup3.get('validationCode')?.value,
  };

  console.log(allData);

  // Suponiendo que `validarOTP` es un método en tu servicio que espera un objeto con email, codigo, y cedula
  this.controlestudiosService.validarOTP2(allData).subscribe({
    next: (response) => {
      this.SpinnerService.hide(); // Oculta el spinner de carga
      if (response.codigoEsValido) {
        if (response.datosCorrectos === 'si') {
          this.notifyService.showSuccess('Código validado exitosamente. Por favor ingresa nuevamente tu número de documento de identidad para iniciar el proceso.');
        } else if (response.datosCorrectos === 'no') {
          this.notifyService.showSuccess('Código validado exitosamente. Hemos registrado tu solicitud de revisión de datos, revisa tu correo electrónico.');
        }
        this.closeModal();
        // Aquí puedes realizar acciones adicionales basadas en la validación exitosa
      } else {
        // Código no es válido
        this.notifyService.showError('El código no es valido o ha expirado.');
      }
    },
    error: (error) => {
      this.SpinnerService.hide(); // Oculta el spinner de carga en caso de error
      console.error("Error al validar el código:", error);
    }
  });
}


onFormSubmit() {
  // Implementa la lógica para finalizar la migración
  console.log('Formulario enviado');
}


updateValidationsBasedOnDataCorrectness(): void {
  const datosCorrectos = this.firstFormGroup1.get('datosCorrectos')?.value;

  if (datosCorrectos === 'si') {
    // Si los datos son correctos, configura las validaciones para 'confirmacion'
    this.secondFormGroup2.get('confirmacion')?.setValidators([Validators.required, Validators.pattern(/^ACEPTO$/)]);
    // Limpia las validaciones para los campos que no son necesarios
    this.secondFormGroup2.get('primerNombre')?.clearValidators();
    this.secondFormGroup2.get('primerApellido')?.clearValidators();
    this.secondFormGroup2.get('file')?.clearValidators();
  } else if (datosCorrectos === 'no') {
    // Si los datos son incorrectos, limpia las validaciones para 'confirmacion'
    this.secondFormGroup2.get('confirmacion')?.clearValidators();
    // Asegúrate de que los campos sean requeridos
    this.secondFormGroup2.get('primerNombre')?.clearValidators();
    this.secondFormGroup2.get('primerApellido')?.clearValidators();
  }

  // Actualiza los estados de validación y recalcula el estado del formulario
  this.secondFormGroup2.get('confirmacion')?.updateValueAndValidity();
  this.secondFormGroup2.get('primerNombre')?.updateValueAndValidity();
  this.secondFormGroup2.get('primerApellido')?.updateValueAndValidity();
  this.secondFormGroup2.get('file')?.updateValueAndValidity();
}

updateNameFieldsValidation(isChecked: boolean): void {
  if (isChecked) {
    this.secondFormGroup2.get('primerNombre')?.setValidators(Validators.compose([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]));
    this.secondFormGroup2.get('primerApellido')?.setValidators(Validators.compose([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]));
  } else {
    this.secondFormGroup2.get('primerNombre')?.clearValidators();
    this.secondFormGroup2.get('primerApellido')?.clearValidators();
    this.secondFormGroup2.get('file')?.clearValidators();
  }

  // Actualiza los estados de validación y recalcula el estado del formulario
  this.secondFormGroup2.get('primerNombre')?.updateValueAndValidity();
  this.secondFormGroup2.get('primerApellido')?.updateValueAndValidity();
}

}
