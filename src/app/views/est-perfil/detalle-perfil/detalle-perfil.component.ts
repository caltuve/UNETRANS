import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NotificacionService } from './../../../notificacion.service'
import { NgxSpinnerService } from "ngx-spinner";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-detalle-perfil',
  templateUrl: './detalle-perfil.component.html',
  styleUrls: ['./detalle-perfil.component.scss']
})
export class DetallePerfilComponent implements OnInit {
  @ViewChild('carnetCanvas', { static: false }) carnetCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('fotoModal') public fotoModal: ModalDirective;
  //fotoModal: BsModalRef;
  cargarFotoModal: BsModalRef;
  estudiante: any = {
    identidad: {}
  };
  cargandoDatos: boolean = false;
  usrsice: string;
  codpersona: number;


  constructor(
    public controlestudiosService: ControlEstudiosService,
    private notifyService : NotificacionService,
    private SpinnerService: NgxSpinnerService,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef,
    ) {

      this.obtenerUsuarioActual();
    }

    obtenerUsuarioActual() {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      this.usrsice = currentUser.usrsice;
    }

    ngOnInit() {
      this.cargarIdentidad(); // Carga inicial de datos de Identidad
    }

    cargarIdentidad() {
      this.SpinnerService.show();
      this.cargandoDatos = true;
      this.controlestudiosService.getIdentidad(this.usrsice).subscribe(data => {
        if (data && data.length > 0) {
          this.estudiante.identidad = data[0]; // Asigna el primer objeto de la respuesta a identidad
          this.codpersona = data[0].codpersona;
        } else {
          this.estudiante.identidad = {}; // Asigna un objeto vacío si no hay datos
        }
        this.cargandoDatos = false;
        this.SpinnerService.hide();
      }, error => {
        console.error('Error al cargar datos de identidad:', error);
        this.cargandoDatos = false;
        this.SpinnerService.hide();
      });
    }
    
  
    cargarResidencia() {
      this.cargandoDatos = true;
      this.controlestudiosService.getResidencia(this.usrsice).subscribe(data => {
        this.estudiante.residencia = data;
        this.cargandoDatos = false;
      }, error => {
        console.error('Error al cargar datos de residencia:', error);
        this.cargandoDatos = false;
      });
    }
  
    cargarAcademicos() {
      this.cargandoDatos = true;
      this.controlestudiosService.getAcademicos(this.usrsice).subscribe(data => {
        this.estudiante.academicos = data;
        this.cargandoDatos = false;
      }, error => {
        console.error('Error al cargar datos académicos:', error);
        this.cargandoDatos = false;
      });
    }
  
    cargarUnetrans() {
      this.cargandoDatos = true;
      this.controlestudiosService.getUnetrans(this.usrsice).subscribe(data => {
        this.estudiante.unetrans = data;
        this.cargandoDatos = false;
      }, error => {
        console.error('Error al cargar datos de UNETRANS:', error);
        this.cargandoDatos = false;
      });
    }
  
    cargarSICE() {
      this.cargandoDatos = true;
      this.controlestudiosService.getSICE(this.usrsice).subscribe(data => {
        this.estudiante.sice = data;
        this.cargandoDatos = false;
      }, error => {
        console.error('Error al cargar datos de SICE:', error);
        this.cargandoDatos = false;
      });
    }
  
    onTabChange(tabIndex: number) {
      switch (tabIndex) {
        case 0:
          this.cargarIdentidad();
          break;
        case 1:
          this.cargarResidencia();
          break;
        case 2:
          this.cargarAcademicos();
          break;
        case 3:
          this.cargarUnetrans();
          break;
        case 4:
          this.cargarSICE();
          break;
      }
    }

   
    actualizarUbicacion(){};
    actualizarInformacion() {};

// Método para mostrar el modal con los requisitos de la foto
mostrarRequisitosFoto(): void {
  this.fotoModal.show(); 
}
aceptarRequisitos(): void {
  this.fotoModal.hide(); // Oculta el modal de requisitos
  this.cargarFoto(); // Llama al método para cargar la foto
}
// Método para manejar la carga de la foto
cargarFoto(): void {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/jpeg';
  fileInput.addEventListener('change', this.procesarArchivo.bind(this));
  fileInput.click();
}

// Método para procesar el archivo cargado
procesarArchivo(event: any): void {
  const archivo = event.target.files[0];
  if (archivo) {
    // Verificar tamaño del archivo
    if (archivo.size > 150 * 1024) {
      alert('La foto debe ser menor a 150 KB.');
      return;
    }

    // Leer el archivo como Data URL
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Convertir la imagen a base64
      const base64Image = e.target.result;
      this.validarYGuardarImagen(base64Image);
    };
    reader.readAsDataURL(archivo);
  }
}

