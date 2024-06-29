import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { BsModalService } from 'ngx-bootstrap/modal';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmExitGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(private modalService: BsModalService) {}

  canDeactivate(component: any): Promise<boolean> | boolean {
    if (component.canDeactivate) {
      return component.canDeactivate(); // Asegúrate de que esta llamada es correcta
    }
    return true; // Si no hay método canDeactivate, permite la navegación por defecto
  }
  
}
