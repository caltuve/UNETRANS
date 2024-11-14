import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators,  AbstractControl, ValidatorFn  } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AspiranteService } from '../../../views/aspirante/aspirante.service';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'


export function gmailDomainValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (email && typeof email === 'string') {
      const lowerCaseEmail = email.toLowerCase();
      if (lowerCaseEmail.endsWith('@gmail.com')) {
        return null; // El correo electrónico es válido
      }
    }
    return { gmailDomain: true }; // El correo electrónico no es válido
  };
}

@Component({
  selector: 'app-act-contacto-modal',
  templateUrl: './act-contacto-modal.component.html',
  styleUrls: ['./act-contacto-modal.component.scss']
})
export class ActContactoModalComponent {

  @Output() actualizacionCompleta = new EventEmitter<boolean>();
  formContacto: FormGroup;
  emailDuplicado: boolean = false;
  codigoValidado: boolean = false;
  correoVerificado: boolean = false; // Estado de verificación del correo
  emailVerified: boolean = false;
  opermovil: any []= [];
  operadoras: any []= [];
  tipoContacto: string; // Declarar el tipo de contacto (habitacion, celular o email)
  contacto: any; // Asegúrate de declarar la propiedad 'contacto'

  usrsice: string;
  nombre_completo: string;
  nombre_corto: string;
  cedula: number;


  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    public aspiranteService: AspiranteService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
  ) {
    this.formContacto = this.fb.group({
      numero: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
      operadora: [''],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.obtenerUsuarioActual();
    if (this.tipoContacto === 'habitacion' || this.tipoContacto === 'celular') {
      this.formContacto = this.fb.group({
        operadora: ['', Validators.required],
        numero: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
        email: ['']
      });
      this.tipoContacto === 'habitacion' ? this.findOperRes() : this.findOperMovil();
    } else if (this.tipoContacto === 'email') {
      this.formContacto = this.fb.group({
        email: ['', [Validators.required, Validators.email, gmailDomainValidator()]],
        validationCode: [{value: '', disabled: true}, [Validators.required, Validators.minLength(6)]]
      });
    }

    this.formContacto.get('email')?.valueChanges.subscribe(() => {
      // Restablecer emailDuplicado a falso cuando el usuario cambie el correo
      this.emailDuplicado = false;
      // Opcionalmente, podrías querer restablecer también el estado de emailVerified
      this.emailVerified = false;
    });
  }
  
  obtenerUsuarioActual() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.usrsice = currentUser.usrsice;
    this.nombre_completo = currentUser.nombre_completo;
    this.nombre_corto = currentUser.nombre_corto;
    this.cedula = currentUser.cedula;
  }
  

  findOperMovil(){
    this.aspiranteService.getOperMovil().subscribe(
      (result: any) => {
          this.operadoras = result;
    }
    );
  }

  findOperRes(){
    this.aspiranteService.getOperRes().subscribe(
      (result: any) => {
          this.operadoras = result;
    }
    );
  }

    // Verificación del correo electrónico
    verifyEmail(event: Event): void {
      event.stopPropagation(); // Detener la propagación del evento
    
      this.SpinnerService.show();
      const email = this.formContacto.get('email')?.value;
      const cedula = this.cedula;
      const nombre = this.nombre_completo;
      const nombrecorto = this.nombre_corto;
    
      if (this.formContacto.get('email')?.valid) {
        this.controlestudiosService.verificarEmailExist(this.formContacto.value.email).subscribe({
          next: (response) => {
            if (response.exists) {
              this.emailDuplicado = true;
              this.formContacto.get('email')?.setErrors({ 'emailDuplicado': true });
              this.SpinnerService.hide();
            } else {
              // El correo no existe, es válido para proceder con la generación del OTP
              this.emailDuplicado = false;
              // Ahora invocamos el servicio para generar el OTP
              this.SpinnerService.show();
              this.controlestudiosService.generaOtpChangeMail({ email: email, cedula: cedula, nombre: nombre, nombrecorto: nombrecorto }).subscribe({
                next: (otpResponse) => {
                  if (otpResponse.success) {
                    this.notifyService.showSuccess('Se ha enviado un código de validación a tu correo electrónico, tiene una duración de 5 minutos.');
                    this.emailVerified = true;
                    this.formContacto.get('validationCode')?.enable(); // Habilitar el campo de código de validación
                    this.formContacto.get('email')?.disable(); // Deshabilitar el campo de correo y el botón de verificar
                    this.SpinnerService.hide();
                  } else {
                    this.notifyService.showError('No se pudo generar o enviar el OTP.');
                    this.SpinnerService.hide();
                  }
                },
                error: (error) => {
                  this.notifyService.showError(`Ha ocurrido un error al generar/enviar el OTP: ${error}`);
                  this.SpinnerService.hide();
                }
              });
            }
          },
          error: (error) => {
            this.notifyService.showError(`Ha ocurrido un error durante la verificación del correo: ${error}`);
            this.SpinnerService.hide();
          }
        });
      }
    }
    


    validateCode(event: Event): void {
      this.SpinnerService.show(); // Muestra un spinner de carga
      const allData = {
        ...this.formContacto.value,
         cedula:  this.cedula,
       nombre:  this.nombre_completo,
       nombrecorto:  this.nombre_corto,
        email: this.formContacto.get('email')?.value,
        codigo: this.formContacto.get('validationCode')?.value,
      };
    
      console.log(allData);
    
      // Suponiendo que `validarOTP` es un método en tu servicio que espera un objeto con email, codigo, y cedula
      this.controlestudiosService.validarOTPChangeMail(allData).subscribe({
        next: (response) => {
          this.SpinnerService.hide(); // Oculta el spinner de carga
          if (response.codigoEsValido) {
            if (response.datosCorrectos === 'si') {
              this.notifyService.showSuccess('El código es válido y el correo ha sido actualizado correctamente.');
              
            } else if (response.datosCorrectos === 'no') {
              this.notifyService.showSuccess('Código validado exitosamente. Hemos registrado tu solicitud de revisión de datos, revisa tu correo electrónico.');
            }
            this.cerrarModal();
            
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



  cerrarModal(): void {
    this.bsModalRef.hide();
    this.actualizacionCompleta.emit(true);
  }

  guardarDatos(): void {
    if (this.formContacto.valid) {
      const updatedContactData = this.formContacto.value;
      // Lógica para guardar datos actualizados (llamar servicio, etc.)
      this.bsModalRef.hide(); // Cerrar el modal
    }
  }
}