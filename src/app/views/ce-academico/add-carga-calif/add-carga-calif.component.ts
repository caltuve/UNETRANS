import { Component,  EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-carga-calif',
  templateUrl: './add-carga-calif.component.html',
  styleUrls: ['./add-carga-calif.component.scss']
})
export class AddCargaCalifComponent {

  procesoCargaForm: FormGroup;
  fechaMinima: Date = new Date(); // Fecha actual como mínima para "Desde"
  fechaMaximaDesde: Date; // Fecha máxima para "Desde", no necesariamente se necesita
  fechaMaximaHasta: Date; // Fecha máxima para "Hasta"
  actuales: any []= [];
  pnfsFiltrados: any []= [];

  @Output() actualizacionCompleta = new EventEmitter<void>();
  calendar: any; // Aquí se almacenan los datos pasados al modal

  constructor(public bsModalRef: BsModalRef,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private fb: FormBuilder) {
      this.fechaMinima.setHours(0, 0, 0, 0);
    // Utiliza 'calendar' para precargar los datos en el formulario del modal
  }

  ngOnInit(): void {
    this.procesoCargaForm = this.fb.group({
      periodo: ['', Validators.required],
      pnf: [{value: '', disabled: true}],
      fechaDesde: ['', Validators.required],
      fechaHasta: [{value: '', disabled: true}, Validators.required],
    });

    this.procesoCargaForm.get('fechaDesde')?.valueChanges.subscribe(val => {
      if (val) {
        const fechaDesde = new Date(val);
        // Establece la fecha mínima para "Hasta" basada en la nueva selección de "Desde"
        this.fechaMinima = new Date(fechaDesde);
        
        this.fechaMaximaHasta = new Date(fechaDesde);
        this.fechaMaximaHasta.setDate(fechaDesde.getDate() + 15); // Calcula 15 días después de "Desde"
        
        // Habilita el campo "fechaHasta" y establece su valor a null para forzar una nueva selección
        const campoFechaHasta = this.procesoCargaForm.get('fechaHasta');
        campoFechaHasta?.setValue(null);
        campoFechaHasta?.enable();
      }
    });
    this.findPeriodos();
    this.onChangesPeriodo();

}


  guardarProceso() {
    if (this.procesoCargaForm.valid) {
      // Implementa la lógica de envío aquí
      console.log(this.procesoCargaForm.value);
      this.controlestudiosService.cargaProcesoCalificaciones(this.procesoCargaForm.value).subscribe({
        next: (response) => {
          if (response.success) {
  
            this.SpinnerService.hide();
            this.notifyService.showSuccess(`${response.message}`);
            this.bsModalRef.hide();
  
          } else if (response.error) {
            
  
            this.SpinnerService.hide();
            this.notifyService.showError(`Error al procesar las calificaciones: ${response.error}`);
            this.bsModalRef.hide();
  
          }
        },
        error: (error) => {
          this.notifyService.showError('Error al enviar los datos al servidor.');
          this.SpinnerService.hide();
          this.bsModalRef.hide();
  
  
        }
      });
      //
    }



   
  }

  

  guardarCambios() {
    const datosParaEnviar = {
      id: this.calendar.id,
      fec_ini: this.calendar.fec_ini,
      fec_fin: this.calendar.fec_fin
      // Añadir más campos si es necesario
    };
  
    this.controlestudiosService.actualizarFechasProceso(datosParaEnviar).subscribe(datos => {
      switch (datos['estatus']) {
        case 'ERROR':
              this.SpinnerService.hide(); 
              this.notifyService.showError2('Ha ocurrido un error, verifique nuevamente y si persiste comuníquese con sistemas.');
              this.bsModalRef.hide(); 
              this.actualizacionCompleta.emit(); // Emite el evento
              break;
        default:
          this.SpinnerService.hide(); 
          this.notifyService.showSuccess('Fechas actualizadas');
          this.bsModalRef.hide();
          this.actualizacionCompleta.emit(); // Emite el evento
          break;
      }
      });
  }

  findPeriodos() {
    this.SpinnerService.show();
    this.controlestudiosService.getPeriodos().subscribe(
      (data: any) => {
        this.actuales = data.actuales;
        this.SpinnerService.hide();
      
      }
    );
  }

  onChangesPeriodo(): void {
    this.procesoCargaForm.get('periodo')?.valueChanges.subscribe(val => {
        const periodoSeleccionado = this.actuales.find(p => p.periodo === val);
        if (periodoSeleccionado) {
            this.cargarPNFsPorPeriodicidad(periodoSeleccionado.periodicidad);
            this.procesoCargaForm.get('pnf')?.enable();
        } else {
            this.procesoCargaForm.get('pnf')?.disable();
            this.procesoCargaForm.get('pnf')?.reset();
        }
    });
}

cargarPNFsPorPeriodicidad(regimen: string): void {
  this.SpinnerService.show();
    this.controlestudiosService.getProgramasActivosRegimen(regimen).subscribe(
      (data: any) => {
        this.pnfsFiltrados = data;
        this.SpinnerService.hide();
      
      }
    );
}

}
