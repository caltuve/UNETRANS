import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AspiranteService } from '../../aspirante/aspirante.service';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { FormBuilder, FormGroup, ValidationErrors, Validators,  AbstractControl, ValidatorFn  } from '@angular/forms';
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
  selector: 'app-conf-email-aspirante',
  templateUrl: './conf-email-aspirante.component.html',
  styleUrls: ['./conf-email-aspirante.component.scss']
})
export class ConfEmailAspiranteComponent {

  form: FormGroup;

  thirdFormGroup3: FormGroup;

  estudianteBase: any; // Ajusta según el tipo de dato de tu estudiante

  emailDuplicado: boolean = false;

  codigoValidado: boolean = false;

  usrsice: string;

  email: string = '';
  emailVerified: boolean = false;
  validationCode: string = ''; // Almacena el código de validación introducido

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
      this.obtenerUsuarioActual();
     }

     ngOnInit(): void {
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email, gmailDomainValidator()]],
        validationCode: [{value: '', disabled: true}, [Validators.required, Validators.minLength(6)]]
      });
    
      // Suscribirse a cambios en el campo de correo electrónico
      this.form.get('email')?.valueChanges.subscribe(() => {
        // Restablecer emailDuplicado a falso cuando el usuario cambie el correo
        this.emailDuplicado = false;
        // Opcionalmente, podrías querer restablecer también el estado de emailVerified
        this.emailVerified = false;
      });
     

  
      this.thirdFormGroup3 = this._formBuilder.group({
        email: [{ value: this.estudianteBase.email, disabled: this.estudianteBase.estatus_migra === 5 }, 
          [Validators.required, Validators.email, gmailDomainValidator()]],
        validationCode: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]]
      });

       // Suscribirse a cambios en el campo de correo electrónico
       this.thirdFormGroup3.get('email')?.valueChanges.subscribe(() => {
        // Restablecer emailDuplicado a falso cuando el usuario cambie el correo
        this.emailDuplicado = false;
        // Opcionalmente, podrías querer restablecer también el estado de emailVerified
        this.emailVerified = false;
      });

    }

    obtenerUsuarioActual() {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      this.usrsice = currentUser.usrsice;
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
             this.controlestudiosService.generaOtpOpsu({ email: email, cedula: cedula, nombre: nombre, nombrecorto: nombrecorto }).subscribe({
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
      this.controlestudiosService.validarOTPOpsu(allData).subscribe({
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

    closeModal() {
      this.modalRef.hide();
    }

}
