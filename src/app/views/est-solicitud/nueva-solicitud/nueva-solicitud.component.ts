import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { MatTableDataSource } from '@angular/material/table'; // Importa MatTableDataSource
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionService } from './../../../notificacion.service'
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

  displayedColumns: string[] = ['tipo', 'nombre', 'formato', 'cantidad', 'costo_unitario', 'costo_total', 'costo_total_bs', 'observaciones']; // Definir las columnas que se mostrarán en la tabla

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

  estatusEstudiante: string;
  codProgramaSeleccionado: number;

  costoSeleccionado: number | null = null;

  tasaCambio = 44.42319324;
  totalSolicitud: number = 0; // Total general de la solicitud en EUR
  totalSolicitudBs: number = 0; // Total general de la solicitud en Bs.

  constructor(private _formBuilder: FormBuilder,
    public controlestudiosService: ControlEstudiosService,
    private SpinnerService: NgxSpinnerService,
    private notifyService : NotificacionService,
    ) {
    this.usr = JSON.parse(sessionStorage.getItem('currentUser')!); 
  }

  ngOnInit() {

    this.buscarProgramasEstudiante(this.usr.cedula!); // Buscar los programas del estudiante
    this.cargarTiposDocumentos();

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
      this.secondFormGroup.get('cantidad')?.disable(); // Desactiva el campo de cantidad si es digital
    } else if (formato === 'fisico') {
      this.secondFormGroup.get('cantidad')?.enable(); // Activa el campo de cantidad si es físico
      this.secondFormGroup.get('cantidad')?.reset(); // Opcional: limpia el valor de cantidad
    } else {
      this.secondFormGroup.get('cantidad')?.disable(); // Desactiva por defecto
    }
  }
 

  filtrarDocumentosDisponibles() {
    this.SpinnerService.show();
    const tipoDocumento = this.secondFormGroup.get('tipoDocumento')?.value;
    const id_titulacion = this.firstFormGroup.get('carrera')?.value;
    const cedula = this.usr.cedula;
  
    // Crear el objeto con todos los datos
    const datosSolicitud = {
      id_titulacion: id_titulacion,
      cedula: cedula,
      tipo_documento: tipoDocumento
    };
  
    // Llamar al servicio con el objeto completo
    this.controlestudiosService.getDocumentosDisponibles(datosSolicitud).subscribe(
      (response: any) => {
        if (response.estatus === 'OK') {
          this.documentosFiltrados = response.datos;
          this.SpinnerService.hide();
        } else {
          console.error(response.mensaje);
          this.documentosFiltrados = [];
          this.SpinnerService.hide();
          this.notifyService.showInfo('Actualmente no existen documentos disponibles para tu estatus y tipo de documento seleccionado');
        }
      },
      error => {
        console.error('Error al obtener los documentos disponibles:', error);
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
        observaciones: this.secondFormGroup.get('observaciones')?.value,
      };

      this.documentosAnnadidos.push(documento);
      this.dataSource.data = this.documentosAnnadidos; // Actualizar el dataSource de la tabla

      // Calcular el total general de la solicitud en EUR y Bs
      this.calcularCostoTotalSolicitud();

      // Resetear el formulario
      this.secondFormGroup.reset();
      this.secondFormGroup.get('cantidad')?.disable();
    }
  }

  calcularCostoTotalSolicitud() {
    this.totalSolicitud = this.documentosAnnadidos.reduce((total, documento) => total + documento.costo_total, 0);
    this.totalSolicitudBs = this.documentosAnnadidos.reduce((total, documento) => total + documento.costo_total_bs, 0);
  }
  

  confirmarSolicitud() {
    // Añadir id_estudiante a cada documento
    this.documentosAnnadidos = this.documentosAnnadidos.map(documento => ({
      ...documento,
      id_estudiante: this.usr.usrsice
    }));

    const solicitudData = {
      id_estudiante: this.usr.usrsice,
      total_a_pagar: this.totalSolicitud, // Total en EUR
      total_a_pagar_bs: this.totalSolicitudBs, // Total en Bs.
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
  }
  
  
}