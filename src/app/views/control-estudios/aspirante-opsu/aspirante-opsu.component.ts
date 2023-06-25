import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-aspirante-opsu',
  templateUrl: './aspirante-opsu.component.html',
  styleUrls: ['./aspirante-opsu.component.scss']
})
export class AspiranteOpsuComponent implements AfterViewInit, OnInit {
  
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id_estudiante','nombre_completo','pnf','confirma'];

  nacs: any []= [];
  genero: any []= [];
  carreras: any []= [];
  aspirantes: any []= [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService) {
    }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.nextPageLabel = 'Siguiente';
      this.paginator._intl.previousPageLabel = 'Anterior';     
    }

  ngOnInit() {
    this.findNac();
    this.findGen();
    this.findCarreras();
    this.findAspirantes();
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
        this.carreras = result;
  }
  );
}

findAspirantes(){
  this.controlestudiosService.getAspirantes().subscribe(
    (result: any) => {
      this.dataSource.data = result;
  }
  );
}

// this.cargasdbServicio.RecuperarUserDiscoverer().subscribe(
//   (result: any) => {
//     if (result['resultado']=='NOK'){
//       this.SpinnerService.hide();
//       this.notifyService.showError('ALERTA: Error al recuperar información');
//     }
//     else{
//       this.dataSource.data = result;
//       this.SpinnerService.hide();
//       this.notifyService.showSuccess('¡Información recuperada exitosamente!');
//     }   
// }
// );


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
