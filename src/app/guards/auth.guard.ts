import { NotificacionService } from './../notificacion.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private notifyService : NotificacionService) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('token');
    if (token) {
      return true;
    } else {
      this.notifyService.showWarning('Usuario no autenticado!');
      this.router.navigate(['/login']);
      return false;
    }
  }
}