validarYGuardarImagen(base64Image: string): void {
  const cleanImage = this.cleanBase64Image(base64Image);
  
  this.resizeImage(cleanImage, 600, 800).then((resizedBase64Image) => {
    this.controlestudiosService.guardarImagenConCodpersona(this.codpersona, resizedBase64Image).subscribe(
      (response) => {
        console.log('Imagen guardada exitosamente');
        this.cargarIdentidad();
      },
      (error) => {
        console.error('Error al guardar la imagen', error);
      }
    );
  }).catch((error) => {
    console.error('Error al procesar la imagen:', error);
  });
}


private cleanBase64Image(base64Image: string): string {
  // Aquí eliminas el encabezado de la imagen en base64 si existe
  return base64Image.replace(/^data:image\/(jpeg|png);base64,/, '');
}

private resizeImage(base64Str: string, maxWidth: number, maxHeight: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calcular las nuevas dimensiones manteniendo la proporción
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) { // Verifica que ctx no sea null
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir la imagen redimensionada de nuevo a base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Ajustar la calidad de la imagen
        resolve(dataUrl.split(',')[1]); // Solo la parte base64
      } else {
        reject('Error al obtener el contexto 2D del canvas.');
      }
    };

    img.onerror = (error) => {
      reject('Error al cargar la imagen.');
    };
  });
}


cargarIdentidadSiEsNecesario(): void {
  if (!this.estudiante.identidad) { 
    this.cargarIdentidad();
  } else if (this.estudiante.identidad.estatus_foto === 2) {
    this.dibujarCarnet();  // Llama al método para dibujar el carnet si la foto es válida
  }
}

