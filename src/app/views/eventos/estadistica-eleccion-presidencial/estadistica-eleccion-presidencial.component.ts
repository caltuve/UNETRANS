import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventserviceService } from '../eventservice.service';
import { Chart, registerables } from 'chart.js';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'


interface Parroquia {
  parroquia: string;
  total: number;
  porcentaje: number;
}

interface Municipio {
  municipio: string;
  parroquias: Parroquia[];
  showParroquias: boolean;
}

interface Estado {
  estado: string;
  municipios: Municipio[];
  showMunicipios: boolean;
}

interface DisgregacionEntry {
  estado: string;
  municipio: string;
  parroquia: string;
  total: number;
}

interface EstadoData {
  label: string;
  data: number;
  porcentaje: number;
}

@Component({
  selector: 'app-estadistica-eleccion-presidencial',
  templateUrl: './estadistica-eleccion-presidencial.component.html',
  styleUrls: ['./estadistica-eleccion-presidencial.component.scss']
})
export class EstadisticaEleccionPresidencialComponent implements OnInit, OnDestroy {

  totalHabilitados: number;
  totalRespuestas: number;
  totalRespuestasSi: number;
  respuestas: any;
  disgregacion: DisgregacionEntry[];
  disgregacionPorEstado: Estado[] = [];
  siRespuestas: number;
  noRespuestas: number;
  estadosData: { label: string, data: number, porcentaje: number }[];
  private refreshInterval: any;
  private countdownInterval: any;
  timeUntilRefresh: number;
  private respuestasChart: Chart | undefined;
  private estadosChart: Chart | undefined;

  constructor(private eventserviceService: EventserviceService,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,) { 
    Chart.register(...registerables);
    this.timeUntilRefresh = 120;
  }

  ngOnInit(): void {
    this.updateData();
  
    // Configurar el intervalo para refrescar los datos cada 2 minutos (120000 milisegundos)
    this.refreshInterval = setInterval(() => {
      setTimeout(() => {
        this.updateData();
      }, 200); // 100ms de retraso
      
    }, 124000);
  
    // Configurar el intervalo para el contador regresivo
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }
  
  ngOnDestroy(): void {
    console.log('ngOnDestroy: Limpiando intervalos y destruyendo gráficos');
    // Limpiar los intervalos cuando el componente se destruya
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  
    if (this.respuestasChart) {
      this.respuestasChart.destroy();
      console.log('ngOnDestroy: respuestasChart destruido');
    } else {
      console.log('ngOnDestroy: respuestasChart no existe', this.respuestasChart);
    }
    if (this.estadosChart) {
      this.estadosChart.destroy();
      console.log('ngOnDestroy: estadosChart destruido');
    } else {
      console.log('ngOnDestroy: estadosChart no existe', this.estadosChart);
    }
  }
  
  updateData(): void {
    this.SpinnerService.show();
    this.eventserviceService.getEstadisticas().subscribe(data => {
      this.totalHabilitados = data.total_habilitados;
      this.respuestas = data.respuestas;
      this.disgregacion = data.disgregacion;
      this.timeUntilRefresh = 120; // Reiniciar el contador
      this.SpinnerService.hide();
      this.notifyService.showSuccess('Refrescamiento exitoso.');
      this.processDisgregacion();
      this.createCharts();
    }, error => {
      this.SpinnerService.hide();
      this.notifyService.showError('Error en el refrescamiento de datos.');
    });
  }
  
  updateCountdown(): void {
    if (this.timeUntilRefresh > 0) {
      this.timeUntilRefresh--;
    } else {
      //this.updateData();
      this.timeUntilRefresh = 120; // Reiniciar el contador
    }
  }
  

  getFormattedCountdown(): string {
    const minutes = Math.floor(this.timeUntilRefresh / 60);
    const seconds = this.timeUntilRefresh % 60;
    if (minutes > 0) {
      return `${minutes} minuto(s) y ${seconds} segundo(s)`;
    } else {
      return `${seconds} segundo(s)`;
    }
  }

