import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { EstadoI, MunicipioI } from './crear-nuevo/model.interface';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from "rxjs";
import { tap, map} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

export interface Docente {
  cedula: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class ControlEstudiosService {

  url:string  = environment.url; 
  url2 = 'https://petroapp-price.petro.gob.ve/price/';

  private inscripcionCompletadaSource = new Subject<string>();
  inscripcionCompletada$ = this.inscripcionCompletadaSource.asObservable();
  
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

  getProgramasActivosDep(usrsice: any): Observable<any>{
    return this.http.get(`${this.url}programas_vigentes_dep.php?usrsice=${usrsice}`);
  }

  getProgramasActivosRegimen(regimen: any): Observable<any>{
    return this.http.get(`${this.url}programas_vigentes_regimen.php?regimen=${regimen}`);
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

getVariablesTipo() {
  return this.http.get(`${this.url}variabletipos.php`);
}

getDetalleVariablesTipo(tipoSeleccionado: string): Observable<any>{
  return this.http.get(`${this.url}detallevariabletipos.php?tipo=${tipoSeleccionado}`)
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

getSolicitudesRevisionMigra() {
  return this.http.get(`${this.url}solic_revision_migra.php`);
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

  getDocentesDep(usrsice: any): Observable<any>{
    return this.http.get(`${this.url}docentesfordep.php?usrsice=${usrsice}`);
  }

  getCursosDocente(usrsice: any): Observable<any>{
    return this.http.get(`${this.url}cursosfordocente.php?usrsice=${usrsice}`);
  }

  getCursosDocenteCargaNotas(usrsice: any): Observable<any>{
    return this.http.get(`${this.url}cursosfordocentecalificaciones.php?usrsice=${usrsice}`);
  }


  getInscripcionEstudiante(usrsice: any): Observable<any>{
    return this.http.get(`${this.url}inscripcion_est.php?usrsice=${usrsice}`);
  }

  getInscripcionUCEstudiante(carnet: any): Observable<any>{
    return this.http.get(`${this.url}inscripcion_est_UC.php?carnet=${carnet}`);
  }

  getDatosConstancia(usrsice: any): Observable<any>{
    return this.http.get(`${this.url}detalle_constancia.php?usrsice=${usrsice}`);
  }

  getProgramasActivos() {
    return this.http.get(`${this.url}programas_vigentes.php`);
  }

  getAllProgramas() {
    return this.http.get(`${this.url}all_programas.php`);
  }

  getPeriodos() {
    return this.http.get(`${this.url}periodos.php`);
  }

  getProcesosCargaCalificaciones() {
    return this.http.get(`${this.url}procesos_carga_calificaciones.php`);
  }

  getPeriodosCalificaciones() {
    return this.http.get(`${this.url}periodosCalificaciones.php`);
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

  getOfertaAcademicaDCE(carreraSeleccionada: string, periodoSeleccionado:string): Observable<any>{
    return this.http.get(`${this.url}resumen_cupos_dce.php?pnf=${carreraSeleccionada}&periodo=${periodoSeleccionado}`);
  }

  getDetailActa(actaId: any): Observable<any>{
    return this.http.get(`${this.url}detalle_acta.php?acta=${actaId}`);
  }

  getDetailActaCarga(actaId: any): Observable<any>{
    return this.http.get(`${this.url}detalle_acta_carga.php?acta=${actaId}`);
  }

  getDetailActaCargada(actaId: any): Observable<any>{
    return this.http.get(`${this.url}detalle_acta_cargada.php?acta=${actaId}`);
  }

  getUCInscripcion(carnet: string, pnf: string, trayecto: string): Observable<any>{
    return this.http.get(`${this.url}obtenerTrayectosPorPlanYTrayectoinscripcion.php?carnet=${carnet}&pnf=${pnf}&trayecto=${trayecto}`);
  }

  getDetailActaEdit(actaId: any): Observable<any>{
    return this.http.get(`${this.url}detalle_acta_edit.php?acta=${actaId}`);
  }

  getPeriodoOfPnfSeleccionado(carreraSeleccionada: string): Observable<any>{
    return this.http.get(`${this.url}cupos_periodos.php?pnf=${carreraSeleccionada}`)
  }

  getTipoSeccion() {
    return this.http.get(`${this.url}tipo_seccion.php`);
  }

  getAllDocentes(): Observable<Docente[]> {
    return this.http.get<Docente[]>(`${this.url}allDocentes.php`);
  }

  createSeccion(datospersona : any): Observable<any>{
    return this.http.post(`${this.url}crearseccion.php`, JSON.stringify(datospersona))
  }

  modSeccion(datospersona : any): Observable<any>{
    return this.http.post(`${this.url}modseccion.php`, JSON.stringify(datospersona))
  }

  findPersona(dato: any){
    return this.http.post(`${this.url}findpersona.php`, JSON.stringify(dato));
  }

  findPersonaModify(dato: any){
    return this.http.post(`${this.url}findpersonamodify.php`, JSON.stringify(dato));
  }

  findUcModify(dato: any){
    return this.http.post(`${this.url}finducmodify.php`, JSON.stringify(dato));
  }

  findPersonaRdi(dato: any){
    return this.http.post(`${this.url}findpersonrdi.php`, JSON.stringify(dato));
  }

  checkEnGestion(dato: any){
    return this.http.post(`${this.url}checkgestion.php`, JSON.stringify(dato));
  }

  marcarEnGestion(dato: any){
    return this.http.post(`${this.url}marcargestion.php`, JSON.stringify(dato));
  }

  findPersonaExpediente(dato: any){
    return this.http.post(`${this.url}findpersonaexp.php`, JSON.stringify(dato));
  }

  findPersonaInscripcion(dato: any){
    return this.http.post(`${this.url}findpersonainscripcion.php`, JSON.stringify(dato));
  }


  revisarExpediente(dato: any){
    return this.http.post(`${this.url}revisar_expediente.php`, JSON.stringify(dato));
  }

  actualizarEstatusExpediente(dato: any){
    return this.http.post(`${this.url}actualizar_expediente.php`, JSON.stringify(dato));
  }

  findPersonaReincorporacion(dato: any): Observable<any>{
    return this.http.post(`${this.url}findpersona_reincorpora.php`, JSON.stringify(dato));
  }

  pushNotify(identificacion: any): Observable<any>{
    return this.http.post(`${this.url}enviacorreo.php`, JSON.stringify(identificacion))
  }

  generaOtp(datos: any): Observable<any>{
    return this.http.post(`${this.url}generaotp.php`, JSON.stringify(datos))
  }

  generaOtpVerificado(datos: any): Observable<any>{
    return this.http.post(`${this.url}generaotpverif.php`, JSON.stringify(datos))
  }

  validarOTP(datos: any): Observable<any>{
    return this.http.post(`${this.url}validaotp.php`, JSON.stringify(datos))
  }

  validarOTP2(datos: any): Observable<any>{
    return this.http.post(`${this.url}validaotp2.php`, JSON.stringify(datos))
  }

  crearPlantel(datosplantel : any): Observable<any>{
    return this.http.post(`${this.url}crearplantel.php`, JSON.stringify(datosplantel))
  }

  actualizarFechasProceso(datos: any): Observable<any> {
    return this.http.post<any>(`${this.url}editcalendar.php`, JSON.stringify(datos));
  }

  getDepartamentos() {
    return this.http.get(`${this.url}departamentos.php`);
  }

  getTypeProgramasAcademic() {
    return this.http.get(`${this.url}typeacadprogam.php`);
  }

  getSituacion() {
    return this.http.get(`${this.url}situacion.php`);
  }

  getTipoPrograma() {
    return this.http.get(`${this.url}tipoprograma.php`);
  }

  getAfiliacion() {
    return this.http.get(`${this.url}tipoafiliacion.php`);
  }

  getTipoCertificacion() {
    return this.http.get(`${this.url}tipocertificacion.php`);
  }


  crearPrograma(datosPrograma: any): Observable<any> {
    return this.http.post<any>(`${this.url}crearprograma.php`, JSON.stringify(datosPrograma));
  }

  obtenerPrograma(id: number): Observable<any> {
    return this.http.get(`${this.url}obtenerPrograma.php?id=${id}`)
  }

  obtenerMenciones(id: number): Observable<any> {
    return this.http.get(`${this.url}obtenerMencion.php?id=${id}`)
  }

  crearPlanEstudios(datosPlan: any): Observable<any> {
    return this.http.post<any>(`${this.url}crearplan.php`, JSON.stringify(datosPlan));
  }

  getPlanesEstudios() {
    return this.http.get(`${this.url}calendar_procesos.php`);
  }

  obtenerPlanesEstudios(id: number): Observable<any> {
    return this.http.get(`${this.url}obtenerPlan.php?id=${id}`)
  }

  obtenerSeccionesPeriodo(codigoUC: string, periodo: string): Observable<any> {
    return this.http.get(`${this.url}obtenerSeccionesPeriodo.php?uc=${codigoUC}&periodo=${periodo}`)
  }

  obtenerTrayectosPorCodigoPlan(codigoPlan: string): Observable<any> {
    return this.http.get(`${this.url}obtenerTrayectosPorPlan.php?id=${codigoPlan}`)
  }

  agregarUnidadCurricular(datosUnidadCurricular: any): Observable<any> {
    return this.http.post<any>(`${this.url}crearUnidadCurricular.php`, JSON.stringify(datosUnidadCurricular));
  }

  obtenerUnidadesCurriculares(planSeleccionado: string, trayectoNombre: string): Observable<any> {
    let url = `${this.url}obtenerUC.php?plan=${planSeleccionado}&trayecto=${trayectoNombre}`;
    return this.http.get(url);
}

obtenerUnidadesCurricularesGestionCupos(planSeleccionado: string, trayectoNombre: string, periodo: string): Observable<any> {
  let url = `${this.url}obtenerUCGestionCupos.php?plan=${planSeleccionado}&trayecto=${trayectoNombre}&periodo=${periodo}`;
  return this.http.get(url);
}

obtenerUnidadesCurricularesInscripcion(planSeleccionado: string, carnet: string, trayectoNombre: string): Observable<any> {
  let url = `${this.url}obtenerUCInscripcion.php?plan=${planSeleccionado}&carnet=${carnet}&trayecto=${trayectoNombre}`;
  return this.http.get(url);
}

inscribirEstudiante(datos: { inscripciones: any[] }) {
  return this.http.post(`${this.url}inscribirEstudiante.php`, JSON.stringify(datos) ); // Ajusta la ruta según tu backend
}

obtenerUnidadesCurricularesSemestre(planSeleccionado: string, trayectoNombre: string, semestreNumero: number): Observable<any> {
  let url = `${this.url}obtenerUC.php?plan=${planSeleccionado}&trayecto=${trayectoNombre}&semestre=${semestreNumero}`;
  return this.http.get(url);
}

obtenerUnidadesCurricularesMencion(planSeleccionado: string, trayectoNombre: string, mencion: string): Observable<any> {
  let url = `${this.url}obtenerUCMencion.php?plan=${planSeleccionado}&trayecto=${trayectoNombre}&mencion=${mencion}`;
  return this.http.get(url);
}

obtenerUnidadesCurricularesMencionGestionCupos(planSeleccionado: string, trayectoNombre: string, mencion: string, periodo: string): Observable<any> {
  let url = `${this.url}obtenerUCMencionGestionCupos.php?plan=${planSeleccionado}&trayecto=${trayectoNombre}&mencion=${mencion}&periodo=${periodo}`;
  return this.http.get(url);
}

obtenerUnidadesCurricularesGrado(planSeleccionado: string, trayectoNombre: string, carnetEstudiante: string, semestreNumero?: number | null): Observable<any> {
  let url = `${this.url}obtenerUCCalificaciones.php?plan=${planSeleccionado}&trayecto=${trayectoNombre}&carnet=${carnetEstudiante}`;
  if (semestreNumero !== null && semestreNumero !== undefined) {
      url += `&semestre=${semestreNumero}`;
  }
  return this.http.get(url);
}

obtenerTrayectosPorCodigoPlanYTrayecto(codigoPlan: string, trayectoNombre: string): Observable<any> {
  return this.http.get(`${this.url}obtenerTrayectosPorPlanYTrayecto.php?id=${codigoPlan}&trayecto=${trayectoNombre}`)
}

findPersonaCalificaciones(dato: any){
  return this.http.post(`${this.url}findpersonaCalificaciones.php`, JSON.stringify(dato));
}

enviarCalificaciones(calificacionesParaEnviar: any): Observable<any>{
  return this.http.post(`${this.url}cargaCalificacionesContingenciaGrado.php`, JSON.stringify(calificacionesParaEnviar));
}

buscarRecordAcademico(carnet: string) {
  // Asegúrate de que el objeto enviado tenga la estructura correcta
  const postData = { carnet: carnet };
  return this.http.post(`${this.url}buscarRecord.php`, JSON.stringify(postData));
}

buscarResumenAcademico(carnet: string, plan: string): Observable<any> {
  // Asegúrate de que el objeto enviado tenga la estructura correcta
  // Ahora incluye tanto el carnet como el plan
  const postData = { carnet: carnet, plan: plan };

  return this.http.post(`${this.url}buscarResumen.php`, JSON.stringify(postData));
}

  notificarInscripcionCompletada(carnet: string) {
    this.inscripcionCompletadaSource.next(carnet);
  }

  actualizarDatos(dato: any){
    return this.http.post(`${this.url}actualizardatos.php`, JSON.stringify(dato));
  }

  
  actualizarDatosUc(dato: any){
    return this.http.post(`${this.url}actualizardatosuc.php`, JSON.stringify(dato));
  }

  verificarEmailExist(email: string): Observable<any> {
    return this.http.post(`${this.url}veremailexist.php`, { email });
  }

  actualizarDatosEstudianteRDI(dato: any): Observable<any> {
    return this.http.post(`${this.url}actrevrdi.php`, JSON.stringify(dato));
  }

  uploadCalificacionesDocente(dato: any): Observable<any> {
    return this.http.post(`${this.url}uploadcalificacionesdocente.php`, JSON.stringify(dato));
}

findDatosAcademicosDash(dato: any): Observable<any> {
  return this.http.post(`${this.url}finddatosacademicosdash.php`, JSON.stringify(dato));
}

findDatosDocenteDash(dato: any): Observable<any> {
  return this.http.post(`${this.url}finddatosdocentedash.php`, JSON.stringify(dato));
}

cargaProcesoCalificaciones(dato: any): Observable<any> {
  return this.http.post(`${this.url}crear_proceso_calificaciones.php`, JSON.stringify(dato));
}

getPlanes(): Observable<any> {
  return this.http.get(`${this.url}/planes.php`);
}

getUnidades(): Observable<any> {
  return this.http.get(`${this.url}/obtenerUCall.php`);
}

getTrayectosUC(idPlan: number): Observable<any> {
  return this.http.post(`${this.url}/trayectosUC.php`, JSON.stringify(idPlan));
}

getSemestresUC(idTrayecto: number): Observable<any> {
  return this.http.post(`${this.url}/semestresUC.php`, JSON.stringify(idTrayecto));
}

}
