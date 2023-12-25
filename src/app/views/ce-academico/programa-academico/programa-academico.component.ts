import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddEditProgramaComponent } from './../add-edit-programa/add-edit-programa.component';

import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { NgxSpinnerService } from "ngx-spinner";
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programa-academico',
  templateUrl: './programa-academico.component.html',
  styleUrls: ['./programa-academico.component.scss']
})
export class ProgramaAcademicoComponent implements AfterViewInit {
  bsModalRef: BsModalRef;

  programas = new MatTableDataSource();
  displayedColumnsProcesos: string[] = ['cod_opsu', 'tipo_prog', 'nom_pro',  'regimen', 'departamento', 'jefe', 'gestion'];

  constructor(private modalService: BsModalService,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private router: Router
    ) {}

    rangeLabel = 'Mostrando ${start} – ${end} de ${length}';

    @ViewChild('paginatorProcesos') paginatorProcesos: MatPaginator;

    ngAfterViewInit() {
      this.paginatorProcesos._intl.itemsPerPageLabel = 'Mostrando de ${start} – ${end} registros';
      this.paginatorProcesos._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `Mostrando 0 de ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `Mostrando ${startIndex + 1} – ${endIndex} de ${length} registro(s)`;
      };
    
      this.programas.paginator = this.paginatorProcesos;
      this.findProgramasActivos();
  }

  irAGestionPlanEstudios(idPrograma: number): void {
    console.log(idPrograma);
    this.router.navigate(['/ce-academico/programa-academico/gestion-plan-estudios', idPrograma]);
  }

  openAddEditModal() {
    this.bsModalRef = this.modalService.show(AddEditProgramaComponent, {
      initialState: {
        title: 'Añadir Programa',
        // Puedes pasar datos aquí si es necesario
      },
      class: 'modal-xl custom-modal-scrollable',
    ignoreBackdropClick: true, // Evita cerrar el modal al hacer clic fuera
    keyboard: false             // Evita cerrar el modal con la tecla ESC
    });

    if (this.bsModalRef.content) {
      this.bsModalRef.content.actualizacionCompleta.subscribe(() => {
        this.findProgramasActivos();
      });
    }
  }

  findProgramasActivos() {
    this.SpinnerService.show();
    this.controlestudiosService.getProgramasActivos().subscribe(
      (data: any) => {
        this.programas.data = data;
        
      if (this.programas.data.length == 0) {
        
        this.SpinnerService.hide();
       } else{
        this.programas.paginator = this.paginatorProcesos;
        this.programas.data = data;
        this.SpinnerService.hide();
       }
      }
    );
  }
  
}
