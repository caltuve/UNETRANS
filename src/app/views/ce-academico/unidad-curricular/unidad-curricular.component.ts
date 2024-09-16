import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { AddUnidadCurricularModalComponent } from './../add-unidad-curricular-modal/add-unidad-curricular-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'

@Component({
  selector: 'app-unidad-curricular',
  templateUrl: './unidad-curricular.component.html',
  styleUrls: ['./unidad-curricular.component.scss']
})
export class UnidadCurricularComponent implements OnInit,AfterViewInit  {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChildren('asociadasPaginator') asociadasPaginators: QueryList<MatPaginator>;
  @ViewChildren('todasPaginator') todasPaginators: QueryList<MatPaginator>;

  @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;

  idPlan: number;
  planes: any[] = [];
  trayectos: any[] = [];
  semestres: any[] = [];
  unidadesForm: FormGroup;
  isSemestral: boolean = false;
  displayedColumns: string[] = ['nombre', 'creditos', 'add'];
  asociadasDisplayedColumns: string[] = ['nombre', 'creditos', 'remove'];
  dataSource!: MatTableDataSource<any>;
  asociadasDataSource = new MatTableDataSource<any>();
  allAssociatedUnits: Set<number> = new Set();

  modalRef: BsModalRef; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private _formBuilder: FormBuilder,
    private controlEstudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
  ) {
    this.unidadesForm = this.fb.group({
      unidades: this.fb.array([])
    });
  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  ngOnInit(): void {
    this.idPlan = +(this.route.snapshot.paramMap.get('idPlan') ?? 0);

    this.controlEstudiosService.getPlanes().subscribe((data: any) => {
      this.planes = data;
      const selectedPlan = this.planes.find(plan => plan.id_plan === this.idPlan);
      this.isSemestral = selectedPlan.regimen === '02';
      console.log(this.isSemestral); // Para verificar
    });

    this.initializeStepData();

    this.findUC();
    
  }

  initializeStepData(): void {
    this.SpinnerService.show();
    this.controlEstudiosService.getTrayectosUC(this.idPlan).subscribe((data: any) => {
      this.trayectos = data;
      if (this.isSemestral) {
        this.controlEstudiosService.getSemestresUC(this.idPlan).subscribe((semestresData: any) => {
          this.semestres = this.semestres.concat(semestresData);
        });
      }
      setTimeout(() => {
        this.loadUnidadesCurriculares(this.trayectos[0]?.id_trayecto);
      });
    });
  }

  onStepChange(event: any): void {
    const stepIndex = event.selectedIndex;
    const selectedTrayecto = this.trayectos[stepIndex];
    console.log('Step changed to:', stepIndex, 'Selected trayecto:', selectedTrayecto);
    this.loadUnidadesCurriculares(selectedTrayecto.id_trayecto);
}


loadUnidadesCurriculares(idTrayecto: number): void {
  this.controlEstudiosService.getUnidadesAsociadas(idTrayecto).subscribe((data: any[]) => {
    this.asociadasDataSource = new MatTableDataSource(data);
    this.setPaginatorForDataSource(this.asociadasDataSource, this.asociadasPaginators);

    this.controlEstudiosService.getUnidades().subscribe((allData: any[]) => {
      const asociadasIds = data.map(uc => uc.id_uc);
      this.dataSource = new MatTableDataSource(allData.filter(uc => !asociadasIds.includes(uc.id_uc)));
      this.setPaginatorForDataSource(this.dataSource, this.todasPaginators);
    });
  });
}

setPaginatorForDataSource(dataSource: MatTableDataSource<any>, paginators: QueryList<MatPaginator>): void {
  paginators.changes.subscribe(() => {
      const paginator = paginators.first;
      if (paginator) {
          dataSource.paginator = paginator;
          this.configurePaginator(paginator, dataSource);
      }
  });
  const paginator = paginators.first;
  if (paginator) {
      dataSource.paginator = paginator;
      this.configurePaginator(paginator, dataSource);
  }
}



ngAfterViewInit(): void {
  this.asociadasPaginators.changes.subscribe(() => {
      this.asociadasPaginators.forEach((paginator, index) => {
          if (this.asociadasDataSource) {
              this.asociadasDataSource.paginator = paginator;
              this.configurePaginator(paginator, this.asociadasDataSource);
          }
      });
  });

  this.todasPaginators.changes.subscribe(() => {
      this.todasPaginators.forEach((paginator, index) => {
          if (this.dataSource) {
              this.dataSource.paginator = paginator;
              this.configurePaginator(paginator, this.dataSource);
          }
      });
  });
}



  updateAllAssociatedUnits(currentIdTrayecto: number): void {
    this.allAssociatedUnits.clear();
    const currentTrayectoIndex = this.trayectos.findIndex(trayecto => trayecto.id_trayecto === currentIdTrayecto);

    for (let i = 0; i <= currentTrayectoIndex; i++) {
      const idTrayecto = this.trayectos[i].id_trayecto;
      this.controlEstudiosService.getUnidadesAsociadas(idTrayecto).subscribe((data: any[]) => {
        data.forEach(unit => this.allAssociatedUnits.add(unit.id_uc));
        this.updateAvailableUnidades();
        this.ngAfterViewInit();
      });
    }
  }

  updateAvailableUnidades(): void {
    this.dataSource.data = this.dataSource.data.filter(item => !this.allAssociatedUnits.has(item.id_uc));
    this.setPaginatorForDataSource(this.dataSource, this.todasPaginators);
    this.SpinnerService.hide();
  }

  configurePaginator(paginator: MatPaginator, dataSource: MatTableDataSource<any>): void {
    paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `Mostrando 0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `Mostrando ${startIndex + 1} – ${endIndex} de ${length} registro(s)`;
    };
    dataSource.paginator = paginator;
  }

  findUC(): void {
    this.controlEstudiosService.getUnidades().subscribe((data: any[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const searchText = filter.trim().toLowerCase();
        return !this.asociadasDataSource.data.some((uc: any) => uc.nombre === data.nombre) &&
               (data.nombre.toLowerCase().includes(searchText) || data.creditos.toString().includes(searchText));
      };
      this.setPaginatorForDataSource(this.dataSource, this.todasPaginators);
    });
  }

  addExistingUnidad(element: any): void {
    this.SpinnerService.show();
    const stepIndex = this.stepper.selectedIndex;
    const idTrayecto = this.trayectos[stepIndex].id_trayecto;

    const variables = { id_trayecto: idTrayecto, id_uc: element.id_uc };

    this.controlEstudiosService.addUnidadToTrayecto(variables).subscribe(response => {
      if (response.success) {
        this.asociadasDataSource.data = [...this.asociadasDataSource.data, element];
        this.dataSource.data = this.dataSource.data.filter(item => item.id_uc !== element.id_uc);
        this.setPaginatorForDataSource(this.dataSource, this.todasPaginators);
        this.setPaginatorForDataSource(this.asociadasDataSource, this.asociadasPaginators);
        this.SpinnerService.hide();
      } else {
        console.error('Error al añadir la unidad curricular:', response.message);
        this.SpinnerService.hide();
      }
    });
  }
  

  removeUnidadAsociada(element: any): void {
    this.SpinnerService.show();
    const stepIndex = this.stepper.selectedIndex;
    const idTrayecto = this.trayectos[stepIndex].id_trayecto;

    const variables = { id_trayecto: idTrayecto, id_uc: element.id_uc };

    this.controlEstudiosService.removeUnidadFromTrayecto(variables).subscribe(response => {
      if (response.success) {
        this.asociadasDataSource.data = this.asociadasDataSource.data.filter(item => item.id_uc !== element.id_uc);
        this.dataSource.data = [...this.dataSource.data, element];
        this.setPaginatorForDataSource(this.dataSource, this.todasPaginators);
        this.setPaginatorForDataSource(this.asociadasDataSource, this.asociadasPaginators);
        this.SpinnerService.hide();
      } else {
        console.error('Error al eliminar la unidad curricular:', response.message);
        this.SpinnerService.hide();
      }
    });
  }


  applyFilterAsociadas(filterValue: string): void {
    this.asociadasDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openModal() {
    // const dialogRef = this.dialog.open(NuevaUnidadDialogComponent, {
    //   width: '400px'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.controlEstudiosService.addUnidad(result).subscribe(() => {
    //       this.controlEstudiosService.getUnidades().subscribe((data: any) => {
    //         this.dataSource.data = data;
    //       });
    //     });
    //   }
    // });
  }

  onSubmit() {
    console.log(this.unidadesForm.value);
  }

  addUnidadesCurriculares(): void {
    const stepIndex = this.stepper.selectedIndex;
    const modalOptions = {
      class: 'modal-xl'
    };

    const bsModalRef: BsModalRef = this.modalService.show(AddUnidadCurricularModalComponent, modalOptions); 
    // Suscribirse al evento emitido por el modal
  const modalComponent = bsModalRef.content as AddUnidadCurricularModalComponent;
  modalComponent.actualizacionCompleta.subscribe((completo) => {
    if (completo) {
      // Realizar alguna acción, como recargar los datos
      if (stepIndex === 0) {
        this.loadUnidadesCurriculares(this.trayectos[0]?.id_trayecto);
      } else {
        this.loadUnidadesCurriculares(this.trayectos[stepIndex]?.id_trayecto);
      }
    } 
  });

  }
}
