import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NotificacionService } from './../../../notificacion.service';

@Component({
  selector: 'app-datos-pago-movil',
  templateUrl: './datos-pago-movil.component.html',
  styleUrls: ['./datos-pago-movil.component.scss']
})
export class DatosPagoMovilComponent implements OnInit {
  @Input() solicitud: any;
  @Input() tasaConversion: number; // Recibir la tasa de conversión
  pagoForm: FormGroup;

  montoEnEuro: number = 0;
  montoEnBolivares: number = 0;
  maxFecha: Date;
  minFecha: Date;
  

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private controlEstudiosService: ControlEstudiosService,
    private notifyService: NotificacionService
  ) {}

  ngOnInit(): void {
    console.log('Solicitud recibida en el modal:', this.solicitud); // Debe mostrar la solicitud correctamente
    console.log('Tasa de conversión recibida en el modal:', this.tasaConversion); // Debe mostrar la tasa de conversión correctamente


  
    if (this.solicitud?.monto && this.tasaConversion) {
      this.montoEnEuro =  parseFloat(this.solicitud.monto);
      this.montoEnBolivares = parseFloat(this.solicitud.monto)  * this.tasaConversion;
    } else {
      console.warn('Datos insuficientes para calcular el monto en bolívares');
      this.montoEnBolivares = 0; // Valor por defecto en caso de datos incompletos
    }

    const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();
      
      this.minFecha  = new Date(currentYear, currentMonth, currentDay-2);
      this.maxFecha = new Date(currentYear, currentMonth, currentDay);
  
    this.pagoForm = this.fb.group({
      monto: ['', [Validators.required]],
      referencia: ['', [Validators.required]],
      fechaPago: ['', [Validators.required]]
    });

    
  }

  private formatearFechaLocal(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses son base 0
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`; // Formato YYYY-MM-DD
  }
  

  reportarPago(): void {
    // if (this.pagoForm.valid) {
    //   const pagoData = this.pagoForm.value;
      
    //   // Aquí puedes enviar los datos al backend y actualizar el estatus de la solicitud
    //   this.controlEstudiosService.reportarPagoSolicitud(pagoData).subscribe(
    //     response => {
    //       if (response.success) {
    //         this.notifyService.showSuccess('Pago reportado exitosamente.');
    //         this.bsModalRef.hide();
    //       } else {
    //         this.notifyService.showError('Hubo un problema al reportar el pago.');
    //       }
    //     },
    //     error => {
    //       console.error('Error al reportar el pago:', error);
    //       this.notifyService.showError('Error en el reporte de pago.');
    //     }
    //   );
    // }
  }

  // Función para formatear el monto al escribir
  onInputChange(event: any): void {
    const input = event.target.value.replace(/[^0-9]/g, ''); // Quita caracteres no numéricos
    let numericValue = parseFloat(input) / 100; // Coloca el decimal en el lugar correcto

    if (isNaN(numericValue)) {
      numericValue = 0;
    }

    const formattedInput = numericValue.toFixed(2); // Asegura dos decimales
    this.pagoForm.patchValue({ monto: formattedInput }, { emitEvent: false });

    // Posiciona el cursor al final
    setTimeout(() => {
      event.target.selectionStart = event.target.value.length;
      event.target.selectionEnd = event.target.value.length;
    }, 0);
  }

  // Limita `referencia` solo a números
  onReferenciaInput(event: any): void {
    const input = event.target.value.replace(/[^0-9]/g, ''); // Solo números
    this.pagoForm.patchValue({ referencia: input }, { emitEvent: false });
  }

 // Validador personalizado para la fecha de pago
 validarFechaPago() {
  return (control: AbstractControl) => {
    const fechaSeleccionada = new Date(control.value).getTime();
    const hoy = new Date().setHours(0, 0, 0, 0); // Fecha de hoy a las 00:00
    const haceTresDias = new Date(hoy);
    haceTresDias.setDate(haceTresDias.getDate() - 3); // Hace 3 días a las 00:00

    if (fechaSeleccionada > hoy || fechaSeleccionada < haceTresDias.getTime()) {
      return { fechaInvalida: true }; // Retorna error si está fuera del rango
    }
    return null; // Validez OK
  };
}

  close(): void {
    this.bsModalRef.hide();
  }
}
