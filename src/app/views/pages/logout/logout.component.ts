import { LoginService } from './../login/login.service';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {


  constructor(private _formBuilder: FormBuilder,
    public loginService: LoginService,
    public router: Router,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService
) {

}

ngOnInit() {
  this.logout();
  
}


logout() {
this.SpinnerService.show(); 
this.loginService.deleteToken();
this.loginService.deleteSession()
this.notifyService.showSuccess('Cierre de sesión exitoso!');
this.SpinnerService.hide();
this.router.navigateByUrl('/login');

}
}
