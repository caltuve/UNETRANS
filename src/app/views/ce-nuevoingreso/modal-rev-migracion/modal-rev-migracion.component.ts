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
  formNombresApellidos: FormGroup;
  estudianteBase: any; // Ajusta según el tipo de dato de tu estudiante
  detallesIncorrectos: any[];

  usrsice: string;

  detalles_file: string;

  rol: any []= [];

  pnfs: any []= [];

  modalidadesIngreso: any []= [];

  copiado = false;

  copiadoCorreo = false;

  anioActual = new Date().getFullYear();
  detalles: any;

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
        cohorte: ['', [Validators.required, Validators.pattern(/^\d{4}$/), Validators.max(this.anioActual), Validators.min(1971)]],
        modalidadIngreso: ['', Validators.required],
        pnf: ['', Validators.required],
        trayectoIngreso: ['', [Validators.required, Validators.pattern(/^\d{1}$/), Validators.max(6), Validators.min(0)]],
        trayectoActual: ['', [Validators.required, Validators.pattern(/^\d{1}$/), Validators.max(6), Validators.min(0)]],
        nombre: ['', Validators.required],
        nombrecorto: ['', Validators.required],
        email: ['', Validators.required],
        cedula: ['', Validators.required],
      });
    
      this.cargarDatosIniciales();
      this.findCarreras();
      this.findModIngreso();
    }

    cargarDatosIniciales() {
      // Aplica los valores iniciales al formulario
      this.form.patchValue({
        cohorte: this.estudianteBase.cohorte,
        pnf: this.estudianteBase.pnf,
        trayectoIngreso: this.estudianteBase.trayecto_ing,
        trayectoActual: this.estudianteBase.trayecto,
        nombre: this.estudianteBase.nombre_completo,
        nombrecorto: this.estudianteBase.nombre_corto,
        email: this.estudianteBase.email,
        cedula:  this.estudianteBase.cedula,
      });
    
      // Inicializar el formulario de nombres y apellidos si es necesario
      this.detallesIncorrectos.forEach(detalle => {
        if (detalle.tipo === 'nombresApellidos') {
          this.initializeNombresApellidosForm(JSON.parse(detalle.detalle));
        }
      });
    
      this.actualizarDisponibilidadCampoPNF();
    }
    
    initializeNombresApellidosForm(detalles: any) {
      this.formNombresApellidos = this.fb.group({
        primerNombre: [detalles.primerNombre, Validators.required],
        segundoNombre: [detalles.segundoNombre],
        primerApellido: [detalles.primerApellido, Validators.required],
        segundoApellido: [detalles.segundoApellido],
        actualizarDatos: ['', Validators.required]
      });
    
      this.detalles = detalles;
    }

    actualizarDisponibilidadCampoPNF() {
      const rol = this.rol; // Obtiene el rol del usuario
      const esRolPermitido = this.rol.some(rol => rol === '001' || rol === '003');
      const esPnfNull = !this.form.get('pnf')?.value;
    
      // Habilita el campo si el rol es permitido o si el valor de PNF es null
      if (esRolPermitido || esPnfNull) {
        this.form.get('pnf')?.enable({ emitEvent: false }); // No emite evento para evitar loops
      } else {
        this.form.get('pnf')?.disable({ emitEvent: false });
      }
    }

    closeModal() {
      const data = { 
        cedula: this.estudianteBase.cedula, 
        en_gestion: false, 
        gestor: null,
        revision: 'RDI' 
      };
      this.controlestudiosService.marcarEnGestion(data).subscribe(
        () => {
          
          this.modalRef.hide();
        },
        error => {
          console.error('Error al desmarcar solicitud como en gestión:', error);
          this.modalRef.hide(); // Asegurarse de cerrar el modal incluso si hay un error
        }
      );
      this.actualizacionCompleta.emit();
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
  // Combina los valores de ambos formularios
  const combinedFormData = {
    ...this.form.value,
    ...this.formNombresApellidos?.value, // Asegúrate de que formNombresApellidos no sea undefined
  };

  if (this.form.valid && (!this.formNombresApellidos || this.formNombresApellidos.valid)) {
    console.log(combinedFormData);
    this.controlestudiosService.actualizarDatosEstudianteRDI(combinedFormData).subscribe({
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
  } else {
    this.SpinnerService.hide();
    this.notifyService.showError('Por favor complete todos los campos obligatorios.');
  }
}

diferirRevision() {
  const data = { 
    cedula: this.estudianteBase.cedula, 
    revision: 'RDI'  // Constante para la revisión diferida
  };

  this.controlestudiosService.marcarRevDiferida(data).subscribe(
    () => {
      this.modalRef.hide();  // Cierra el modal al completar la operación
      console.log('Revisión diferida exitosamente');
    },
    error => {
      console.error('Error al diferir la revisión:', error);
      this.modalRef.hide();  // Asegura que el modal se cierre incluso si hay un error
    }
  );
  this.actualizacionCompleta.emit();  // Emitir evento para indicar que la operación ha completado
}



obtenerDescripcionDetalle(tipo: string): string {
  switch (tipo) {
    case 'cohorte':
      return '🚨 Cohorte Incorrecta - Revisar 🚨';
    case 'pnfCarrera':
      return '🚨 PNF/Carrera Incorrecta - Revisar 🚨';
    case 'multipleCarrera':
      return '🔔 Múltiples Carreras Indicadas - Recuerda matricular la carrera más antigua, incluso si está cerrada 🔔';
    default:
      return 'Datos incorrectos - Revisar';
  }
}

copiarCedula() {
  const cedula = this.estudianteBase.cedula;
  navigator.clipboard.writeText(cedula).then(() => {
    this.copiado = true;
    setTimeout(() => {
      this.copiado = false;
    }, 4000); // Oculta el mensaje después de 2 segundos
  }, (err) => {
    console.error('Error al copiar cédula: ', err);
  });
}

copiarCorreo() {
  const correo = String(this.estudianteBase.email); // Asegúrate de que sea una cadena de texto
  navigator.clipboard.writeText(correo).then(() => {
    this.copiadoCorreo = true;
    setTimeout(() => {
      this.copiadoCorreo = false;
    }, 4000); // Oculta el mensaje después de 4 segundos
  }, (err) => {
    console.error('Error al copiar correo: ', err);
  });
}


}