dibujarCarnet(): void {
  const canvas = this.carnetCanvas.nativeElement as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  if (ctx && this.estudiante.identidad && this.estudiante.identidad.estatus_foto === 2) {
    // Limpiar el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const marginLeft = 15; // Margen izquierdo para todos los elementos
    const marginLeftText = 162; // Margen izquierdo para todos el texto
    let currentY = 120;     // Posición Y inicial
    let currentYFoto = 80;     // Posición Y inicial

    const lineHeight = 22; // Espacio entre líneas

    // Establecer fondo
    const background = new Image();
    background.src = 'assets/img/brand/Base_carnet.jpg'; // Ruta de la imagen base del carnet
    background.onload = () => {
      // Asegurar que el canvas tenga el mismo tamaño que la imagen de fondo
      // Tamaño original de la imagen
    const originalWidth = 1013;
    const originalHeight = 638;

    // Tamaño deseado para reducir el carnet
    const scaleFactor = 0.5; // Puedes ajustar este factor según tus necesidades
    const scaledWidth = originalWidth * scaleFactor;
    const scaledHeight = originalHeight * scaleFactor;

    // Ajustar el tamaño del canvas
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    const fotoMaxWidth = 100;  // Máximo ancho permitido para la foto
    const fotoMaxHeight = 140; // Máximo alto permitido para la foto
    
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Dibujar la foto del estudiante
      const foto = new Image();
      foto.src = 'data:image/jpeg;base64,' + this.estudiante.identidad.foto;
      foto.onload = () => {
        const aspectRatio = foto.width / foto.height;
        let fotoWidth = fotoMaxWidth;
        let fotoHeight = fotoMaxHeight;

        if (aspectRatio > 1) {
          fotoHeight = fotoMaxWidth / aspectRatio;
        } else {
          fotoWidth = fotoMaxHeight * aspectRatio;
        }
        // Dibujar marco con bordes redondeados
        ctx.strokeStyle = '#000'; // Color del marco
        ctx.lineWidth = 2; // Grosor del marco
        ctx.beginPath();
        ctx.moveTo(marginLeft + 10, currentYFoto);
        ctx.lineTo(marginLeft + fotoWidth - 10, currentYFoto);
        ctx.arcTo(marginLeft + fotoWidth, currentYFoto, marginLeft + fotoWidth, currentYFoto + 10, 10);
        ctx.lineTo(marginLeft + fotoWidth, currentYFoto + fotoHeight - 10);
        ctx.arcTo(marginLeft + fotoWidth, currentYFoto + fotoHeight, marginLeft + fotoWidth - 10, currentYFoto + fotoHeight, 10);
        ctx.lineTo(marginLeft + 10, currentYFoto + fotoHeight);
        ctx.arcTo(marginLeft, currentYFoto + fotoHeight, marginLeft, currentYFoto + fotoHeight - 10, 10);
        ctx.lineTo(marginLeft, currentYFoto + 10);
        ctx.arcTo(marginLeft, currentYFoto, marginLeft + 10, currentYFoto, 10);
        ctx.closePath();
        ctx.stroke();

        // Dibujar la foto dentro del marco
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(marginLeft + 10, currentYFoto);
        ctx.lineTo(marginLeft + fotoWidth - 10, currentYFoto);
        ctx.arcTo(marginLeft + fotoWidth, currentYFoto, marginLeft + fotoWidth, currentYFoto + 10, 10);
        ctx.lineTo(marginLeft + fotoWidth, currentYFoto + fotoHeight - 10);
        ctx.arcTo(marginLeft + fotoWidth, currentYFoto + fotoHeight, marginLeft + fotoWidth - 10, currentYFoto + fotoHeight, 10);
        ctx.lineTo(marginLeft + 10, currentYFoto + fotoHeight);
        ctx.arcTo(marginLeft, currentYFoto + fotoHeight, marginLeft, currentYFoto + fotoHeight - 10, 10);
        ctx.lineTo(marginLeft, currentYFoto + 10);
        ctx.arcTo(marginLeft, currentYFoto, marginLeft + 10, currentYFoto, 10);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(foto, marginLeft, currentYFoto, fotoWidth, fotoHeight);
        ctx.restore();

        // Mover la posición Y para el siguiente elemento
        //currentY += fotoHeight + 20;

        // Dibujar Carnet
        ctx.font = 'bold 13px "Open Sans", Arial, sans-serif';
        ctx.fillStyle = '#000';
        ctx.fillText(`Carnet: ${this.estudiante.identidad.carnet}`, marginLeftText, currentY);

        currentY += lineHeight;

        // Dibujar Número de Cédula
        ctx.fillText(`N°: ${this.estudiante.identidad.nac}-${this.estudiante.identidad.cedula}`, marginLeftText, currentY);

        currentY += lineHeight;

        // Dibujar Apellidos
        ctx.fillText(`${this.estudiante.identidad.primer_apellido} ${this.estudiante.identidad.segundo_apellido}`, marginLeftText, currentY);

        currentY += lineHeight;

        // Dibujar Nombres
        ctx.fillText(`${this.estudiante.identidad.primer_nombre} ${this.estudiante.identidad.segundo_nombre}`, marginLeftText, currentY);

        currentY += lineHeight-5;

        // Dibujar Carrera con subrayado y tamaño 14px
        ctx.font = 'bold 13px "Open Sans", Arial, sans-serif';
ctx.textBaseline = 'middle'; // Asegura que el texto se dibuje correctamente con el subrayado

// Dibujar el texto de la carrera
ctx.fillText(`${this.estudiante.identidad.programa}`, marginLeftText, currentY);

// Dibujar subrayado
const textWidth = ctx.measureText(`${this.estudiante.identidad.programa}`).width;
ctx.beginPath();
ctx.moveTo(marginLeftText, currentY + 8); // Ajusta la posición Y para el subrayado
ctx.lineTo(marginLeftText + textWidth, currentY + 8);
ctx.strokeStyle = '#000'; // Color del subrayado
ctx.lineWidth = 1; // Grosor del subrayado
ctx.stroke();
      };

      // Manejo de error al cargar la foto
      foto.onerror = () => {
        console.error('Error al cargar la foto del estudiante');
      };
    };

    // Manejo de error al cargar la imagen de fondo
    background.onerror = () => {
      console.error('Error al cargar la imagen base del carnet');
    };
  }
}


}
