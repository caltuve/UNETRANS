import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { EstadoI, MunicipioI } from '../control-estudios/crear-nuevo/model.interface';
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventserviceService {
  url:string  = environment.url; 
  url2 = 'https://petroapp-price.petro.gob.ve/price/';
  constructor(private http: HttpClient) { } 
  datosAspirante: any;
  materiasAspirante: any;
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

getMigraEstudiante(identificacion: any): Observable<any>{
    return this.http.post(`${this.url}verify_migraestudiante.php`, JSON.stringify(identificacion))
}

verifyVotante(identificacion: any): Observable<any>{
  return this.http.post(`${this.url}verify_votante.php`, JSON.stringify(identificacion))
}

getEstadisticas(): Observable<any> {
  return this.http.get(`${this.url}estadisticaep2024.php`);
}

saveVoto(identificacion: any): Observable<any>{
  return this.http.post(`${this.url}savevoto.php`, JSON.stringify(identificacion))
}


getEstudianteAspirante(identificacion: any): Observable<any>{
  return this.http.post(`${this.url}dat_estudiante.php`, JSON.stringify(identificacion))
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

getTrayectos() {
  return this.http.get(`${this.url}trayectos.php`);
}

getZonaPTransporte() {
  return this.http.get(`${this.url}zonaptransporte.php`);
}

getParentescoEmer() {
  return this.http.get(`${this.url}parentescoemer.php`);
}

getSectorTrabajo() {
  return this.http.get(`${this.url}sector_trabajo.php`);
}

getQuestSec() {
  return this.http.get(`${this.url}questsec.php`);
}

getAspirantes() {
  return this.http.get(`${this.url}aspirante_opsu.php`);
}

createPerson(datospersona : any): Observable<any>{
  return this.http.post(`${this.url}crearpersona.php`, JSON.stringify(datospersona))
}

createPersonMigracion(datospersona : any): Observable<any>{
  return this.http.post(`${this.url}crearpersonamigracion.php`, JSON.stringify(datospersona))
}

createPersonAutopostulado(datospersona : any): Observable<any>{
  return this.http.post(`${this.url}crearautopostulado.php`, JSON.stringify(datospersona))
}

createPersonAdministrativo(datospersona : any): Observable<any>{
  return this.http.post(`${this.url}crearadministrativo.php`, JSON.stringify(datospersona))
}

}
