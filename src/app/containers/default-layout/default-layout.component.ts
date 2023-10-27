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

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  
  constructor(public loginService: LoginService
    ) {}

    ngAfterViewInit() {
      //this.searchMenuSice();
    }


    searchMenuSice() {
      this.loginService.getMenuSice().subscribe(
        (result: any) => {
          this.navItems= result;
      
      }
      );
    }
}
