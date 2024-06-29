import { Component, OnInit, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Inject } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

interface Plan {
  id: number;
  nombre: string;
  duracionAnios: number;
  years: Year[];
}

interface Year {
  nombre: string;
  duracion: number;
  tieneCertificacion: boolean;
  nombreCertificacion: string;
  cursos: Curso[];
}

interface Curso {
  nombre: string;
  codigo: string;
  esProyecto: boolean;
  prelaciones: string[];
}

@Component({
  selector: 'app-add-edit-programa',
  templateUrl: './add-edit-programa.component.html',
  styleUrls: ['./add-edit-programa.component.scss']
})
export class AddEditProgramaComponent implements OnInit {

  @ViewChild('planModal') planModal!: TemplateRef<any>;
  @ViewChild('cursoModal') cursoModal!: TemplateRef<any>;

  programFormGroup!: FormGroup;
  planFormGroup!: FormGroup;
  cursoFormGroup!: FormGroup;
  planes: Plan[] = [];
  selectedPlanYears: Year[] = [];
  years: Year[] = [];

  departamentos: any []= [];
  type_programs: any []= [];

  displayedColumns: string[] = ['nombre', 'duracionAnios', 'acciones'];

  
  usrsice: string;

  rol: any []= [];

  constructor(private _formBuilder: FormBuilder, private dialog: MatDialog,
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private router: Router
    ) {
      this.obtenerUsuarioActual();
    }

  ngOnInit() { 
    this.programFormGroup = this._formBuilder.group({
      codigo: ['', Validators.required],
      departamento: ['', Validators.required],
      codigo_opsu: ['', [Validators.required, Validators.min(1), Validators.max(99999), Validators.pattern('^[0-9]+$')]],
      tipo_programa: ['', Validators.required],
      nombre: ['', Validators.required],
      siglas: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
    // Cargar datos iniciales
    this.findDepartamentos();
    this.findTypePrograms();

  }

  obtenerUsuarioActual() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.usrsice = currentUser.usrsice;
    this.rol = currentUser.rol;
  }

  findDepartamentos() {
    this.controlestudiosService.getDepartamentos().subscribe(
      (result: any) => {
        this.departamentos = result;
      }
    );
    }

    findTypePrograms() {
      this.controlestudiosService.getTypeProgramasAcademic().subscribe(
        (result: any) => {
          this.type_programs = result;
        }
      );
      }

      getDepartamentoNombre(id_departamento: number): string {
        const dep = this.departamentos.find(d => d.id_departamento === id_departamento);
        return dep ? dep.nombre_departamento : 'N/A';
      }
    
      getTipoProgramaNombre(codelemento: number): string {
        const tipo = this.type_programs.find(t => t.codelemento === codelemento);
        return tipo ? tipo.descripcion : 'N/A';
      }

      transformToUpperCase(value: string): string {
        return value ? value.toUpperCase() : '';
      }
    
      onSubmit(): void {
        if (!this.programFormGroup.valid) {
          console.error('El formulario no es válido.');
          return;
        }
    
        this.SpinnerService.show();
    
        const formData = { ...this.programFormGroup.value, usrsice: this.usrsice };
        formData.nombre = formData.nombre.toUpperCase();
        formData.siglas = formData.siglas.toUpperCase();
    
        const datosPrograma = {
          datosPrograma: formData
        };

        console.log('Enviando datos:', datosPrograma);
    
        this.controlestudiosService.crearPrograma(datosPrograma).subscribe(
          response => {
            if (response.mensaje === 'Registro exitoso') {
              this.notifyService.showSuccess('Programa académico creado');
              this.router.navigate(['/ce-academico/programa-academico']);
            } else {
              this.notifyService.showError2('Ha ocurrido un error: ' + response.mensaje);
              this.router.navigate(['/ce-academico/programa-academico']);
            }
            this.SpinnerService.hide();
          },
          error => {
            console.error('Error al enviar datos al servidor:', error);
            this.notifyService.showError2('Ha ocurrido un error, verifique y si persiste comuníquese con sistemas.');
            this.SpinnerService.hide();
            this.router.navigate(['/ce-academico/programa-academico']);
          }
        );
      }
      
      

      onCodOpsuInput() {
        const codOpsuControl = this.programFormGroup.get('codigo_opsu');
        if (codOpsuControl && codOpsuControl.value) {
          codOpsuControl.setValue(codOpsuControl.value.toString().slice(0, 5), { emitEvent: false });
        }
      }  
}
