import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { EstadoI, MunicipioI } from './crear-nuevo/model.interface';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from "rxjs";
import { tap, map} from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ControlEstudiosService {

  url:string  = environment.url; 
  url2 = 'https://petroapp-price.petro.gob.ve/price/';
  constructor(private http: HttpClient) { }

  estados: EstadoI []= [];
  municipios: MunicipioI []= [];

  getNac() {
    return this.http.get(`${this.url}nacionalidad.php`);
  }
  getDocsAcad() {
    return this.http.get(`${this.url}documentos.php`);
  }
  getGen() {
    return this.http.get(`${this.url}gen.php`);
  }
  getEdoCivil() {
    return this.http.get(`${this.url}edocivil.php`);
  }
  getGrupoSan() {
    return this.http.get(`${this.url}gruposan.php`);
  }
  getEtnia() {
    return this.http.get(`${this.url}etnia.php`);
  }
  getIndResp() {
    return this.http.get(`${this.url}indresp.php`);
  }
  getDiscapacidad() {
    return this.http.get(`${this.url}discapacidad.php`);
  }
  getTipovia() {
    return this.http.get(`${this.url}tipovia.php`);
  }
  getTipoNucleo() {
    return this.http.get(`${this.url}tiponucleo.php`);
  }
  getTipoConstruccion() {
    return this.http.get(`${this.url}tipoconstruccion.php`);
  }
  getCarreras() {
    return this.http.get(`${this.url}carreras.php`);
  }

  getCarrerasForDep(usrsice: any): Observable<any>{
    return this.http.get(`${this.url}carrerasfordep.php?usrsice=${usrsice}`);
  }
  getOperMovil() {
    return this.http.get(`${this.url}opermov.php`);
  }
  getOperRes() {
    return this.http.get(`${this.url}operres.php`);
  }
  // getEstados() {
  //   return this.http.get(`${this.url}estados.php`);
  // }
  // getMunicipios() {
  //   return this.http.get(`${this.url}municipios.php`);
  // }

  obtenerPetro(){
    return this.http.post(`${this.url2}`,{
      coins: [ "PTR" ],
      fiats: [ "Bs"]
      })
    };

  getEstados(): Observable<EstadoI[]> {
    return this.http.get<EstadoI[]>(`${this.url}estados.php` );
}

getMunicipioOfSelectedEstado(selectedEstadoId: string): Observable<any>{
  return this.http.get(`${this.url}municipios.php?codestado=${selectedEstadoId}`)
}

getParroquiaOfSelectedMunicipio(selectedMunicipioId: string): Observable<any>{
  return this.http.get(`${this.url}parroquias.php?codmuni=${selectedMunicipioId}`)
}

getPlantelOfSelectedParroquia(selectedParroquiaId: string): Observable<any>{
  return this.http.get(`${this.url}centro_educativo.php?codparr=${selectedParroquiaId}`)
}

getBachiller() {
  return this.http.get(`${this.url}tipo_bachiller.php`);
}

getModIngreso() {
  return this.http.get(`${this.url}modalidad_ingreso.php`);
}

getTurnos() {
  return this.http.get(`${this.url}turnos.php`);
}

getAspirantes() {
  return this.http.get(`${this.url}resumen_opsu_dace.php`);
}

getAspirantesConvenio() {
  return this.http.get(`${this.url}resumen_convenio_dace.php`);
}

getAutopostulado() {
  return this.http.get(`${this.url}resumen_autopostulados_dace.php`);
}

getReincorporacion() {
  return this.http.get(`${this.url}resumen_reincorporacion_dace.php`);
}
  getEstudiante() {
    return this.http.get(`${this.url}dat_estudiante.php`);
  }

  getProcesosCalendar() {
    return this.http.get(`${this.url}calendar_procesos.php`);
  }

  getPeriodos() {
    return this.http.get(`${this.url}periodos.php`);
  }

  getPeriodicidad() {
    return this.http.get(`${this.url}periodicidad.php`);
  }

  getTrayectos() {
    return this.http.get(`${this.url}trayectos.php`);
  }

  getTrayectosAll() {
    return this.http.get(`${this.url}trayectos_all.php`);
  }

  getResolucion() {
    return this.http.get(`${this.url}resolucion.php`);
  }

  getEmpConvenio() {
    return this.http.get(`${this.url}emp_convenio.php`);
  }

  createPersonConvenio(datospersona : any): Observable<any>{
    return this.http.post(`${this.url}crearpersonaconvenio.php`, JSON.stringify(datospersona))
  }

  procesarAutopostulado(datospersona : any): Observable<any>{
    return this.http.post(`${this.url}procesarAutopostulacion.php`, JSON.stringify(datospersona))
  }

  procesarReincorporacionDace(datospersona : any): Observable<any>{
    return this.http.post(`${this.url}procesarReincorporacionDace.php`, JSON.stringify(datospersona))
  }

  createPeriodoAcademico(datospersona : any): Observable<any>{
    return this.http.post(`${this.url}crearperiodo.php`, JSON.stringify(datospersona))
  }

  getOfertaAcademica(carreraSeleccionada: string, periodoSeleccionado:string): Observable<any>{
    return this.http.get(`${this.url}resumen_cupos_dace.php?pnf=${carreraSeleccionada}&periodo=${periodoSeleccionado}`);
  }

  getDetailActa(actaId: any): Observable<any>{
    return this.http.get(`${this.url}detalle_acta.php?acta=${actaId}`);
  }

  getPeriodoOfPnfSeleccionado(carreraSeleccionada: string): Observable<any>{
    return this.http.get(`${this.url}cupos_periodos.php?pnf=${carreraSeleccionada}`)
  }

  getTipoSeccion() {
    return this.http.get(`${this.url}tipo_seccion.php`);
  }

  createSeccion(datospersona : any): Observable<any>{
    return this.http.post(`${this.url}crearseccion.php`, JSON.stringify(datospersona))
  }

  findPersona(dato: any){
    return this.http.post(`${this.url}findpersona.php`, JSON.stringify(dato));
  }

  findPersonaReincorporacion(dato: any): Observable<any>{
    return this.http.post(`${this.url}findpersona_reincorpora.php`, JSON.stringify(dato));
  }

  pushNotify(identificacion: any): Observable<any>{
    return this.http.post(`${this.url}enviacorreo.php`, JSON.stringify(identificacion))
  }

  crearPlantel(datosplantel : any): Observable<any>{
    return this.http.post(`${this.url}crearplantel.php`, JSON.stringify(datosplantel))
  }
}
