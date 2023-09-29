import { Component,OnInit } from '@angular/core';
import { ControlEstudiosService } from '../control-estudios.service';

@Component({
  selector: 'app-consultar-datos',
  templateUrl: './consultar-datos.component.html',
  styleUrls: ['./consultar-datos.component.scss']
})
export class ConsultarDatosComponent  implements OnInit {
  petro: any []= [];
  docs: any []= [];
  constructor(
    public controlestudiosService: ControlEstudiosService) {}

    ngOnInit() {
      this.findDocAcad();
      this.loadPetro();
  }

  findDocAcad(){
    this.controlestudiosService.getDocsAcad().subscribe(
      (result: any) => {
          this.docs = result;
    }
    );
  }
  loadPetro(){
    this.controlestudiosService.obtenerPetro().subscribe(
      (result: any) => {
          this.petro = Object.values(result.data.PTR);
          console.log(this.petro);
    }
    );
  }
}
