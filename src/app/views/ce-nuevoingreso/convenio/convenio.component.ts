import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import {ModalDirective} from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalAddModAspiranteComponent } from '../../entes/modal-add-mod-aspirante/modal-add-mod-aspirante.component'; 

@Component({
  selector: 'app-convenio',
  templateUrl: './convenio.component.html',
  styleUrls: ['./convenio.component.scss']
})
export class ConvenioComponent implements OnInit{

  arrayDatos: any = {};  // Cambiado a objeto
  dataSource = new MatTableDataSource([]);
  procesadas = new MatTableDataSource();
  displayedColumns: string[] = ['id_estudiante','nombre_completo','convenio','confirma'];
  displayedColumnsProcesadas: string[] = ['estatus', 'id_estudiante', 'nombre_completo','ente','pnf','fecha_carga','gestion'];

  minDate1!: Date;
  maxDate1!: Date;

  dato: any []= [];
  nacs: any []= [];
  genero: any []= [];
  carreras: any []= [];
  carreras2: any []= [];
  aspirantes: any []= [];

  moding: any []= [];
  turnos: any []= [];
  trayectos: any []= [];
  convenios: any []= [];

  hayResultadosRecibidas: boolean = false;
  sinResultadosRecibidas: boolean = false;

  modalRef: BsModalRef;

  @ViewChild('gestionNewAspConvenio') public gestionNewAspConvenio: ModalDirective;
  @ViewChild('paginatorProcesadas') paginatorProcesadas: MatPaginator;

  nac!: string;
  cedula!: number;
  fecnac!: Date;
  primer_nombre!: string;
  segundo_nombre!: string;
  primer_apellido!: string;
  segundo_apellido!: string;
  pnf!: string;
  trayecto!: string;
  mod_ingreso!: string;
  convenio!: string;

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private modalService: BsModalService,
    ) {

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minDate1 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate1 = new Date(currentYear - 14, currentMonth, currentDay);
    }



  ngOnInit() { 
    this.findAspirantesConvenio();
    this.findNac();
    this.findCarreras();
    this.findModIngreso();
    this.findTrayectos();
    this.findEmpConvenio();
}

ngAfterViewInit() {
      
  //this.SpinnerService.show();
this.paginatorProcesadas._intl.itemsPerPageLabel = 'Mostrando de ${start} – ${end} registros';
this.paginatorProcesadas._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) {
    return `Mostrando 0 de ${length}`;
  }
  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
  return `Mostrando ${startIndex + 1} – ${endIndex} de ${length} registro(s)`;
};
this.procesadas.paginator = this.paginatorProcesadas;
//this.loadAllData();
// this.findSolicitudesMigracion();
// this.findModIngreso();
// this.findTrayectos();
// this.findResolucion();  

}

findNac(){
  this.controlestudiosService.getNac().subscribe(
    (result: any) => {
        this.nacs = result;
  }
  );
}

findGen(){
  this.controlestudiosService.getGen().subscribe(
    (result: any) => {
        this.genero = result;
  }
  );
}

findCarreras(){
  this.controlestudiosService.getCarreras().subscribe(
    (result: any) => {
        this.carreras2 = result;
  }
  );
}


findAspirantesConvenio() {
  this.SpinnerService.show();
  this.controlestudiosService.getAspirantesConvenio().subscribe(
    (result: any) => {
      // Reiniciar las banderas de resultados
      this.hayResultadosRecibidas = false;
      this.sinResultadosRecibidas = false;

      if (result['estatus'] === 'SIN CONVENIO') {
        // No hay convenio, mostrar sin resultados
        this.sinResultadosRecibidas = true;
        this.hayResultadosRecibidas = false;
        this.SpinnerService.hide();
      } else {
        // Verificar si hay estudiantes en el resultado
        if (result.estudiantes && result.estudiantes.length > 0) {
          // Hay estudiantes, asignar datos
          this.arrayDatos = result.estadistica;
          this.procesadas.data = result.estudiantes;

          // Mostrar los resultados
          this.hayResultadosRecibidas = true;
          this.sinResultadosRecibidas = false;
        } else {
          // No hay estudiantes, mostrar sin resultados
          this.sinResultadosRecibidas = true;
          this.hayResultadosRecibidas = false;
        }

        this.SpinnerService.hide();
      }
    },
    (error: any) => {
      // En caso de error, ocultar spinner y manejar error si es necesario
      this.SpinnerService.hide();
      console.error('Error al cargar los datos:', error);
    }
  );
}


