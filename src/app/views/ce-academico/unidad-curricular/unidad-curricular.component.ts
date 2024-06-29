import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-unidad-curricular',
  templateUrl: './unidad-curricular.component.html',
  styleUrls: ['./unidad-curricular.component.scss']
})
export class UnidadCurricularComponent implements OnInit,AfterViewInit  {
  @ViewChild('asociadasPaginator') asociadasPaginator!: MatPaginator;
  @ViewChild('todasPaginator') todasPaginator!: MatPaginator;

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private controlEstudiosService: ControlEstudiosService
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

    this.controlEstudiosService.getTrayectosUC(this.idPlan).subscribe((data: any) => {
      this.trayectos = data;
      if (this.isSemestral) {
        this.controlEstudiosService.getSemestresUC(this.idPlan).subscribe((semestresData: any) => {
          this.semestres = semestresData;
          console.log(this.semestres); // Para verificar
        });
      }
    });

    this.findUC();
  }

  ngAfterViewInit(): void {
    // Escuchar el cambio de selección del stepper

   
  }

  onStepChange(event: any): void {
    const stepIndex = event.selectedIndex;
    const idTrayecto = this.isSemestral ? this.semestres[stepIndex].id_trayecto : this.trayectos[stepIndex].id_trayecto;
console.log(idTrayecto);
    //this.loadUnidadesForStep(idTrayecto);
  }

  configurePaginator(paginator: MatPaginator, dataSource: MatTableDataSource<any>): void {
    //paginator._intl.itemsPerPageLabel = 'Mostrando de ${start} – ${end} registros';
    paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        //return `Mostrando 0 de ${length}`;
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
      if (this.todasPaginator) {
        this.configurePaginator(this.todasPaginator, this.dataSource);
      }
      
    });
  }

  get unidades() {
    return this.unidadesForm.get('unidades') as FormArray;
  }

  addUnidad() {
    const unidadFormGroup = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      creditos: [0, Validators.required]
    });
    this.unidades.push(unidadFormGroup);
  }

  addExistingUnidad(element: any): void {
    const unidadesArray = this.unidadesForm.get('unidades') as FormArray;
    unidadesArray.push(this.fb.group({
      nombre: [element.nombre],
      descripcion: [element.descripcion],
      creditos: [element.creditos]
    }));

    // Agregar a la tabla de unidades curriculares asociadas
    this.asociadasDataSource.data = [...this.asociadasDataSource.data, element];
    this.dataSource.data = this.dataSource.data.filter(item => item.nombre !== element.nombre);

    // Configurar el paginador de unidades asociadas si aún no se ha configurado
    if (!this.asociadasPaginator) {
      setTimeout(() => {
        this.configurePaginator(this.asociadasPaginator, this.asociadasDataSource);
      });
    } else {
      this.asociadasDataSource.paginator = this.asociadasPaginator;
    }

    this.dataSource.paginator = this.todasPaginator;
  }

  removeUnidadAsociada(element: any): void {
    const unidadesArray = this.unidadesForm.get('unidades') as FormArray;
    const index = unidadesArray.controls.findIndex(control => control.value.nombre === element.nombre);
    if (index >= 0) {
      unidadesArray.removeAt(index);
    }

    // Remover de la tabla de unidades curriculares asociadas
    this.asociadasDataSource.data = this.asociadasDataSource.data.filter(item => item.nombre !== element.nombre);
    this.dataSource.data = [...this.dataSource.data, element];

    // Configurar el paginador de unidades asociadas si aún no se ha configurado
    if (!this.asociadasPaginator) {
      setTimeout(() => {
        this.configurePaginator(this.asociadasPaginator, this.asociadasDataSource);
      });
    } else {
      this.asociadasDataSource.paginator = this.asociadasPaginator;
    }

    this.dataSource.paginator = this.todasPaginator;
  }
  applyFilterAsociadas(filterValue: string):void {
    //  const filterValue = (event.target as HTMLInputElement).value;
    this.asociadasDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(filterValue: string):void {
    //const filterValue = (event.target as HTMLInputElement).value;
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
}
