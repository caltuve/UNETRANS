import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutenticacionCertificadosService } from '../autenticacion-certificados.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-validar-certificado',
  templateUrl: './validar-certificado.component.html',
  styleUrls: ['./validar-certificado.component.scss']
})
export class ValidarCertificadoComponent implements OnInit {
  hash: string = '';
  datosCertificado: any = null;
  mensajeError: string = '';
  currentDate: Date = new Date(); // Para registrar la fecha de validación
  cargando: boolean = true;

  constructor(private route: ActivatedRoute,
    private autenticacionCertificadosService: AutenticacionCertificadosService,
    private SpinnerService: NgxSpinnerService,
    ) { }

    ngOnInit(): void {
      // Capturar el hash desde la URL
      this.route.params.subscribe(params => {
        this.hash = params['hash'];
        if (this.hash) {
          this.validarCertificado(this.hash);
        } else {
          this.mensajeError = 'No se proporcionó un hash válido';
          this.cargando = false;
        }
      });
    }
  
    validarCertificado(hash: string): void {
      this.SpinnerService.show(); 
      this.autenticacionCertificadosService.validarCertificado(hash)
        .subscribe(
          (response: any) => {
            this.datosCertificado = response.datos;
            this.cargando = false;
          },
          (error) => {
            this.mensajeError = 'Certificado no encontrado o no válido';
            this.cargando = false;
          }
        );
        this.SpinnerService.hide();
    }

    isExpired(): boolean {
      if (!this.datosCertificado || !this.datosCertificado.expira) {
        return false;
      }
      const fechaExpiracion = new Date(this.datosCertificado.expira);
      return fechaExpiracion < new Date();
    }

}
