import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl   } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

@Component({
  selector: 'app-add-unidad-curricular-modal',
  templateUrl: './add-unidad-curricular-modal.component.html',
  styleUrls: ['./add-unidad-curricular-modal.component.scss']
})
export class AddUnidadCurricularModalComponent {

  @Output() actualizacionCompleta = new EventEmitter<{ completo: boolean }>();

  unidadCurricularForm: FormGroup;

constructor(private fb: FormBuilder, 
            public bsModalRef: BsModalRef,
            public controlestudiosService: ControlEstudiosService,
            private SpinnerService: NgxSpinnerService,
            private notifyService : NotificacionService,) {}

            ngOnInit(): void {
              // Inicializar el formulario
              this.unidadCurricularForm = this.fb.group({
                codigo_uc: '',
                nombre_uc: '',
                creditos: '',
                HTA: '',
                HTI: '',
                HTL: '',
                tienePrelaciones: false,
                esElectiva: false,
                esElectivaPadre: false,
                esProyecto: false
              });
          
              // Suscripciones a cambios en el formulario
              this.subscribeToFormChanges();
            }
          
            // Método para suscribirse a cambios en el formulario
            subscribeToFormChanges(): void {
              this.unidadCurricularForm.get('esProyecto')?.valueChanges.subscribe(esProyecto => {
                // Aquí no se realizará ningún cálculo adicional
              });
            }
          
            onSubmit(): void {
              if (!this.unidadCurricularForm.valid) {
                console.error('El formulario no es válido.');
                return;
              }
          
              this.SpinnerService.show();
          
              // Recolectar los datos del formulario
              const datosFormulario = this.unidadCurricularForm.value;
          
              // Enviar datos al backend
              this.controlestudiosService.agregarUnidadCurricular(datosFormulario).subscribe(
                response => {
                  // Aquí puedes manejar la respuesta, como mostrar un mensaje al usuario
                  this.actualizacionCompleta.emit({ completo: true });
                  this.notifyService.showSuccess('Unidad curricular cargada');
                  this.bsModalRef.hide(); // Cerrar modal
                  this.SpinnerService.hide();
                },
                error => {
                  console.error('Error al enviar datos al servidor:', error);
                  // Manejo de errores, por ejemplo, mostrar un mensaje de error
                  this.actualizacionCompleta.emit({ completo: false });
                  this.notifyService.showError2('Ha ocurrido un error, verifique y si persiste comuníquese con sistemas.');
                  this.bsModalRef.hide(); // Cerrar modal
                  this.SpinnerService.hide();
                }
              );
            }

}
