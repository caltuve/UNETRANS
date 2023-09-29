import { Component } from '@angular/core';
export interface Instituciones {
  id: number;
  institucion: string;
  sigla: string;
  direccion: string;
  tipo: string;
  estatus: string;
}

const ELEMENT_DATA: Instituciones[] = [
  {id: 1, sigla: 'UNETRANS', institucion: 'Universidad Nacional Experimental del Transporte', direccion: 'Km 8, Carretera Panamericana, Caracas', tipo: 'Universidad', estatus: 'Activa'},
  {id: 2, sigla: 'IUTIN', institucion: 'Instituto Universitario de Tecnología Isaac Newton', direccion: 'N/A', tipo: 'Instituto', estatus: 'Cerrado'},
  {id: 3, sigla: 'Mision Sucre', institucion: 'Misión Sucre', direccion: 'N/A', tipo: 'Misión', estatus: 'Activo'},

];

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: ['./institucion.component.scss']
})
export class InstitucionComponent {
  displayedColumns: string[] = ['id', 'sigla', 'institucion', 'direccion', 'tipo', 'estatus'];
  dataSource = ELEMENT_DATA;  
}
3