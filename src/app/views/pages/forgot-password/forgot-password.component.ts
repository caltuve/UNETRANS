import { LoginService } from '../login/login.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  @ViewChild('myModal') public myModal: ModalDirective;
  usrsice: string;
  password: string;
  usr = null;
  usrlogueado: any[] = [];

  constructor(private _formBuilder: FormBuilder,
    public loginService: LoginService,
    public router: Router,
    private SpinnerService: NgxSpinnerService,
    private notifyService: NotificacionService
  ) {

  }

  verify_recovery() {
    this.SpinnerService.show();
    const userlogin = { usrsice: this.usrsice, password: this.password };
    this.loginService.verify_user_rec_pass(userlogin).subscribe((data) => {
      this.usrlogueado = data;
      if (data['success'] === false) {
        this.notifyService.showError2(data['message']);
        this.recoveryFormGroup.reset();
        this.SpinnerService.hide();
        this.router.navigate(['/login']);
      } else {
        this.notifyService.showSuccess(`¡Revise la bandeja de entrada del siguiente correo: ${data['correo']}, para realizar la autogestión de su contraseña!`);
        this.recoveryFormGroup.reset();
        this.SpinnerService.hide();
      }
    }, error => {
      this.notifyService.showError2('Ha ocurrido un error inesperado.');
      this.recoveryFormGroup.reset();
      this.SpinnerService.hide();
    });
  }


  recoveryFormGroup = this._formBuilder.group({
    usrsice: ['', [Validators.required, Validators.pattern('^[VEP]{1}[0-9]{6,8}$')]],

  });
}
