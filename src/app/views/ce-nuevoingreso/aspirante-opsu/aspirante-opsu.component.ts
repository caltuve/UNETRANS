import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EstadisticasOpsuProgramaComponent } from '../estadisticas-opsu-programa/estadisticas-opsu-programa.component';

@Component({
  selector: 'app-aspirante-opsu',
  templateUrl: './aspirante-opsu.component.html',
  styleUrls: ['./aspirante-opsu.component.scss']
})
export class AspiranteOpsuComponent implements OnInit {
  
  arrayDatos: any = {};
  dataSource = new MatTableDataSource([]);
  procesadas = new MatTableDataSource();
  displayedColumns: string[] = ['id_estudiante','nombre_completo','convenio','confirma'];
  displayedColumnsProcesadas: string[] = ['estatus', 'id_estudiante', 'nombre_completo','pnf','gestion'];


  dato: any []= [];
  nacs: any []= [];
  genero: any []= [];
  carreras: any []= [];
  aspirantes: any []= [];

  hayResultadosRecibidas: boolean = false;
  sinResultadosRecibidas: boolean = false;

  modalRef: BsModalRef;
  
  @ViewChild('paginatorProcesadas') paginatorProcesadas: MatPaginator;

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private modalService: BsModalService,
    ) {
    }



  ngOnInit() { 
    this.findAspirantes();
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
        //this.carreras = result;
  }
  );
}

findAspirantes() {
  this.SpinnerService.show();
  this.controlestudiosService.getAspirantes().subscribe(
    (result: any) => {
      // Reiniciar las banderas de resultados
      this.hayResultadosRecibidas = false;
      this.sinResultadosRecibidas = false;

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
    },
    (error: any) => {
      // En caso de error, ocultar spinner y manejar error si es necesario
      this.SpinnerService.hide();
      console.error('Error al cargar los datos:', error);
    }
  );
}

consultarEstadistica(): void {
  const modalRef: BsModalRef = this.modalService.show(EstadisticasOpsuProgramaComponent, {
    class: 'modal-lg'  // Tamaño del modal
  });
}



applyFilterProcesadas(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.procesadas.filter = filterValue.trim().toLowerCase();

  if (this.procesadas.paginator) {
    this.procesadas.paginator.firstPage();
  }
}


FormGroupAddAspiranteOpsu = this._formBuilder.group({
  nac: ['', Validators.required],
  identificacion: ['', Validators.required],
  pnombre: ['', Validators.required],
  papellido: ['', Validators.required],
  carrera: ['', Validators.required],

});

FormGroupAddAspiranteOpsuMasivo = this._formBuilder.group({
  masivoopsu: ['', Validators.required],

});

}
