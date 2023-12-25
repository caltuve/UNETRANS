import { Injectable, Output, EventEmitter} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SessionExpiryModalComponent } from './../session-expiry-modal/session-expiry-modal.component'

import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service';


@Injectable({
  providedIn: "root",
})
export class LoginService {

  public token!: string;
    private inactivityTimer: any;
  private inactivityTime = 600 * 1000; // 20 minutos
  private warningTime = 10 * 1000; // 10 segundos antes de expirar

  private appElement: HTMLElement | null;
  private boundResetInactivityTimer: () => void;

  url:string  = environment.url; 
 @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
 constructor(private http: HttpClient,
  private modalService: BsModalService,
  public router: Router,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService) {
      this.appElement = document.querySelector('app-root');
    this.boundResetInactivityTimer = this.resetInactivityTimer.bind(this);
    }

  login(userlogin: any): Observable<any> {
    return this.http.post(`${this.url}loginsice.php`, JSON.stringify(userlogin)).pipe(
      map((userlogin: any) => {
        const token = userlogin.token; // Suponiendo que el token se devuelve en la propiedad "token" del objeto de respuesta
        sessionStorage.setItem('token', token);
        return userlogin;
      })
    );
  }

  //token
setToken(userlogin: string) {
  sessionStorage.setItem('token', userlogin);
  }
  getToken() {
  return sessionStorage.getItem('token');
  }
  deleteToken() {
    sessionStorage.removeItem('token');
  }
  deleteSession() {
    sessionStorage.removeItem('currentUser');
  }
  isLoggedIn() {
  const usertoken = this.getToken();
  if (usertoken != null) {
  return true
  }
  return false;
  }

  getMenuSice(usrsice: any): Observable<any>{
    return this.http.post(`${this.url}get_menu_sice.php`, JSON.stringify(usrsice))}

  
    startInactivityTimer() {
      if (!this.appElement) return;

  this.resetInactivityTimer();
  this.appElement.addEventListener('mousemove', this.boundResetInactivityTimer);
  this.appElement.addEventListener('keydown', this.boundResetInactivityTimer);
    }
  
    resetInactivityTimer() {
      clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => this.onSessionExpiring(), this.inactivityTime - this.warningTime);
    }
  
    private onSessionExpiring() {
      const config = {
        class: 'modal-dialog-centered', // Esta clase ayuda a centrar el modal
        ignoreBackdropClick: true, // Evita cerrar el modal al hacer clic fuera
        keyboard: false             // Evita cerrar el modal con la tecla ESC
      };
      
      this.modalService.show(SessionExpiryModalComponent, config);
    }
  
    // Método para extender la sesión (necesita implementación)
    extendSession() {
      this.resetInactivityTimer();
    }

    stopInactivityTimer() {
      if (!this.appElement) return;

  this.appElement.removeEventListener('mousemove', this.boundResetInactivityTimer);
  this.appElement.removeEventListener('keydown', this.boundResetInactivityTimer);
  clearTimeout(this.inactivityTimer);
    }
  
    logout() {
      this.SpinnerService.show(); 
      this.deleteToken();
      this.deleteSession();
      this.stopInactivityTimer();
      this.notifyService.showSuccess('Cierre de sesión exitoso!');
      this.SpinnerService.hide();
      this.router.navigateByUrl('/login');  
      }

      logoutInactivity() {
        this.stopInactivityTimer();
        this.SpinnerService.show(); 
        this.deleteToken();
        this.deleteSession();
        this.notifyService.showSuccess('Cierre de sesión por inactividad!');
        this.SpinnerService.hide();
        this.router.navigateByUrl('/login');  
        }
    
}