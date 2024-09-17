import { Component, OnInit, } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ControlEstudiosService } from '../control-estudios/control-estudios.service';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router'; // Importar el router para redirigir

import { ChartjsComponent } from '@coreui/angular-chartjs';

interface Usuario {
  nac:null,
     cedula:null,
     nombre_completo:null,
     nombre_corto:null,
     fecnac:null,
     carnet:null,
     pnf:null,
     email: null,
     saludo: null,
     nombre: null,
     genero_mensaje: null,
     ente: null,
  rol: string[];
}

export interface Matricula {
  programa: string;
  estatus: string;
  grados: Grado[];
}

export interface Grado {
  nombre: string;
  estatus: string;
  desc_estatus: string;
}

export interface Estudiante {
  nombre: string;
  genero_mensaje: string;
  matriculas: Matricula[];
}

interface Curso {
  periodo: string;
  pnf: string,
  cantidad: number;
  inscritos: number;
  actas_cargadas: number;
}



@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  cargandoDatos: boolean = true;
mostrarMensaje: boolean = false;
  visible: boolean = true;

  constructor(private chartsData: DashboardChartsData,
    private SpinnerService: NgxSpinnerService,
    public controlestudiosService: ControlEstudiosService,
    private router: Router
    ) {
      setTimeout(() => {
        this.visible = false;
      }, 12000);
  }

  estudiante: Estudiante = {
    nombre: '',
    genero_mensaje: '',
    matriculas: []
  };

   usr: Usuario = {
    nac:null,
     cedula:null,
     nombre_completo:null,
     nombre_corto:null,
     fecnac:null,
     carnet:null,
     pnf:null,
     email: null,
     saludo: null,
     nombre: null,
     genero_mensaje: null,
     ente: null,
    rol: []
  };
  
  persona_ente: { nombre: string, genero_mensaje: string, ente: string } = { nombre: '', genero_mensaje: '', ente: '' };


  cursosDocente: Curso[] = [];
  procesos: any[] = [];

  getIconName(estatus: string): string {
    switch (estatus) {
      case 'Activo': return 'cil-check';
      case 'Inactivo': return 'cil-clock';
      case 'Egresado': return 'cil-school';
      case 'Retirado': return 'cil-ban';
      default: return 'cil-bug'; // Ícono por defecto
    }
  }


  getIconNameGrade(estatus: number): string {
    switch (estatus) {
      case 1: return 'cil-book';
      case 2: return 'cil-school';
      case 3: return 'cil-clock';
      case 4: return 'cil-ban';
      default: return 'cil-bug'; // Ícono por defecto
    }
  }

  tieneRol(codigoRol: string): boolean {
    return this.usr && this.usr.rol ? this.usr.rol.includes(codigoRol) : false;
  }
   
  public mainChart: IChartProps = {};
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl('Month')
  });

  ngOnInit(): void {
    //this.initCharts();
    this.usr = JSON.parse(sessionStorage.getItem('currentUser')!);
    this.cargarDatosSegunRol();
    //console.log(this.usr.nombre_corto);

  }

  cargarDatosSegunRol(): void {
    if (!this.usr || !this.usr.rol || this.usr.rol.length === 0) return;

    this.usr.rol.forEach((rol: string) => {
      switch(rol) {
        case '007':
          this.buscarDatosAcademicos();
          break;
        case '006':
          this.buscarDatosDocente();
          break;
         case '008':
           this.buscarDatosEncargadoEnte();
           break;
        // Añade más casos según sea necesario
      }
    });
  }

  data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: [40, 20, 12, 39, 10, 80, 40]
      },
      {
        label: 'My Second dataset',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: [50, 12, 28, 29, 7, 25, 60]
      }
    ]
  };

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      console.log('handleChartRef', $chartRef);
      this.data.labels.push('August');
      this.data.datasets[0].data.push(60);
      this.data.datasets[1].data.push(20);
      setTimeout(() => {
        $chartRef?.update();
      }, 3000);
    }
  }

  buscarDatosAcademicos(): void {
    this.controlestudiosService.findDatosAcademicosDash({ cedula: this.usr.cedula }).subscribe(datos => {
        if (datos && datos.length > 0) {
            // Asignar los datos a tu modelo Estudiante
            this.estudiante = {
                nombre: this.usr.nombre ?? '', 
                genero_mensaje: this.usr.genero_mensaje ?? '',
                matriculas: datos.map((dato: any) => ({
                    programa: dato.programa,
                    estatus: dato.estatus,
                    grados: dato.grados.map((grado: any) => ({
                        nombre: grado.nombre,
                        estatus: grado.estatus,
                        desc_estatus: grado.desc_estatus,
                        revision: grado.revision
                    }))
                }))
            };
        } else {
            this.estudiante = {
                nombre: this.usr.nombre ?? '',
                genero_mensaje: this.usr.genero_mensaje ?? '',
                matriculas: [] 
            };
        }
        this.mostrarMensaje = this.tieneRevisionesPendientes(this.estudiante.matriculas);
        this.cargandoDatos = false;
    }, error => {
        console.error('Error al buscar datos académicos:', error);
        this.estudiante = {
            nombre: this.usr.nombre ?? '',
            genero_mensaje: this.usr.genero_mensaje ?? '',
            matriculas: [] 
        };
        this.mostrarMensaje = false; // O maneja esto como necesites en caso de error
        this.cargandoDatos = false;
    });
}


  

  buscarDatosDocente(): void {
    const cedulaCompleta = (this.usr.nac ?? '') + (this.usr.cedula ?? '');

    this.controlestudiosService.findDatosDocenteDash({ cedula: cedulaCompleta}).subscribe(datos => {
      // Aquí asignas los datos a tu modelo Estudiante
      this.cursosDocente= datos.map((dato: any) => ({
        periodo: dato.periodo,
        pnf: dato.pnf,
        cantidad: dato.cantidad,
        inscritos: dato.inscritos,
        actas_cargadas: dato.actas_cargadas
      }))
    });
    this.cargandoDatos = false;
  }

  buscarDatosEncargadoEnte(): void {
    const cedulaCompleta = (this.usr.nac ?? '') + (this.usr.cedula ?? '');
  
    this.controlestudiosService.findDatosEnteDash().subscribe(datos => {
      // Asignación de los datos traídos por el PHP
      this.procesos = datos.map((dato: any) => ({
        periodo: dato.periodo,
        proceso: dato.proceso,
        fec_ini: dato.fec_ini,
        fec_fin: dato.fec_fin,
        fec_ini_view: dato.fec_ini_view,
        fec_fin_view: dato.fec_fin_view,
        mod_ingreso_proceso: dato.mod_ingreso_proceso,
        periodicidad: dato.periodicidad,
        estatus: dato.estatus,
        id: dato.id,
      }));

      this.persona_ente = {
        nombre: this.usr.nombre ?? '',
        genero_mensaje: this.usr.genero_mensaje ?? '',
        ente: this.usr.ente ?? ''
      };
  
      this.cargandoDatos = false;
    }, error => {
      console.error('Error al cargar datos del ente:', error);
      this.cargandoDatos = false;
    });
  }
  

  procesoHabilitado(fec_ini: string, fec_fin: string): boolean {
    const fechaActual = new Date();
    const fechaInicio = new Date(fec_ini);
    const fechaFin = new Date(fec_fin);
  
    // Verificar si la fecha actual está dentro del rango del proceso
    return fechaActual >= fechaInicio && fechaActual <= fechaFin;
  }

  irACargaConvenio(): void {
    this.router.navigate(['/entes/convenio']);
  }
  


  // buscarDatosJefe(): void {
  //   this.controlestudiosService.obtenerDatos().subscribe(datos => {
  //     console.log('Datos de jefe:', datos);
  //     // Procesa los datos según sea necesario
  //   });
  // }

  // buscarDatosDocente(): void {
  //   this.controlestudiosService.obtenerDatos().subscribe(datos => {
  //   console.log('Datos de docente:', datos);
  //     // Procesa los datos según sea necesario
  //   });
  // }

  initCharts(): void {
    this.SpinnerService.show();
    this.mainChart = this.chartsData.mainChart;
    this.SpinnerService.hide();
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.chartsData.initMainChart(value);
    this.initCharts();
  }

  tieneEstadoSinDefinir(matriculas: any[]): boolean {
    return matriculas.some(matricula =>
      matricula.grados.some((grado: { desc_estatus: string; }) => grado.desc_estatus === 'Sin definir')
    ); 
  }

  tieneRevisionesPendientes(matriculas: any[]): boolean {
    console.log('Matriculas:', matriculas);
    if (!matriculas || matriculas.length === 0) {
        return true; // Si matriculas es null o un array vacío, hay revisiones pendientes
    }
    return matriculas.some(matricula => 
        matricula.grados.some((grado: { revision: number | null; }) => grado.revision != null && grado.revision != 0)
    );
    
}


  

}
