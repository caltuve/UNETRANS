import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';

import { EstadoI, MunicipioI, ParroquiaI } from '../../control-estudios/crear-nuevo/model.interface'
interface Categoria {
  codtipo: string;
  descripcion: string;
}

interface detalleElementos {
  codtipo: string;
  codelemento: string;
  descripcion: string;
  estatus: string;
  orden: number;
}

@Component({
  selector: 'app-constantes-globales',
  templateUrl: './constantes-globales.component.html',
  styleUrls: ['./constantes-globales.component.scss']
})
export class ConstantesGlobalesComponent {



  arrayDatos : any []= [];

  pnfs: any []= [];
  selectedOption: any;
  recibidas = new MatTableDataSource();
  pnfRecibidas = new MatTableDataSource();
  procesadas = new MatTableDataSource();
  displayedColumnsRecibidas: string[] = ['fecha_solicitud', 'id_estudiante', 'nombre_completo', 'edad', 'tipoaspirante', 'gestion'];
  displayedColumnsProcesadas: string[] = ['estatus', 'id_estudiante', 'nombre_completo','telefono' ,'pnf','usrproceso'];
  displayedColumnsPnf: string[] = ['radio','codigo','pnf'];
  displayedColumns: string[] = ['codigo','nombre'];
  hayResultadosRecibidas: boolean = false;
  sinResultadosRecibidas: boolean = false;

  hayResultadosProcesadas: boolean = false;
  sinResultadosProcesadas: boolean = false;

  hayResultadosPlanteles: boolean = false;
  sinResultadosPlanteles: boolean = false;

  fecha_solicitud: string;

  moding: any []= [];
  trayectos: any []= [];
  resolucion: any []= [];

  cedulaAuto!: string;

  trayecto!: string;
  mod_ingreso!: string;
  reso!: string;
  plantel!: string;


  usr={
    nac:null,
    cedula:null,
    nombre_completo:null,
    nombre_corto:null,
    fecnac:null,
    carnet:null,
    pnf:null,
    email: null,
    saludo: null,
    usrsice: null,
  }

  listEstadosEducacionMedia!: EstadoI[]
  estadoSelectedEducacionMedia!: string
  listMunicipiosEducacionMedia!: MunicipioI[]
  municipioSelectedEducacionMedia!: string
  listParroquiasEducacionMedia!: ParroquiaI[]
  parroquiaSelectedEducacionMedia!: string

  dataSource = new MatTableDataSource();
  valorCampo: any;

  listPlantel: any = [];

  tipos: Categoria[] = [];
  elementosTipos: detalleElementos[] = [];

  categoriaSeleccionada: Categoria | null = null;

  @ViewChild('paginatorRecibidas') paginatorRecibidas: MatPaginator;
  @ViewChild('paginatorProcesadas') paginatorProcesadas: MatPaginator;
  //paginatorIntl: MatPaginatorIntl;
  @ViewChild('gestionAutopostulado') public gestionAutopostulado: ModalDirective;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private cdRef: ChangeDetectorRef) {
    }

    rangeLabel = 'Mostrando ${start} – ${end} de ${length}';

    
    ngAfterViewInit() {
    //this.paginatorRecibidas._intl.itemsPerPageLabel = 'Mostrando de ${start} – ${end} registros';
    // this.paginatorRecibidas._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    //   if (length === 0 || pageSize === 0) {
    //     return `Mostrando 0 de ${length}`;
    //   }
    //   length = Math.max(length, 0);
    //   const startIndex = page * pageSize;
    //   const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    //   return `Mostrando ${startIndex + 1} – ${endIndex} de ${length} registro(s)`;
    //};
    
    this.recibidas.paginator = this.paginatorRecibidas;
    this.procesadas.paginator = this.paginatorProcesadas;
    this.findAutopostulados();
    this.findModIngreso();
    this.findTrayectos();
    this.findResolucion(); 
    this.findEstadosEducacionMedia(); 
    this.findTipos(); 
    //this.cdRef.detectChanges(); 
    //console.log(this.categorias);
}


  seleccionarCategoria(codtipo: any): void {
    console.log(codtipo);
    this.categoriaSeleccionada = codtipo;
  }

findAutopostulados() {
  this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
  this.SpinnerService.show();
  this.controlestudiosService.getAutopostulado().subscribe(
    (data: any) => {
      this.hayResultadosRecibidas = false;
      this.sinResultadosRecibidas= false;
      this.hayResultadosProcesadas = false;
      this.sinResultadosProcesadas = false; 
      this.recibidas.data = data.recibidas;
      this.procesadas.data = data.procesadas;
    if (this.recibidas.data.length == 0) {
      this.sinResultadosRecibidas = this.recibidas.data.length == 0;
      this.hayResultadosRecibidas = false;
      this.SpinnerService.hide();
     } else{
      this.recibidas.paginator = this.paginatorRecibidas;
      this.recibidas.data = data.recibidas;
      this.pnfs = data.recibidas[0].pnf;
      this.hayResultadosRecibidas = this.recibidas.data.length > 0;
      this.SpinnerService.hide();
     }

     if (this.procesadas.data.length == 0) {
      this.sinResultadosProcesadas = this.procesadas.data.length == 0;
      this.hayResultadosProcesadas = false;
      this.SpinnerService.hide();
     } else{
      this.procesadas.paginator = this.paginatorProcesadas;
      this.procesadas.data = data.procesadas;
      this.hayResultadosProcesadas = this.procesadas.data.length > 0;
      this.SpinnerService.hide();
     }
    }
  );
}


