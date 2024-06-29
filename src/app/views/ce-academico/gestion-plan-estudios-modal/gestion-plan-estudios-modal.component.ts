import { Component,  OnInit, AfterViewInit , EventEmitter, Output  } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

@Component({
  selector: 'app-gestion-plan-estudios-modal',
  templateUrl: './gestion-plan-estudios-modal.component.html',
  styleUrls: ['./gestion-plan-estudios-modal.component.scss']
})
export class GestionPlanEstudiosModalComponent implements OnInit, AfterViewInit {

  @Output() actualizacionCompleta = new EventEmitter<boolean>();
  gestionPlanForm: FormGroup;
  public nombrePrograma: string;
  codigoPlan: string = '';
  descripcion: string = '';
  estatus: string = '';
  vigDesde: Date;
  vigHasta: Date;
  trayectos: any[] = [];
  situacion: any []= [];
  datosPrograma: any; // O el tipo específico de tus datos de programa
  menciones: any; // O el tipo específico de tus datos de programa
  escalas = []; // Cargar tus opciones de escalas de calificaciones

  constructor(public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,) {}

    ngOnInit(): void {
      this.gestionPlanForm = this.fb.group({
        codigoPlan: '',
        nombrePlan: '',
        descripcion: '',
        estatus: '',
        vig_desde: '',
        vig_hasta: [{ value: '', disabled: false }],
        tieneTransicion: false,
        trayectos: this.fb.array([]),
        escalaCalificaciones: [''],
        mencion: ['']
      });
  
      // Suscribirse a los cambios del checkbox de trayecto de transición
      this.gestionPlanForm.get('tieneTransicion')?.valueChanges.subscribe((tieneTransicion) => {
        this.actualizarNombresTrayectos();
      });

      // Suscribirse a cambios en el valor de 'estatus' y aplicar la lógica
  this.gestionPlanForm.get('estatus')?.valueChanges.subscribe(estatus => {
    if (estatus === 'A') {
      this.gestionPlanForm.get('vig_hasta')?.disable();
    } else {
      this.gestionPlanForm.get('vig_hasta')?.enable();
    }
  });

      this.findSituacion();
      this.actualizarEstadoVigHasta(this.gestionPlanForm.get('estatus')?.value);
    
    }

    ngAfterViewInit() {
      // Acceder a los datos del modal después de que la vista se haya inicializado
      if (this.bsModalRef.content && 'datosPrograma' in this.bsModalRef.content) {
        this.datosPrograma = this.bsModalRef.content.datosPrograma;
        this.menciones = this.bsModalRef.content.menciones;
      }
    }

    actualizarEstadoVigHasta(estatus: string): void {
      if (estatus === 'A') {
        this.gestionPlanForm.get('vig_hasta')?.disable();
      } else {
        this.gestionPlanForm.get('vig_hasta')?.enable();
      }
    }

    actualizarNombresTrayectos(): void {
      this.trayectosFormArray.controls.forEach((control, index) => {
        // Asegúrate de que el control 'nombre' existe antes de establecer su valor
        control.get('nombre')?.setValue(this.calcularNumeroTrayecto(index));
      });
    }
  
    get trayectosFormArray(): FormArray {
      return this.gestionPlanForm.get('trayectos') as FormArray;
    }
  
    agregarTrayecto(): void {
      const nombreTrayecto = this.calcularNumeroTrayecto(this.trayectosFormArray.length);
    
      if (this.trayectosFormArray.length < (this.gestionPlanForm.value.tieneTransicion ? 7 : 6)) {
        const nuevoTrayecto = this.fb.group({
          nombre: nombreTrayecto,
          semestres: this.fb.array([])
        });
    
        if (this.datosPrograma[0]?.regimen === 'SEMESTRAL') {
          this.añadirSemestres(nuevoTrayecto, this.trayectosFormArray.length);
        }
    
        this.trayectosFormArray.push(nuevoTrayecto);
      }
    }

    añadirSemestres(trayectoFormGroup: FormGroup, indiceTrayecto: number): void {
      const semestresArray = trayectoFormGroup.get('semestres') as FormArray;
      const numeroSemestres = indiceTrayecto === 0 ? 1 : 2; // Solo 1 semestre para el trayecto 0
    
      for (let i = 0; i < numeroSemestres; i++) {
        // Calcula el número del semestre
        const numeroSemestre = indiceTrayecto === 0 ? 0 : (indiceTrayecto - 1) * 2 + i + 1;
        semestresArray.push(this.fb.group({
          numero: numeroSemestre
        }));
      }
    }
  
    calcularNumeroTrayecto(index: number): string {
      if (this.gestionPlanForm.value.tieneTransicion) {
        if (index === 3) return 'Trayecto de Transición';
        if (index > 2) return `Trayecto ${index - 1}`;
      }
      return `Trayecto ${index}`;
    }
  
    onSubmit(): void {
      if (!this.gestionPlanForm.valid) {
        console.error('El formulario no es válido.');
        return;
      }
    
      // Recolectar los datos del formulario
  const datosFormulario = this.gestionPlanForm.value;

  // Estructurar los datos de los trayectos y sus semestres
  const trayectos = datosFormulario.trayectos.map((trayecto: any) => ({
    nombre: trayecto.nombre,
    semestres: trayecto.semestres.map((semestre: any) => semestre.numero)
  }));

  // Estructurar todos los datos en un solo objeto
  const datosFormularioCompleto = {
    codigoPlan: datosFormulario.codigoPlan,
    nombrePlan: datosFormulario.nombrePlan,
    descripcion: datosFormulario.descripcion,
    estatus: datosFormulario.estatus,
    vig_desde: datosFormulario.vig_desde,
    vig_hasta: datosFormulario.vig_hasta,
    tieneTransicion: datosFormulario.tieneTransicion,
    codPrograma: this.datosPrograma[0]?.cod_opsu,
    trayectos
  };

  // Enviar todos los datos al backend
this.enviarDatosPlanEstudios(datosFormularioCompleto);

  //console.log(datosFormularioCompleto);
    
    }

    findSituacion() {
      this.controlestudiosService.getSituacion().subscribe(
        (result: any) => {
          this.situacion = result;
        }
      );
      }

      enviarDatosPlanEstudios(datosPlan: any) {
        this.SpinnerService.show(); 
        this.controlestudiosService.crearPlanEstudios(datosPlan).subscribe(
          datos => {
            switch (datos['estatus']) {
              case 'ERROR':
                    this.SpinnerService.hide(); 
                    this.notifyService.showError2('Ha ocurrido un error, verifique nuevamente y si persiste comuníquese con sistemas.');
                    this.bsModalRef.hide();
                    this.actualizacionCompleta.emit(true); // Emite el evento
                    break;
              default:
                this.SpinnerService.hide(); 
                this.notifyService.showSuccess('Plan ha sido añadido');
                this.bsModalRef.hide();
                this.actualizacionCompleta.emit(true); // Emite el evento
                break;
            }
          });
      }


      onTipoProgramaChange(tipo: string) {
        if (tipo === 'Carrera') {
          // Configurar trayectos para Carrera (3 años)
          this.trayectosFormArray.clear();
          for (let i = 1; i <= 3; i++) {
            this.trayectosFormArray.push(this.fb.group({
              nombre: [`Año ${i}`]
            }));
          }
        } else {
          this.trayectosFormArray.clear();
        }
      }
}