findModIngreso(){
  this.controlestudiosService.getModIngreso().subscribe(
    (result: any) => {
      const opcionesFiltradas = ['006', '007', '008', '013', '015','016', '018']; // Aquí colocas los valores codelemento que deseas mostrar
      this.moding = result.filter((moding: { codelemento: string; }) => opcionesFiltradas.includes(moding.codelemento));
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

findEmpConvenio(){
  this.controlestudiosService.getEmpConvenio().subscribe(
    (result: any) => {
        this.convenios = result;
  }
  );
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}


applyFilterProcesadas(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.procesadas.filter = filterValue.trim().toLowerCase();

  if (this.procesadas.paginator) {
    this.procesadas.paginator.firstPage();
  }
}

// Método para abrir el modal para crear un nuevo aspirante
abrirModalNuevoAspirante() {
  const modalRef: BsModalRef = this.modalService.show(ModalAddModAspiranteComponent, {
    ignoreBackdropClick: true,
    keyboard: false,
    class: 'modal-dialog-centered modal-xl' // Puedes ajustar el tamaño del modal aquí
  });

  modalRef.content.isEditMode = false; // Indica que es para agregar un nuevo registro

  modalRef.content.onClose.subscribe((result: any) => {
    if (result) {
      console.log('Nuevo aspirante creado:', result);
      this.findAspirantesConvenio();
    }
  });
}


// Método para abrir el modal en modo edición
abrirModalEditarAspirante(aspiranteData: any) {
  const modalRef: BsModalRef = this.modalService.show(ModalAddModAspiranteComponent, {
    ignoreBackdropClick: true,
    keyboard: false,
    class: 'modal-dialog-centered modal-xl' // Ajuste de tamaño
  });

  modalRef.content.isEditMode = true; // Indica que es modo edición
  modalRef.content.aspiranteData = aspiranteData; // Pasa los datos del aspirante a editar

  modalRef.content.onClose.subscribe((result: any) => {
    if (result) {
      this.findAspirantesConvenio();
    }
  });
}

editarRegistro(row: any) {
  // Aquí puedes añadir la lógica para editar el registro
  console.log('Editar registro', row);
}

eliminarRegistro(row: any) {
  // Confirmación antes de eliminar
  if (confirm(`¿Estás seguro que deseas eliminar el registro de ${row.nombre_completo}? Esta acción no se puede deshacer.`)) {
    console.log('Eliminar registro', row);

    // Llamada al servicio para eliminar el registro
    this.controlestudiosService.deletePersonConvenio(row).subscribe(
      (response: any) => {
        // Verificar si la respuesta indica éxito
        if (response.estatus === 'OK') {
          // Mostrar notificación de éxito
          this.notifyService.showSuccess('Aspirante eliminado');
          // Aquí puedes refrescar la lista de registros o actualizar la tabla
          this.findAspirantesConvenio();// Si tienes un método para refrescar los datos
        } else {
          // Si el estatus no es OK, mostrar error
          this.notifyService.showError('Error al eliminar el aspirante.');
        }
      },
      (error) => {
        // Manejar el error en caso de que falle la solicitud
        console.error('Error al eliminar el aspirante:', error);
        this.notifyService.showError('Ha ocurrido un error: ' + error.message);
      }
    );
  }
}



guardar(): void {
  this.SpinnerService.show(); 
      
  // Esta función se ejecutará cuando se haga clic en "Guardar Datos" en el último step
  // Puedes acceder a los datos de cada step utilizando this.step1Form.value, this.step2Form.value, etc.
  const datosStep1 = this.firstFormGroup.value;


    const datosCompletos = {
      step1: datosStep1,
    };
    const cedula = datosCompletos.step1.cedula;

    this.controlestudiosService.createPersonConvenio(datosCompletos).subscribe(datos => {
      switch (datos['estatus']) {
        case 'OPSU':
          this.SpinnerService.hide(); 
          this.notifyService.showInfo('El aspirante a incluir por Convenio está registrado como asignado OPSU, debe seguir el proceso regular.');
          this.gestionNewAspConvenio.hide(); 
          this.firstFormGroup.reset();
          break;
        case 'Solicitud Aprobada':
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('El aspirante a incluir por Convenio le fue APROBADA la autopostulación, debe seguir el proceso regular.');
            this.gestionNewAspConvenio.hide(); 
            this.firstFormGroup.reset();
            break;
            case 'Solicitud Negada':
              this.SpinnerService.hide(); 
              this.notifyService.showError2('El aspirante a incluir por Convenio le fue NEGADA la solicitud por autopostulación.');
              this.gestionNewAspConvenio.hide(); 
              this.firstFormGroup.reset();
              break;
              case 'Solicitud Pendiente':
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('El aspirante a incluir por Convenio tiene una solicutd de autopostulación pendiente, verifique el módulo de autopostulación.');
            this.gestionNewAspConvenio.hide(); 
            this.firstFormGroup.reset();
            break;
            case 'Inscrito en SICE':
            this.SpinnerService.hide(); 
            this.notifyService.showInfo('El aspirante a incluir por Convenio ya cumplio el proceso de automatriculación en SICE.');
            this.gestionNewAspConvenio.hide(); 
            this.firstFormGroup.reset();
            break;
            case 'ERROR':
              this.SpinnerService.hide(); 
              this.notifyService.showError2('Ha ocurrido un error, verifique el número de cédula y si persiste comuníquese con sistemas.');
              this.gestionNewAspConvenio.hide(); 
              this.firstFormGroup.reset();
              break;
        default:
          this.SpinnerService.hide();
          this.notifyService.showSuccess('Aspirante por convenio añadido');
          this.gestionNewAspConvenio.hide(); 
          this.firstFormGroup.reset();
          this.findAspirantesConvenio();
          break;
      }
    });
}



firstFormGroup = this._formBuilder.group({
  nac:['', Validators.required],
  cedula: ['', Validators.required],
  primer_nombre: ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])],
  segundo_nombre: [null, Validators.compose([Validators.nullValidator, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])],
  primer_apellido: ['', Validators.compose([Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])],
  segundo_apellido:[null, Validators.compose([Validators.nullValidator, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)])] ,
  mingreso:  [{value: ''}, Validators.required],
  pnf:       [{value: '', }, Validators.required],
  trayecto:  [{value: '', }, Validators.required],
  convenio:  [{value: '', }, Validators.required],

});

}
