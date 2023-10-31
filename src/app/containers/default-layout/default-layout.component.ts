import { Component, ViewChild,AfterViewInit} from '@angular/core';
import { LoginService } from './../../views/pages/login/login.service';
import { INavData } from '@coreui/angular';
import { navItems } from './_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent implements AfterViewInit{

  public navItems = navItems;
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
  };
  
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  
  constructor(public loginService: LoginService
    ) {}

    ngAfterViewInit() {
      this.searchMenuSice();
    }


    searchMenuSice() {
      this.usr = JSON.parse(sessionStorage.getItem('currentUser')!);
      this.loginService.getMenuSice(this.usr.usrsice).subscribe(
        (result: any) => {
          this.navItems = result;
        }
      );
    }
}
