import { Component, Input, OnInit } from '@angular/core';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {FormBuilder, Validators,FormControl, FormGroup} from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { NgxSpinnerService } from "ngx-spinner";

import { NotificacionService } from './../../../notificacion.service'

export interface Docente {
  cedula: string;
  nombre: string;
}

@Component({
  selector: 'app-edit-acta-ce',
  templateUrl: './edit-acta-ce.component.html',
  styleUrls: ['./edit-acta-ce.component.scss']
})
export class EditActaCeComponent implements OnInit{

  firstFormGroup: FormGroup;

  docenteCtrl = new FormControl();
  filteredDocentes: Observable<{ cedula: string; nombre: string; }[]>;
  todosLosDocentes: Docente[] = [];

  @Input() detalle_acta: any;

  seccion: number;
  //cuposmax: number;
  //docente: string;
  tseccion: any[] = [];

  cedulaDocenteSeleccionada: string;

  carreraSeleccionada: any;
  periodoSeleccionado: any;
  //tiposeccion: string;

  usr={
    nac:null,
    cedula:null,
    nombre_completo:null,
    nombre_corto:null,
    fecnac:null,
    carnet:null,
    pnf:null,
    email: null,
    saludo: null,
    usrsice: null,
  }

  //detalle_acta: any;
  tiposeccion: string;
  cuposmax: number;
  docente: string;

  constructor(public modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    public controlestudiosService: ControlEstudiosService,) {}

    ngOnInit() { 
      this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
      this.docenteCtrl = new FormControl();
      this.firstFormGroup = this.formBuilder.group({
        // Aquí defines los controles de tu formulario
        tiposeccion: ['', Validators.required],
        cuposmax: [0, Validators.required],
        docente: ['', Validators.required],
        usrsice: ['', Validators.required],
        acta: ['', Validators.required],
        docenteNombre: [''], // Control para la visualización del nombre
      });
      this.findTipoSeccion();
      this.findAllDocentes();
      this.filteredDocentes = this.docenteCtrl.valueChanges
  .pipe(
    startWith(''),
    map(value => {
      // Si 'value' es un objeto y tiene la propiedad 'nombre', devuelve 'nombre', 
      // de lo contrario, si es una cadena, úsala tal cual.
      return typeof value === 'string' ? value : (value && value.nombre ? value.nombre : '');
    }),
    map(value => this._filter(value))
  );

  
  
  }

  findTipoSeccion(){

    this.controlestudiosService.getTipoSeccion().subscribe(
      (result: any) => {
          this.tseccion = result;

    }
    );
  }

  findAllDocentes(){
    this.controlestudiosService.getAllDocentes().subscribe(
      (docentes: Docente[]) => {
        this.todosLosDocentes = docentes;
        //console.log(this.todosLosDocentes); 
        this.inicializarFormularioConDatos();
      },
      error => {
        console.error('Hubo un error al obtener los docentes', error);
      }
    );
  }

  private _filter(value: string | { cedula: string, nombre: string }): { cedula: string, nombre: string }[] {
    let filterValue = '';
  
    // Comprueba si 'value' es un objeto con la propiedad 'nombre', y si es así, usa esa propiedad.
    // De lo contrario, si 'value' es una cadena, úsala directamente.
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else if (value && typeof value.nombre === 'string') {
      filterValue = value.nombre.toLowerCase();
    }
  
    return this.todosLosDocentes.filter(docente =>
      docente.nombre.toLowerCase().includes(filterValue)
    );
  }

  inicializarFormularioConDatos() {
    // Suponiendo que 'detalle_acta' ya tiene los datos cargados
    const datos = this.detalle_acta[0][0];
  
    const cedulaDocente = this.detalle_acta[0][0].cedula_docente;
    const docenteParaAutocompletar = this.todosLosDocentes.find(docente => docente.cedula === cedulaDocente);

  if (docenteParaAutocompletar) {
    this.docenteCtrl.setValue(docenteParaAutocompletar);
  }

  

    if (datos) {
      // Encuentra el docente correspondiente
      const docenteEncontrado = this.todosLosDocentes.find(d => d.cedula === datos.docente);
  
      // Actualiza el formulario reactivo con los valores
      this.firstFormGroup.patchValue({
        tiposeccion: datos.tipo_sec,
        cuposmax: datos.cupos_max,
        docente: docenteEncontrado ? docenteEncontrado : null,
        usrsice: datos.usrsice,
        acta: datos.acta
      });
      // Comprobación para asegurarse de que detalle_acta y sus elementos no son null
  if (this.detalle_acta && this.detalle_acta[0] && this.detalle_acta[0][0] && this.detalle_acta[0][0].acta) {
    this.firstFormGroup.get('acta')?.setValue(this.detalle_acta[0][0].acta);
  }

  // Verifica si 'usr' tiene la propiedad 'usrsice'
  if (this.usr && this.usr.usrsice) {
    this.firstFormGroup.get('usrsice')?.setValue(this.usr.usrsice);
  }
    }
  }

  displayFn(docente: Docente | null): string {
    if (!docente) {
      return '';
    }
    // Retorna el nombre completo del docente para la visualización
    return docente.nombre;
  }


  // onSelectionChanged(event: MatAutocompleteSelectedEvent) {
  //   const docenteSeleccionado = event.option.value as Docente;
  //   this.docenteCtrl.setValue(docenteSeleccionado.nombre); // Actualizar para mostrar el nombre
  //   this.firstFormGroup.get('docente')?.setValue(docenteSeleccionado.cedula); // Suponiendo que quieres enviar la cédula
  // }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    const docenteSeleccionado = event.option.value as Docente;
    this.firstFormGroup.get('docenteNombre')?.setValue(docenteSeleccionado.nombre); // Para mostrar el nombre
    this.firstFormGroup.get('docente')?.setValue(docenteSeleccionado.cedula); // Para enviar la cédula
  }


  closeModal() {
    this.modalRef.hide();
  }

  guardar(): void {
    this.SpinnerService.show(); 
        
    // Esta función se ejecutará cuando se haga clic en "Guardar Datos" en el último step
    // Puedes acceder a los datos de cada step utilizando this.step1Form.value, this.step2Form.value, etc.
    const datosStep1 = this.firstFormGroup.value;
  
  
      const datosCompletos = {
        step1: datosStep1,
      };
  
      //console.log(datosCompletos);
      
      this.controlestudiosService.modSeccion(datosCompletos).subscribe(datos => {
        switch (datos['estatus']) {
          case 'ERROR':
                this.SpinnerService.hide(); 
                this.notifyService.showError2('Ha ocurrido un error, verifique y si persiste comuníquese con sistemas.');
                //this.gestionNewSeccion.hide(); 
                this.firstFormGroup.reset();
                //this.mostrarTrayectos = false;
                break;
          default:
            //this.gestionNewSeccion.hide();
            this.SpinnerService.hide();
            this.notifyService.showSuccess('Sección modificada para el periodo seleccionado');
             
            this.firstFormGroup.reset();
            //this.mostrarTrayectos = false;
            break;
        }
      });
  }


}