  processDisgregacion() {
    // Inicializar un objeto vacío para almacenar los estados
    const estados: { [key: string]: Estado } = {};
    const estadosData: { label: string, data: number }[] = [];

    // Procesar cada entrada en la disgregación
    this.disgregacion.forEach(entry => {
      // Verificar si el estado ya está en el objeto estados
      if (!estados[entry.estado]) {
        // Si no está, agregarlo con un nuevo objeto Estado
        estados[entry.estado] = { estado: entry.estado, municipios: [], showMunicipios: false };
        estadosData.push({ label: entry.estado, data: 0 });
      }

      // Obtener el estado actual
      const estado = estados[entry.estado];
      
      // Verificar si el municipio ya está en el estado
      let municipio = estado.municipios.find(m => m.municipio === entry.municipio);
      if (!municipio) {
        // Si no está, agregarlo con un nuevo objeto Municipio
        municipio = { municipio: entry.municipio, parroquias: [], showParroquias: false };
        estado.municipios.push(municipio);
      }

      // Agregar la parroquia al municipio
      municipio.parroquias.push({
        parroquia: entry.parroquia,
        total: entry.total,
        porcentaje: 0  // Se calculará más tarde
      });

      // Incrementar el conteo de votos por estado
      const estadoData = estadosData.find(e => e.label === entry.estado);
      if (estadoData) {
        estadoData.data += entry.total;
      }
    });

    // Convertir el objeto estados a un array y asignarlo a disgregacionPorEstado
    this.disgregacionPorEstado = Object.values(estados);

    // Calcular el total de respuestas
    this.totalRespuestasSi = this.disgregacion.reduce((sum, entry) => sum + entry.total, 0);

    // Calcular el porcentaje de votos por estado y parroquia basado en el total de respuestas
    this.disgregacionPorEstado.forEach(estado => {
      estado.municipios.forEach(municipio => {
        municipio.parroquias.forEach(parroquia => {
          parroquia.porcentaje = parseFloat(((parroquia.total / this.totalRespuestasSi) * 100).toFixed(2));
        });
      });
    });

    // Calcular el porcentaje de votos por estado
    this.estadosData = estadosData.map(estado => ({
      ...estado,
      porcentaje: parseFloat((estado.data / this.totalRespuestasSi * 100).toFixed(2))
    }));
  }

  toggleMunicipios(estado: Estado) {
    estado.showMunicipios = !estado.showMunicipios;
  }

  toggleParroquias(municipio: Municipio) {
    municipio.showParroquias = !municipio.showParroquias;
  }

  createCharts() {
    console.log('createCharts: Destruyendo gráficos existentes si existen');
    // Destruir gráficos existentes si existen
    if (this.respuestasChart) {
      console.log('createCharts: respuestasChart existe y será destruido', this.respuestasChart);
      this.respuestasChart.destroy();
      console.log('createCharts: respuestasChart destruido');
      this.respuestasChart = undefined; // Asegurar que se asigna a undefined
    } else {
      console.log('createCharts: respuestasChart no existe', this.respuestasChart);
    }
    if (this.estadosChart) {
      console.log('createCharts: estadosChart existe y será destruido', this.estadosChart);
      this.estadosChart.destroy();
      console.log('createCharts: estadosChart destruido');
      this.estadosChart = undefined; // Asegurar que se asigna a undefined
    } else {
      console.log('createCharts: estadosChart no existe', this.estadosChart);
    }
  
    this.siRespuestas = this.respuestas.find((res: { voto: boolean; }) => res.voto === true)?.total || 0;
    this.noRespuestas = this.respuestas.find((res: { voto: boolean; }) => res.voto === false)?.total || 0;
  
    console.log('createCharts: Creando respuestasChart');
    
    this.totalRespuestas = this.siRespuestas+this.noRespuestas;
    new Chart('respuestasChart', {
      type: 'pie',
      data: {
        labels: ['Sí', 'No'],
        datasets: [{
          data: [this.siRespuestas, this.noRespuestas],
          backgroundColor: ['#36A2EB', '#FF6384']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Ocultar la leyenda
          }
        }
      }
    });
  
    const estadoLabels = this.estadosData.map(e => e.label);
    const estadoData = this.estadosData.map(e => e.data);
    const estadoBackgroundColors = estadoLabels.map((_, i) => `hsl(${(i * 360 / estadoLabels.length)}, 70%, 50%)`);
  
    new Chart('estadosChart', {
      type: 'pie',
      data: {
        labels: estadoLabels,
        datasets: [{
          data: estadoData,
          backgroundColor: estadoBackgroundColors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Ocultar la leyenda
          }
        }
      }
    });
  }
  
  getEstadoColor(label: string): string {
    const index = this.estadosData.findIndex(e => e.label === label);
    return `hsl(${(index * 360 / this.estadosData.length)}, 70%, 50%)`;
  }
  
  getRespuestaColor(label: string): string {
    const colors: { [key: string]: string } = {
      'Sí': '#36A2EB',
      'No': '#FF6384'
    };
    return colors[label];
  }
  
  getRespuestaPorcentaje(label: string): string {
    const total = this.siRespuestas + this.noRespuestas;
    const value = label === 'Sí' ? this.siRespuestas : this.noRespuestas;
    return ((value / total) * 100).toFixed(2);
  }
}
