import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { MatTableDataSource } from '@angular/material/table'; // Importa MatTableDataSource
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

interface Programa {
  programas: string;
  id_titulacion: number;
}

interface TipoDocumento {
  codelemento: string;
  descripcion: string;
}

interface DocumentoFiltrado {
  id_documento: string;
  nombre_documento: string;
  costo: number;
}


@Component({
  selector: 'app-nueva-solicitud',
  templateUrl: './nueva-solicitud.component.html',
  styleUrls: ['./nueva-solicitud.component.scss']
})
export class NuevaSolicitudComponent implements OnInit {

  firstFormGroup: FormGroup; 
  secondFormGroup: FormGroup;
  carreras: Programa[] = [];
  tiposDocumentos: TipoDocumento[] = [];
  documentosFiltrados: DocumentoFiltrado[] = []; // Documentos filtrados según el tipo
  documentosAnnadidos: any[] = []; // Aquí se guardan los documentos agregados
  dataSource = new MatTableDataSource(this.documentosAnnadidos); // Inicializa el dataSource con el array vacío

  displayedColumns: string[] = ['tipo', 'nombre', 'formato', 'cantidad', 'costo_unitario', 'subtotal', 'subtotal_bs', 'observaciones','accion']; // Definir las columnas que se mostrarán en la tabla

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
    id_ente: null
  }

  unicoPrograma: boolean = false; 

  cumpleRequisitoCarnet: boolean = false;

  estatusEstudiante: string;
  codProgramaSeleccionado: number;

  costoSeleccionado: number | null = null;

  totalPagarEuros: number = 0;
  totalPagarBs: number = 0;
  tasaCambio: number = 0;
  totalSolicitud: number = 0; // Total general de la solicitud en EUR
  totalSolicitudBs: number = 0; // Total general de la solicitud en Bs.

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    private snackBar: MatSnackBar,
    private router: Router,
    ) {
    this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
  }

  ngOnInit() {

    this.buscarProgramasEstudiante(this.usr.cedula!); // Buscar los programas del estudiante
    this.verificarRequisitoCarnet(this.usr.cedula!); // Buscar los programas del estudiante
    this.cargarTiposDocumentos();
    this.obtenerTasaCambio();

    this.firstFormGroup = this._formBuilder.group({
      carrera: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      tipoDocumento: ['', Validators.required],
      documentoDisponible: ['', Validators.required],
      cantidad: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]],
      observaciones: [''],
      formato: ['', Validators.required]  // Nuevo campo para digital/físico
    });
  }

  verificarRequisitoCarnet(cedula: string) {
    // Llamada al servicio para verificar el requisito del carnet en base a la cédula
    this.controlestudiosService.getCheckReqCarnet({ cedula: cedula }).subscribe(
      (resultado: any) => {
        // Verificar si cumple con el requisito del carnet en base al resultado del servicio
        const cumpleRequisitoServicio = resultado.estatus === 'OK'; // Ejemplo basado en la estructura de la respuesta
  
        // Verificar si los documentos añadidos cumplen la condición
        const cumpleRequisitoDocumentos = this.documentosAnnadidos.every(doc => doc.id_documento !== 6);
  
        // Solo cumple el requisito si ambas condiciones son verdaderas
        this.cumpleRequisitoCarnet = cumpleRequisitoServicio && cumpleRequisitoDocumentos;
      },
      error => {
        console.error('Error al verificar el requisito del carnet:', error);
        this.cumpleRequisitoCarnet = false; // En caso de error, asumir que no cumple el requisito
      }
    );
  }

  obtenerTasaCambio(): void {
    this.controlestudiosService.getTasaCambio().subscribe(
      (response) => {
        if (response.success) {
          this.tasaCambio = response.tasa_cambio;
        } 
      },
      (error) => {
        console.error("Error al obtener la tasa de cambio:", error);
      }
    );
  }
  


  buscarProgramasEstudiante(cedula: string) {
    this.SpinnerService.show();
    this.controlestudiosService.getProgramasforDocumentos({ cedula: cedula }).subscribe(
      (data: any) => {
        const programas: Programa[] = Object.values(data.datos) as Programa[]; // Convierte a Programa[]
        this.carreras = programas; // Almacena el array completo

        // Si hay solo un programa, seleccionarlo automáticamente
        if (programas.length === 1) {
          this.firstFormGroup.patchValue({ carrera: programas[0].id_titulacion });
        }

        this.SpinnerService.hide();
      },
      error => {
        console.error('Error al obtener los programas del estudiante:', error);
        this.SpinnerService.hide();
      }
    );
  }

  cargarTiposDocumentos() {
    this.controlestudiosService.getTipoDocumentos().subscribe(
      (data: TipoDocumento[]) => {
        this.tiposDocumentos = data; // Asignar la respuesta directamente
      },
      error => {
        console.error('Error al obtener los tipos de documentos:', error);
      }
    );
  }

  guardarSeleccionPrograma() {
    const carreraSeleccionada = this.firstFormGroup.get('carrera')?.value;
    this.codProgramaSeleccionado = carreraSeleccionada;
    this.controlestudiosService.getProgramasforDocumentos({ cedula: this.usr.cedula, cod_programa: carreraSeleccionada })
      .subscribe((estatus: any) => {
        this.estatusEstudiante = estatus;
        this.filtrarDocumentosDisponibles();
      });
  }

  verificarFormato() {
    const formato = this.secondFormGroup.get('formato')?.value;
    if (formato === 'digital') {
      this.secondFormGroup.get('cantidad')?.setValue(1);
      this.secondFormGroup.get('cantidad')?.disable();
    } else if (formato === 'fisico') {
      this.secondFormGroup.get('cantidad')?.enable();
      this.secondFormGroup.get('cantidad')?.reset();
    } else {
      this.secondFormGroup.get('cantidad')?.disable();
    }
  }
  
  verificarDocumentoSeleccionado() {
    const documentoSeleccionado = this.secondFormGroup.get('documentoDisponible')?.value;
  
    // Verificar si el documento seleccionado es el carnet (id_documento 6)
    if (Number(documentoSeleccionado) === 6) {
      this.secondFormGroup.patchValue({ formato: 'fisico', cantidad: 1 });
      this.secondFormGroup.get('formato')?.disable();
      this.secondFormGroup.get('cantidad')?.disable();
    } else {
      // Si no es el carnet, habilitar normalmente
      this.secondFormGroup.get('formato')?.enable();
      this.secondFormGroup.get('cantidad')?.enable();
    }
  }
  
  filtrarDocumentosDisponibles() {
    this.SpinnerService.show();
    const tipoDocumento = this.secondFormGroup.get('tipoDocumento')?.value;
    const id_titulacion = this.firstFormGroup.get('carrera')?.value;
    const cedula = this.usr.cedula;
  
    const datosSolicitud = {
      id_titulacion: id_titulacion,
      cedula: cedula,
      tipo_documento: tipoDocumento
    };
  
    this.controlestudiosService.getDocumentosDisponibles(datosSolicitud).subscribe(
      (response: any) => {
        if (response.estatus === 'OK') {
          // Asignar los documentos filtrados
          this.documentosFiltrados = response.datos;
  
          // Filtrar el carnet (id_documento 6) si ya está en documentosAnnadidos
          if (this.documentosAnnadidos.some(doc => doc.id_documento === 6) || 
          this.documentosAnnadidos.some(doc => doc.id_documento !== 6)) {
          this.documentosFiltrados = this.documentosFiltrados.filter(doc => Number(doc.id_documento) !== 6);
      }
        } else {
          console.error(response.mensaje);
          this.documentosFiltrados = [];
          this.notifyService.showInfo('Actualmente no existen documentos disponibles para tu estatus y tipo de documento seleccionado');
        }
        this.SpinnerService.hide();
      },
      error => {
        console.error('Error al obtener los documentos disponibles:', error);
        this.SpinnerService.hide();
      }
    );
  }
  
  
  
