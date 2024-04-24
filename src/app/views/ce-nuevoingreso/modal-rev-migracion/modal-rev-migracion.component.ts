import { Component, OnInit, ChangeDetectorRef , EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AspiranteService } from '../../aspirante/aspirante.service';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

interface RespuestaServidor {
  success?: boolean;
  error?: string;
}

@Component({
  selector: 'app-modal-rev-migracion',
  templateUrl: './modal-rev-migracion.component.html',
  styleUrls: ['./modal-rev-migracion.component.scss']
})
export class ModalRevMigracionComponent implements OnInit {

  @Output() actualizacionCompleta = new EventEmitter<void>();

  form: FormGroup;
  estudianteBase: any; // Ajusta según el tipo de dato de tu estudiante

  usrsice: string;

  rol: any []= [];

  pnfs: any []= [];

  modalidadesIngreso: any []= [];


  anioActual = new Date().getFullYear();

  constructor(public modalRef: BsModalRef,
    public aspiranteService: AspiranteService,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {
      this.obtenerUsuarioActual();
     }

     ngOnInit(): void {
      this.form = this.fb.group({
        carnet: [{value: ''}], // Asigna el valor inicial y marca como solo lectura
        cedula: ['', Validators.required],
        usrsice: ['', Validators.required],
        cohorte: ['', [Validators.required, Validators.pattern(/^\d{4}$/), Validators.max(this.anioActual),Validators.min(1971)]],
      modalidadIngreso: ['', Validators.required],
      pnf: ['', Validators.required],
      trayectoIngreso: ['', [Validators.required, Validators.pattern(/^\d{1}$/), Validators.max(6),Validators.min(0)]],
      trayectoActual: ['', [Validators.required, Validators.pattern(/^\d{1}$/), Validators.max(6),Validators.min(0)]],
      nombre: ['', Validators.required],
      nombrecorto: ['', Validators.required],
      email: ['', Validators.required],
      });
  
      // Aquí puedes cargar los datos iniciales del estudiante para asignarlos al formulario
      this.cargarDatosIniciales();
      this.findCarreras();
      this.findModIngreso();

    }

    cargarDatosIniciales() {
      // Suponiendo que estudianteBase es un objeto con tus datos
      this.form.patchValue({
        cohorte: this.estudianteBase.cohorte, // Asigna el valor de cohorte
        pnf: this.estudianteBase.pnf, // Asigna el valor de pnf
        //modalidadIngreso: this.estudianteBase.modalidadIngreso, // Asigna modalidad de ingreso
        carnet: this.estudianteBase.carnet, // Asigna el valor de carnet
        trayectoIngreso: this.estudianteBase.trayecto_ing,
        trayectoActual: this.estudianteBase.trayecto,
        cedula: this.estudianteBase.cedula,
        usrsice: this.usrsice,
        nombre: this.estudianteBase.nombre_completo,
        nombrecorto: this.estudianteBase.nombre_corto,
        email:  this.estudianteBase.email,
      });
      // Actualiza la disponibilidad del campo PNF después de cargar los datos
  this.actualizarDisponibilidadCampoPNF();
    }


    actualizarDisponibilidadCampoPNF() {
      const rol = this.rol; // Obtiene el rol del usuario
      const esRolPermitido = this.rol.some(rol => rol === '001' || rol === '002');
      const esPnfNull = !this.form.get('pnf')?.value;
    
      // Habilita el campo si el rol es permitido o si el valor de PNF es null
      if (esRolPermitido || esPnfNull) {
        this.form.get('pnf')?.enable({ emitEvent: false }); // No emite evento para evitar loops
      } else {
        this.form.get('pnf')?.disable({ emitEvent: false });
      }
    }

  closeModal() {
    this.modalRef.hide();
  }

  findCarreras(){
    this.aspiranteService.getCarreras().subscribe(
      (result: any) => {
          this.pnfs = result;
    }
    );
  }

  findModIngreso(){
    this.aspiranteService.getModIngreso().subscribe(
      (result: any) => {
          this.modalidadesIngreso = result;
    }
    );
  }

obtenerUsuarioActual() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  this.usrsice = currentUser.usrsice;
  this.rol = currentUser.rol;
}


actualizaRdi() {
  this.SpinnerService.show();
  if (this.form.valid) {
    console.log(this.form.value);
    this.controlestudiosService.actualizarDatosEstudianteRDI(this.form.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.closeModal();
          this.SpinnerService.hide();
          this.notifyService.showSuccess('Solicitud de revisión procesada');
          this.actualizacionCompleta.emit(); // Emite el evento
          
        } else if (response.error) {
          
          this.closeModal();
          this.SpinnerService.hide();
          this.notifyService.showError(`Error al procesar los datos: ${response.error}`);
          this.actualizacionCompleta.emit(); // Emite el evento
        }
      },
      error: (error) => {
        this.notifyService.showError('Error al enviar los datos al servidor.');
        this.closeModal();
      }
    });
  }
}

}