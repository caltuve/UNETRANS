import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }

  private datosPrograma: any;
  private menciones: any;

  setDatosPrograma(datosPrograma: any) {
    this.datosPrograma = datosPrograma;
  }

  getDatosPrograma() {
    return this.datosPrograma;
  }

  setMenciones(menciones: any) {
    this.menciones = menciones;
  }

  getMenciones() {
    return this.menciones;
  }
}