agregarDocumento() {
    if (this.secondFormGroup.valid) {
        const tipoDocumentoCode = this.secondFormGroup.get('tipoDocumento')?.value;
        const tipoDocumentoDescripcion = this.tiposDocumentos.find(tipo => tipo.codelemento === tipoDocumentoCode)?.descripcion;
        const idDocumento = this.secondFormGroup.get('documentoDisponible')?.value;
        const documentoSeleccionado = this.documentosFiltrados.find(doc => doc.id_documento === idDocumento);

        const nombreDocumento = documentoSeleccionado?.nombre_documento;
        const costoUnitario = documentoSeleccionado?.costo || 0;
        const cantidad = this.secondFormGroup.get('cantidad')?.value || 1;
        const costoTotal = cantidad * costoUnitario;
        const costoTotalBs = costoTotal * this.tasaCambio;

        const documento = {
            tipoDocumento: tipoDocumentoDescripcion || tipoDocumentoCode,
            id_tipo_documento: tipoDocumentoCode,
            id_documento: idDocumento,
            nombre_documento: nombreDocumento,
            formato: this.secondFormGroup.get('formato')?.value,
            cantidad: cantidad,
            costo_unitario: costoUnitario,
            costo_total: costoTotal,
            costo_total_bs: costoTotalBs,
            tasa_cambio: this.tasaCambio,
            observaciones: this.secondFormGroup.get('observaciones')?.value,
        };

        this.documentosAnnadidos.push(documento);
        this.dataSource.data = this.documentosAnnadidos;

        this.calcularTotales();

        // Si el carnet fue añadido o si solo queda un documento en documentosFiltrados, invoca confirmarSolicitud
        if (idDocumento === 6 || this.documentosFiltrados.length === 1) {
            this.confirmarSolicitud();
        } else {
            // Resetea el formulario para otra selección y ajusta el combo de documentos
            this.secondFormGroup.reset();
            this.secondFormGroup.get('cantidad')?.disable();
            //this.filtrarDocumentosDisponibles();  // Filtra documentos si se seleccionó uno que no sea el carnet
        }
    }
}
  
  calcularTotales() {
    // Calcular totales en euros y bolívares
    this.totalPagarEuros = this.documentosAnnadidos.reduce((acc, doc) => acc + doc.costo_total, 0);
    this.totalPagarBs = this.documentosAnnadidos.reduce((acc, doc) => acc + doc.costo_total_bs, 0);
  }
  

  confirmarSolicitud() {
    // Añadir id_estudiante a cada documento
    this.documentosAnnadidos = this.documentosAnnadidos.map(documento => ({
      ...documento,
      id_estudiante: this.usr.usrsice
    }));

    const solicitudData = {
      id_estudiante: this.usr.usrsice,
      total_a_pagar: this.totalPagarEuros, // Total en EUR
      total_a_pagar_bs: this.totalPagarBs, // Total en Bs.
      tasa_cambio: this.tasaCambio,
      documentos: this.documentosAnnadidos
    };

    this.controlestudiosService.crearSolicitudDocumentos(solicitudData).subscribe(
      response => {
        if (response.estatus === 'OK') {
          this.notifyService.showSuccess('Solicitud creada exitosamente');
        } else if (response.estatus === 'ERROR') {
          this.notifyService.showError('Error al crear la solicitud: ' + response.mensaje);
        } else if (response.estatus === 'WARNING') {
          this.notifyService.showWarning('Actualmente no existen documentos disponibles para tu estatus y tipo de documento seleccionado');
        }
      },
      error => {
        this.notifyService.showError('Error de comunicación con el servidor');
      }
    );

    this.router.navigate(['/est-solicitud/documentos']); // Ajusta la ruta según tu configuración de rutas
  }

  confirmarEliminarDocumento(documento: any) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este documento?');
    if (confirmacion) {
      this.eliminarDocumento(documento);
      this.snackBar.open('Documento eliminado correctamente.', 'Cerrar', { duration: 3000 });
      this.secondFormGroup.reset();
      this.secondFormGroup.get('cantidad')?.disable();
    }
  }

  eliminarDocumento(documento: any) {
    const index = this.documentosAnnadidos.indexOf(documento);
    if (index >= 0) {
      this.documentosAnnadidos.splice(index, 1);
      this.dataSource.data = [...this.documentosAnnadidos]; // Actualizar la tabla
      this.calcularTotales(); // Recalcular total
    }
  }
  
  
}