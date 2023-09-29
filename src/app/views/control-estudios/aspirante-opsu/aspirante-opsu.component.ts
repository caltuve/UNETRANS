import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators,FormControl} from '@angular/forms';
import { ControlEstudiosService } from '../control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-aspirante-opsu',
  templateUrl: './aspirante-opsu.component.html',
  styleUrls: ['./aspirante-opsu.component.scss']
})
export class AspiranteOpsuComponent implements OnInit {
  
  arrayDatos : any []= [];
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['id_estudiante','nombre_completo','confirma'];

  dato: any []= [];
  nacs: any []= [];
  genero: any []= [];
  carreras: any []= [];
  aspirantes: any []= [];

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,) {
    }



  ngOnInit() { 
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
        //this.carreras = result;
  }
  );
}

findAspirantes(){
  this.SpinnerService.show();
  this.controlestudiosService.getAspirantes().subscribe(
    (result: any) => {

      this.arrayDatos = result;
      this.carreras = result[0].carreras;
      this.SpinnerService.hide();
  }
  );
 
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
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
