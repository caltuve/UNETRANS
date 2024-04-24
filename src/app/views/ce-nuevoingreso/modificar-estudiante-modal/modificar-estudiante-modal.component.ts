import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AspiranteService } from '../../aspirante/aspirante.service';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

interface RespuestaServidor {
  success?: boolean;
  error?: string;
}

@Component({
  selector: 'app-modificar-estudiante-modal',
  templateUrl: './modificar-estudiante-modal.component.html',
  styleUrls: ['./modificar-estudiante-modal.component.scss']
})
export class ModificarEstudianteModalComponent implements OnInit {

  firstFormGroup: FormGroup;
  estudianteBase: any; // Ajusta según el tipo de dato de tu estudiante
  inscrito: boolean = false;
  inscripcion: any []= [];

  usrsice: string;

  nacs: any []= [];
  genero: any []= [];
  edocivil: any []= [];
  gruposan: any []= [];

  minDate1!: Date;
  maxDate1!: Date;
  minDate2!: Date;
  maxDate2!: Date;
  minDate3!: Date;
  maxDate3!: Date;

  constructor(public modalRef: BsModalRef,
    public aspiranteService: AspiranteService,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private fb: FormBuilder) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      this.minDate1 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate1 = new Date(currentYear - 14, currentMonth, currentDay);
      this.minDate2 = new Date(currentYear - 69, currentMonth, currentDay);
      this.maxDate2 = new Date(currentYear , currentMonth, currentDay);
      this.minDate3 = new Date(currentYear - 90, currentMonth, currentDay);
      this.maxDate3 = new Date(currentYear - 14, currentMonth, currentDay);
      this.obtenerUsuarioActual();
     }

  ngOnInit(): void {
    this.findNac();
    this.findGen();
    this.findEdoCivil();
    this.findGrupoSan();
    this.firstFormGroup = this.fb.group({
      codpersona: [''],
      nac: [''], // Inicializa con valores vacíos o predeterminados
      ced_pas: [''],
      fec_nac: [''],
      primer_nombre: [''],
      segundo_nombre: [''],
      primer_apellido: [''],
      segundo_apellido: [''],
      genero: [''],
      edo_civil: [''],
      gruposan: [''],
      usrsice: [''],
      // Añade aquí otros campos necesarios
    });
    if (this.estudianteBase) {
      this.firstFormGroup.patchValue({
        codpersona: this.estudianteBase.codpersona,
        nac: this.estudianteBase.nac,
        ced_pas: this.estudianteBase.ced_pas,
        fec_nac: this.convertirFecha(this.estudianteBase.fecnac),
        primer_nombre: this.estudianteBase.nombre,
        segundo_nombre: this.estudianteBase.nombreseg,
        primer_apellido: this.estudianteBase.apellido,
        segundo_apellido: this.estudianteBase.apellseg,
        genero: this.estudianteBase.cod_sexo,
        edo_civil: this.estudianteBase.cod_edocivil,
        gruposan: this.estudianteBase.cod_gsanguineo,
        usrsice: this.usrsice
        // Asegúrate de convertir las fechas de string a objetos Date según sea necesario
        // Añade aquí otros campos según corresponda
      });
    }
  }

  obtenerClaseColor(estatus: string): string {
    switch (estatus) {
      case 'OKSICE': return 'text-success';
      case 'NOKSICE': return 'text-danger';
      default: return '';
    }
  }
  
  obtenerNombreIcono(estatus: string): string {
    switch (estatus) {
      case 'OKSICE': return 'cilCheckCircle';
      case 'NOKSICE': return 'cilBan';
      default: return 'cilBan';
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  findNac(){
    this.aspiranteService.getNac().subscribe(
      (result: any) => {
          this.nacs = result;
    }
    );
  }
  
  findGen(){
    this.aspiranteService.getGen().subscribe(
      (result: any) => {
          this.genero = result;
    }
    );
  }
  
  
  findEdoCivil(){
    this.aspiranteService.getEdoCivil().subscribe(
      (result: any) => {
          this.edocivil = result;
    }
    );
  }
  
  findGrupoSan(){
    this.aspiranteService.getGrupoSan().subscribe(
      (result: any) => {
          this.gruposan = result;
    }
    );
  }

  convertirFecha(fechaStr: string): Date {
    if (!fechaStr) { // Esto comprueba si fechaStr es null, undefined, o una cadena vacía
      return new Date(); // O cualquier otra fecha por defecto que desees usar
    }
  
    const partes = fechaStr.split('-');
    if (partes.length === 3) {
      const fecha = new Date(parseInt(partes[2], 10), parseInt(partes[1], 10) - 1, parseInt(partes[0], 10));
      return fecha;
    }
    return new Date(); // Retorna una fecha por defecto si el formato no es correcto
  }

  enviarDatos() {
    this.SpinnerService.show();
    if (this.firstFormGroup.valid) {
      this.controlestudiosService.actualizarDatos(this.firstFormGroup.value).subscribe({
        next: (response: RespuestaServidor) => {
          if (response.success) {
            this.closeModal();
            this.SpinnerService.hide();
            this.notifyService.showSuccess('Los datos del estudiante han sido actualizados correctamente.');
            
          } else if (response.error) {
            
            this.closeModal();
            this.SpinnerService.hide();
            this.notifyService.showError(`Error al actualizar los datos: ${response.error}`);
          }
        },
        error: (error) => {
          this.notifyService.showError('Error al enviar los datos al servidor.');
          this.closeModal();
        }
      });
  }
}

obtenerUsuarioActual() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  this.usrsice = currentUser.usrsice;
}

}
