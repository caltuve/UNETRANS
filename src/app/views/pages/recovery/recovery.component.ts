import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../login/login.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

interface SecurityQuestion {
  pregunta: string;
  id_pregunta: number;
}

interface SecurityQuestionsResponse {
  questions: SecurityQuestion[];
}


@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  fiveFormGroup: FormGroup;
  recoveryOption = new FormControl();

  token: string;
  usrsice: string;
  isValidToken: boolean = false;

  pass: string;
  confpass:string;

  otpError: boolean = false;

  questions: SecurityQuestion[] = [];

  questionControlNames: string[] = [];

  questsec: any[] = [];
  questsec1: any[] = [];
  questsec2: any[] = [];
  questsec3: any[] = [];

  constructor(private cd: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    public loginService: LoginService,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private notifyService: NotificacionService,
    public router: Router,
    ) {}

    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.token = params['token'];
        this.usrsice = params['usuario'];
        this.validateTokenAndUser();
      });

      this.initializeForm();
    
      this.fiveFormGroup.get('quest1')?.valueChanges.subscribe(value => {
        this.filterQuestions();
      });
    
      this.fiveFormGroup.get('quest2')?.valueChanges.subscribe(value => {
        this.filterQuestions();
      });
    
      this.fiveFormGroup.get('quest3')?.valueChanges.subscribe(value => {
        this.filterQuestions();
      });
    }

    validateTokenAndUser() {
      this.SpinnerService.show();
      if (this.token && this.usrsice) {
        this.loginService.validate_token_recovery(this.token, this.usrsice).subscribe({
          next: (response) => {
            if (response.isValid) {
              this.isValidToken = true;
              // El token es válido, inicializa cualquier configuración adicional del formulario aquí si es necesario
              //this.initializeForm();
              this.subscribeToFormChanges();
              this.notifyService.showSuccess('Token verificado correctamente. Puede iniciar el proceso de autogestión.');
              this.SpinnerService.hide();
            } else {
              this.isValidToken = false;
              this.notifyService.showError('El token no es válido o ha expirado. Por favor, solicite una nueva recuperación.');
              this.router.navigate(['/forgot-password']);
              this.SpinnerService.hide();
            }
          },
          error: (error) => {
            this.isValidToken = false;
            this.notifyService.showError('Error al verificar el token. Intente de nuevo.');
            this.router.navigate(['/forgot-password']);
            this.SpinnerService.hide();
          }
        });
      } else {
        this.notifyService.showError('Token o usuario no proporcionado.');
        this.router.navigate(['/forgot-password']);
        this.SpinnerService.hide();
      }
    }
    
    private initializeForm() {
      this.firstFormGroup = this._formBuilder.group({
        recoveryOption: ['', Validators.required]
      });
    
      this.secondFormGroup = this._formBuilder.group({
        otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        questionsFormArray: this._formBuilder.array([])
      });
    
      this.fiveFormGroup = this._formBuilder.group({
        pass: ['', Validators.required],
        confpass: ['', Validators.required],
        quest1: ['', Validators.required],
        answ1: ['', Validators.required],
        quest2: ['', Validators.required],
        answ2: ['', Validators.required],
        quest3: ['', Validators.required],
        answ3: ['', Validators.required]
      });
    
      this.firstFormGroup.get('recoveryOption')?.valueChanges.subscribe(value => {
        if (value === 'password') {
          this.fiveFormGroup.get('pass')?.setValidators([Validators.required]);
          this.fiveFormGroup.get('confpass')?.setValidators([Validators.required]);
          this.fiveFormGroup.get('quest1')?.clearValidators();
          this.fiveFormGroup.get('answ1')?.clearValidators();
          this.fiveFormGroup.get('quest2')?.clearValidators();
          this.fiveFormGroup.get('answ2')?.clearValidators();
          this.fiveFormGroup.get('quest3')?.clearValidators();
          this.fiveFormGroup.get('answ3')?.clearValidators();
        } else if (value === 'securityQuestions') {
          this.fiveFormGroup.get('pass')?.clearValidators();
          this.fiveFormGroup.get('confpass')?.clearValidators();
          this.fiveFormGroup.get('quest1')?.setValidators([Validators.required]);
          this.fiveFormGroup.get('answ1')?.setValidators([Validators.required]);
          this.fiveFormGroup.get('quest2')?.setValidators([Validators.required]);
          this.fiveFormGroup.get('answ2')?.setValidators([Validators.required]);
          this.fiveFormGroup.get('quest3')?.setValidators([Validators.required]);
          this.fiveFormGroup.get('answ3')?.setValidators([Validators.required]);
        }
        this.fiveFormGroup.updateValueAndValidity();
      });
    }
  
    get questionsFormArray(): FormArray {
      return this.secondFormGroup.get('questionsFormArray') as FormArray;
    }
  
    private subscribeToFormChanges() {
      this.firstFormGroup.get('recoveryOption')?.valueChanges.subscribe(value => {
        this.updateSecondStepContent(value);
      });
    }
  
    updateSecondStepContent(value: string) {
      const formArray = this.secondFormGroup.get('questionsFormArray') as FormArray;
      const otpControl = this.secondFormGroup.get('otp');
      formArray.clear();
      if (value === 'password') {
        otpControl?.clearValidators();
        otpControl?.updateValueAndValidity();
        this.loadSecurityQuestions();
      }
    }
  
    loadSecurityQuestions() {
      this.SpinnerService.show();
      this.loginService.getSecurityQuestions(this.usrsice).subscribe({
        next: (response: any) => {
          this.questions = response.questions;
          const formArray = this.questionsFormArray;
          formArray.clear();
  
          this.questions.forEach(question => {
            const group = this._formBuilder.group({
              answer: new FormControl('', Validators.required),
              idPregunta: new FormControl(question.id_pregunta)
            });
            formArray.push(group);
          });
          this.SpinnerService.hide();
  
          this.secondFormGroup.updateValueAndValidity();
        },
        error: (err) => console.error('Error al recuperar preguntas:', err)
      });
    }
  
    toUpper(event: any) {
      event.target.value = event.target.value.toUpperCase();
    }
  
    generateAndSendOTP(stepper: MatStepper) {
      const datos = {
        token: this.token,
        usrsice: this.usrsice
      };
  
      this.SpinnerService.show();
      this.loginService.generaOtp(datos).subscribe(
        response => {
          this.SpinnerService.hide();
          if (response.success) {
            stepper.next();
            this.notifyService.showSuccess('Se ha generado y enviado un Código de Verificación a tu correo electrónico, es válido solo por 5 minutos');
          } else {
            stepper.reset();
            this.notifyService.showError('Error al generar y enviar el Código de Verificación. Intente de nuevo.');
          }
        },
        error => {
          this.SpinnerService.hide();
          console.error('Error en la solicitud:', error);
          this.notifyService.showError('Error en la solicitud. Intente de nuevo.');
        }
      );
    }
  
    onStepChange(event: any, stepper: MatStepper) {
      if (event.selectedIndex === 1) {
        const recoveryOption = this.firstFormGroup.get('recoveryOption')?.value;
        if (recoveryOption === 'securityQuestions') {
          this.generateAndSendOTP(stepper);
        }
      }
    }
  

    validateOTP(stepper: MatStepper) {
      this.SpinnerService.show(); // Muestra un spinner de carga
      const allData = {
        token: this.token,
        usrsice: this.usrsice,
        codigo: this.secondFormGroup.get('otp')?.value
      };
       
      // Suponiendo que `validarOTP` es un método en tu servicio que espera un objeto con email, codigo, y cedula
      this.loginService.validarOTPSecQuest(allData).subscribe({
        next: (response) => {
          // Oculta el spinner de carga
          if (response.codigoEsValido) {
              this.notifyService.showSuccess('Código de validación correcto.');
              this.findQuestSec();
              stepper.next();
              this.SpinnerService.hide();
            //this.closeModal();
            // Aquí puedes realizar acciones adicionales basadas en la validación exitosa
          } else {
            // Código no es válido
            //stepper.reset();
            this.notifyService.showError('El código de validación no es válido o ha expirado.');
            this.SpinnerService.hide();
            //this.otpError = true;
          }
        },
        error: (error) => {
          this.SpinnerService.hide(); // Oculta el spinner de carga en caso de error
          console.error("Error al validar el código:", error);
        }
      });
    }

    
  handleNext(stepper: MatStepper) {
    const recoveryOption = this.firstFormGroup.get('recoveryOption')?.value;
    if (recoveryOption === 'password') {
      this.submitAnswers(stepper);
    } else if (recoveryOption === 'securityQuestions') {
      this.validateOTP(stepper);
    }
  }

    submitAnswers(stepper: MatStepper) {
      this.SpinnerService.show();
      if (this.secondFormGroup.valid) {
        const answers = this.questionsFormArray.value.map((question: any) => ({
          idPregunta: question.idPregunta,
          answer: question.answer.toUpperCase()
        }));

        //console.log(answers, this.usrsice)
    
        this.loginService.validateAnswers(answers, this.usrsice).subscribe({
          next: (response) => {
            if (response.isValid) {
              stepper.next(); // Avanzar al siguiente step si la validación es correcta
              this.notifyService.showSuccess('Respuestas correctas.');
            } else {
              this.notifyService.showError('Respuestas incorrectas, intenta nuevamente.');
              this.loadSecurityQuestions(); // Recargar preguntas para nuevo intento
              stepper.reset(); // Opcional, depende de si quieres resetear todo el stepper o solo recargar preguntas
            }
          },
          error: (err) => {
            console.error('Error al validar respuestas:', err);
            this.notifyService.showError('Error en el servidor, intenta nuevamente.');
          }
        });
        this.SpinnerService.hide();
      } else {
        this.notifyService.showError('Por favor, responde todas las preguntas antes de continuar.');
      }
    }

    findQuestSec() {
      this.loginService.getQuestSec().subscribe((result: any) => {
        this.questsec = result;
        this.filterQuestions();
      });
    }

    filterQuestions() {
      const quest1 = this.fiveFormGroup.get('quest1')?.value;
      const quest2 = this.fiveFormGroup.get('quest2')?.value;
    
      this.questsec1 = this.questsec;
      this.questsec2 = this.questsec.filter(q => q.descripcion !== quest1);
      this.questsec3 = this.questsec.filter(q => q.descripcion !== quest1 && q.descripcion !== quest2);
    }


    validacion1: boolean;
    validacion2: boolean;
    validacion3: boolean;
    validacion4: boolean;
    validacion5: boolean;
    validacion6: boolean;

    
  
    validarContrasena() {
      const cedula = this.usrsice.substring(1);
      this.validacion1 = this.fiveFormGroup.get('pass')?.value.length >= 8; // Validar que tenga al menos 8 caracteres
      this.validacion2 = /[+-.!_*$#]/.test(this.fiveFormGroup.get('pass')?.value); // Validar que tenga alguno de los caracteres especiales
      this.validacion4 = /\d/.test(this.fiveFormGroup.get('pass')?.value); // Validar que haya al menos un número
      this.validacion5 = /[A-Z]/.test(this.fiveFormGroup.get('pass')?.value); // Validar que haya al menos una letra mayúscula
      this.validacion6 = !this.fiveFormGroup.get('pass')?.value.includes(this.usrsice) && !this.fiveFormGroup.get('pass')?.value.includes(cedula);
      this.validarConfirmacion();
    }
    
    validarConfirmacion() {
      this.validacion3 = this.fiveFormGroup.get('pass')?.value !== null && this.fiveFormGroup.get('confpass')?.value !== null && this.fiveFormGroup.get('pass')?.value === this.fiveFormGroup.get('confpass')?.value;
    }
    
    

    changePassword() {
      // Suponiendo que `this.pass` es la nueva contraseña y `this.usrsice` es el identificador del usuario
      this.loginService.resetPassword(this.pass, this.usrsice).subscribe({
        next: (response) => {
          if (response.success) {
            this.notifyService.showSuccess(response.message);
            this.router.navigate(['/login']);
          } else {
            this.notifyService.showError(response.message);
            // Mostrar un mensaje al usuario sobre el error
            alert('Error al actualizar la contraseña: ' + response.message);
            this.router.navigate(['/forgot-password']);
          }
        },
        error: (error) => {
          console.error('Error en la comunicación con el servidor:', error);
          // Mostrar un mensaje al usuario sobre el error de comunicación
          alert('Error en la comunicación con el servidor. Por favor, intente nuevamente.'); 
          this.router.navigate(['/forgot-password']);
        }
      });
    }


    updateSecurityQuestions() {
      const questionsData = {
        usrsice: this.usrsice,
        questions: [
          { pregunta: this.fiveFormGroup.get('quest1')?.value, respuesta: this.fiveFormGroup.get('answ1')?.value },
          { pregunta: this.fiveFormGroup.get('quest2')?.value, respuesta: this.fiveFormGroup.get('answ2')?.value },
          { pregunta: this.fiveFormGroup.get('quest3')?.value, respuesta: this.fiveFormGroup.get('answ3')?.value }
        ]
      };

      //console.log(questionsData);
  
      this.loginService.updateSecurityQuestions(questionsData).subscribe(
        response => {
          if (response.success) {
            this.notifyService.showSuccess('Preguntas de seguridad actualizadas correctamente');
            this.router.navigate(['/login']);
          } else {
            this.notifyService.showError(response.message);
            this.router.navigate(['/forgot-password']);
          }
        },
        error => {
          this.notifyService.showError('Error al actualizar las preguntas de seguridad');
          this.router.navigate(['/forgot-password']);
          console.error(error);
        }
      );
    }
  

    isButtonDisabled(): boolean {
      const recoveryOption = this.firstFormGroup.get('recoveryOption')?.value;
      if (recoveryOption === 'password') {
        return !(this.fiveFormGroup.get('pass')?.valid && 
                 this.fiveFormGroup.get('confpass')?.valid &&
                 this.validacion1 && 
                 this.validacion2 && 
                 this.validacion3 && 
                 this.validacion4 && 
                 this.validacion5 && 
                 this.validacion6);
      } else if (recoveryOption === 'securityQuestions') {
        return !(this.fiveFormGroup.get('quest1')?.valid &&
                 this.fiveFormGroup.get('answ1')?.valid &&
                 this.fiveFormGroup.get('quest2')?.valid &&
                 this.fiveFormGroup.get('answ2')?.valid &&
                 this.fiveFormGroup.get('quest3')?.valid &&
                 this.fiveFormGroup.get('answ3')?.valid);
      }
      return true;
    }
    
  
}
