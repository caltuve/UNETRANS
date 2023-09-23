import { Injectable, Output, EventEmitter} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class LoginService {

  public token!: string;

  //url = 'http://localhost/unetrans/'; //Desarrollo
  //url = 'http://172.20.1.50/'; //Produccion local desa
  url = 'http://190.202.27.122/'; //Produccion Produccion
 @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
 constructor(private http: HttpClient) {}

  login(userlogin: any): Observable<any> {
    return this.http.post(`${this.url}loginsice.php`, JSON.stringify(userlogin)).pipe(
      map((userlogin: any) => {
        const token = userlogin.token; // Suponiendo que el token se devuelve en la propiedad "token" del objeto de respuesta
        sessionStorage.setItem('token', token);
        return userlogin;
      })
    );
  }

  //token
setToken(userlogin: string) {
  sessionStorage.setItem('token', userlogin);
  }
  getToken() {
  return sessionStorage.getItem('token');
  }
  deleteToken() {
    sessionStorage.removeItem('token');
  }
  deleteSession() {
    sessionStorage.removeItem('currentUser');
  }
  isLoggedIn() {
  const usertoken = this.getToken();
  if (usertoken != null) {
  return true
  }
  return false;
  }

}