findModIngreso(){
  this.controlestudiosService.getModIngreso().subscribe(
    (result: any) => {
      const opcionesFiltradas = [ '011']; // Aquí colocas los valores codelemento que deseas mostrar
      this.moding = result.filter((moding: { codelemento: string; }) => opcionesFiltradas.includes(moding.codelemento));
  }
  );
}

findTipos(){
  this.controlestudiosService.getVariablesTipo().subscribe(
    (result: any) => {
      this.tipos = result;
  }
  );
}

findDetalleTipos(codtipo: string){
  this.controlestudiosService.getDetalleVariablesTipo(codtipo).subscribe(
    (result: any) => {
      this.elementosTipos = result;
  }
  );
}

findTrayectos(){
  this.controlestudiosService.getTrayectos().subscribe(
    (result: any) => {
        this.trayectos = result;
  }
  );
}

findResolucion(){
  this.controlestudiosService.getResolucion().subscribe(
    (result: any) => {
        this.resolucion = result;
  }
  );
}

applyFilterRecibidas(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.recibidas.filter = filterValue.trim().toLowerCase();

  if (this.recibidas.paginator) {
    this.recibidas.paginator.firstPage();
  }
}


applyFilterProcesadas(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.procesadas.filter = filterValue.trim().toLowerCase();

  if (this.procesadas.paginator) {
    this.procesadas.paginator.firstPage();
  }
}

private findEstadosEducacionMedia(){
  this.controlestudiosService.getEstados().subscribe(data=>{
    this.hayResultadosPlanteles = false;
    this.sinResultadosPlanteles= false;
    this.estadoSelectedEducacionMedia = '';
    this.municipioSelectedEducacionMedia = '';
      this.parroquiaSelectedEducacionMedia = '';
    this.listEstadosEducacionMedia = data
  })
}

onEstadoselectedEducacionMedia(selectedEstadoId: any){
  this.controlestudiosService.getMunicipioOfSelectedEstado(selectedEstadoId).subscribe(
    data=>{
      this.hayResultadosPlanteles = false;
      this.sinResultadosPlanteles= false;
      this.municipioSelectedEducacionMedia = '';
      this.parroquiaSelectedEducacionMedia = '';
      this.listMunicipiosEducacionMedia = data
    }
  )
}

onMunicipioselectedEducacionMedia(selectedMunicipioId: any){
  this.controlestudiosService.getParroquiaOfSelectedMunicipio(selectedMunicipioId).subscribe(
    data=>{
      this.parroquiaSelectedEducacionMedia = '';
      this.hayResultadosPlanteles = false;
      this.sinResultadosPlanteles= false;
      this.listParroquiasEducacionMedia = data
    }
  )
}

onParroquiaselectedEducacionMedia(selectedParroquiaId: any){
  this.SpinnerService.show();
  this.controlestudiosService.getPlantelOfSelectedParroquia(selectedParroquiaId).subscribe(
    data=>{
      this.hayResultadosPlanteles = false;
      this.sinResultadosPlanteles= false;
      this.dataSource.data = data;
      if (this.dataSource.data.length == 0) {
        this.sinResultadosPlanteles = this.dataSource.data.length == 0;
        this.hayResultadosPlanteles = false;
        this.SpinnerService.hide();
       } else{
        this.dataSource.data = data;
        this.listPlantel = data
        this.hayResultadosPlanteles = this.dataSource.data.length > 0;
        this.SpinnerService.hide();
       }
      //console.log(data)
    }
  )
}

guardar(): void {
  this.SpinnerService.show(); 
      
  // Esta función se ejecutará cuando se haga clic en "Guardar Datos" en el último step
  // Puedes acceder a los datos de cada step utilizando this.step1Form.value, this.step2Form.value, etc.
  const datosStep1 = this.plantelFormGroup.value;

  console.log(datosStep1);
    const datosCompletos = {
      step1: datosStep1,
    };
    //const cedula = datosCompletos.step1.cedula;

    this.controlestudiosService.crearPlantel(datosCompletos).subscribe(datos => {
      switch (datos['estatus']) {
        case 'ERROR':
              this.SpinnerService.hide(); 
              this.notifyService.showError2('Ha ocurrido un error, verifique nuevamente y si persiste comuníquese con sistemas.');
              //this.gestionAutopostulado.hide(); 
              this.plantelFormGroup.reset();
              this.findEstadosEducacionMedia(); 
              break;
        default:
          this.SpinnerService.hide(); 
          this.notifyService.showSuccess('Plantel ha sido añadido');
          //this.gestionAutopostulado.hide(); 
          this.plantelFormGroup.reset();
          //this.findAutopostulados();
          //this.enviarNotificacion(cedula);
          this.findEstadosEducacionMedia(); 
          break;
      }
    });
}

setSelectedCedulaAuto(cedula: any) {
  this.cedulaAuto = cedula;
}


  plantelFormGroup = this._formBuilder.group({
    codigoplantel:['', Validators.required],
    plantel:['', Validators.required]  
  });


}
