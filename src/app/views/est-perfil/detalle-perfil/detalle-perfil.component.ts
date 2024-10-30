import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ControlEstudiosService } from '../../control-estudios/control-estudios.service';
import { NotificacionService } from './../../../notificacion.service'
import { NgxSpinnerService } from "ngx-spinner";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ModalDirective} from 'ngx-bootstrap/modal';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

reimpresionPlanillaAspirante(cedula: { cedula: number; }){
  
  this.controlestudiosService.getEstudianteAspirante(cedula).subscribe(
    (result: any) => {
      console.log(cedula)
      //this.estudiante = result;
      this.estudiante = Object.values(result);
      this.generatedPDFFile();
      //this.createEtiqueta();
    }
  );
}


public generatedPDFFile() {
  const doc = new jsPDF('p', 'pt', 'letter');

  // Página 1 - Ficha de Registro Estudiantil
  const nacionalidad = this.estudiante[0].nac;
  const cedula = this.estudiante[0].ced_pas;
  const nombres = this.estudiante[0].nombres;
  const apellidos = this.estudiante[0].apellidos;
  const sexo = this.estudiante[0].sexo;
  const fnac = this.estudiante[0].fecnac;
  const edocivil = this.estudiante[0].edocivil;
  const gsanguineo = this.estudiante[0].gsanguineo;
  const edonac = this.estudiante[0].edonac;
  const muninac = this.estudiante[0].muninac;
  const parronac = this.estudiante[0].parronac;
  const etnia = this.estudiante[0].etnia;
  const discapacidad = this.estudiante[0].discapacidad;
  const conapdis = this.estudiante[0].conapdis;
  const edores = this.estudiante[0].edores;
  const munires = this.estudiante[0].munires;
  const parrores = this.estudiante[0].parrores;
  const direccion_hab = this.estudiante[0].direccion_hab;
  const tlf_cel = this.estudiante[0].tlf_cel;
  const tlf_hab = this.estudiante[0].tlf_hab;
  const tlf_emergencia = this.estudiante[0].tlf_emergencia;
  const parentesco_emergencia = this.estudiante[0].parentesco_emergencia;
  const nombcontacto = this.estudiante[0].nombcontacto;
  const email = this.estudiante[0].email;
  const email_alt = this.estudiante[0].email_alt;
  const edoplantel = this.estudiante[0].edoplantel;
  const munplantel = this.estudiante[0].munplantel;
  const parplantel = this.estudiante[0].parplantel;
  const plantel = this.estudiante[0].plantel;
  const mencion = this.estudiante[0].mencion;
  const indice = this.estudiante[0].indice.toString();
  const sni = this.estudiante[0].sni_rusnies;
  const gradoedumedia = this.estudiante[0].fechagrado;
  const nombies = this.estudiante[0].nombies;
  const tituloies = this.estudiante[0].tituloies;
  const gradoies = this.estudiante[0].fechagradoies;
  const carnet = this.estudiante[0].carnet.toString();
  const pnf = this.estudiante[0].pnf;
  const sede = this.estudiante[0].sede;
  const mod_ingreso = this.estudiante[0].mod_ingreso;
  const trayecto_ing = this.estudiante[0].trayecto_ing;
  const mencionies = this.estudiante[0].mencionies;

  // Agregar encabezado en cada página
  const headerImg = new Image();
  headerImg.src = 'assets/img/brand/cintillo_unetrans_082023.png';
  
  //doc.addPage();
  doc.addImage(headerImg, 'PNG', 42, 10, 1052/2, 87/2);
  
  doc.setDrawColor(0);
  doc.setFillColor(255, 255, 255);
  doc.setFontSize(12);
  // Agregar el contenido de la ficha de registro estudiantil (como tienes ahora)
  // Encabezado y contenido de la ficha...
  doc.setFontSize(12);
  doc.setFont('Arial', 'bold');
  doc.text('Ficha de Registro Estudiantil', doc.internal.pageSize.getWidth() / 2, 76, { align: 'center' });
  
// Contenido
doc.setFontSize(10);

//Primera línea
doc.setFont('Arial','bold');
doc.text(`1. Datos de identidad del estudiante`, 55, 100);
const item1 = 'Cédula:';
const value1 = `${nacionalidad}-${cedula}`;
const item2 = 'Nombres:';
const value2 = `${nombres}`;
const item3 = 'Apellidos:';
const value3 = `${apellidos}`;
const item1Width = doc.getTextWidth(item1);
const value1Width = doc.getTextWidth(value1);
const item2Width = doc.getTextWidth(item2);
const value2Width = doc.getTextWidth(value2);
const item3Width = doc.getTextWidth(item3);
doc.setFont('Arial', 'bold');
doc.text(item1, 67, 113);
doc.text(item2, 67 + item1Width + 2 + value1Width + 10, 113);
doc.text(item3, 67 + item1Width + 2 + value1Width + 10 + item2Width + 2 + value2Width + 10, 113);
doc.setFont('Arial', 'normal');
doc.text(value1, 67 + item1Width + 2, 113);
doc.text(value2, 67 + item1Width + 2 + value1Width + 10 + item2Width + 2, 113);
doc.text(value3, 67 + item1Width + 2 + value1Width + 10 + item2Width + 2 + value2Width + 10 + item3Width +2, 113);


//Segunda línea
const item4 = 'Estado civil:';
const value4 = `${edocivil}`;
const item5 = 'Fecha de nacimiento:';
const value5 = `${fnac}`;
const item6 = 'Género:';
const value6 = `${sexo}`;
const item7 = 'Tipo de sangre:';
const value7 = `${gsanguineo}`;
const item4Width = doc.getTextWidth(item4);
const value4Width = doc.getTextWidth(value4);
const item5Width = doc.getTextWidth(item5);
const value5Width = doc.getTextWidth(value5);
const item6Width = doc.getTextWidth(item6);
const value6Width = doc.getTextWidth(value6);
const item7Width = doc.getTextWidth(item7);

doc.setFont('Arial', 'bold');
doc.text(item4, 67, 126);
doc.text(item5, 67 + item4Width + 4 + value4Width + 10, 126);
doc.text(item6, 67 + item4Width + 4 + value4Width + 10 + item5Width + 4 + value5Width + 10, 126);
doc.text(item7, 67 + item4Width + 4 + value4Width + 10 + item5Width + 4 + value5Width + 10 + item6Width + 4 + value6Width + 10, 126);
doc.setFont('Arial', 'normal');
doc.text(value4, 67 + item4Width + 4, 126);
doc.text(value5, 67 + item4Width + 4 + value4Width + 10 + item5Width + 6, 126);
doc.text(value6, 67 + item4Width + 4 + value4Width + 10 + item5Width + 6 + value5Width + 10 + item6Width + 4, 126);
doc.text(value7, 67 + item4Width + 4 + value4Width + 10 + item5Width + 6 + value5Width + 10 + item6Width + 4 + value6Width + 10 + item7Width + 4 , 126);

//Tercera línea
const item8Width = doc.getTextWidth(edonac);
const value8Width = doc.getTextWidth(muninac);
doc.setFont('Arial','bold');
doc.text(`Ubicación geográfica del lugar de nacimiento:`, 67, 143);
doc.text(`Estado:`, 67, 156);
doc.text(`Municipio:`, 67 + item8Width + 30, 156);
doc.text(`Parroquia:`, 67 + item8Width + 30 + value8Width + 30, 156);
doc.setFont('Arial','normal');
doc.text(edonac, 67, 169);
doc.text(muninac, 67 + item8Width + 30, 169);
doc.text(parronac, 67 + item8Width + 30 + value8Width + 30, 169);


//Cuarta línea
const item9Width = doc.getTextWidth(etnia);
const value10Width = doc.getTextWidth(discapacidad);
doc.setFont('Arial','bold');
doc.text(`Información complementaria:`, 67, 186);
doc.text(`Etnia:`, 67, 199);
doc.text(`Discapacidad:`, 67 + item9Width + 20, 199);
if (conapdis == null) {
} else {doc.text(`Nro CONAPDIS:`, 67 + item9Width + 20 + value10Width +20, 199);}
doc.setFont('Arial','normal');
doc.text(etnia, 67, 212);
doc.text(discapacidad, 67 + item9Width + 20, 212);
if (conapdis == null) {
} else {
const conapdis2 = this.estudiante[0].conapdis.toString();
doc.text(conapdis2, 67 + item9Width + 20 + value10Width +20, 212);
}

//Quinta línea
const item11Width = doc.getTextWidth(edores);
const value12Width = doc.getTextWidth(munires);
doc.setFont('Arial','bold');
doc.text(`2. Datos de residencia y contacto`, 55, 229);
doc.text(`Ubicación geográfica residencial:`, 67, 242);
doc.text(`Estado:`, 67, 255);
doc.text(`Municipio:`, 67 + item11Width + 30, 255);
doc.text(`Parroquia:`, 67 + item11Width + 30 + value12Width + 30, 255);
doc.setFont('Arial','normal');
doc.text(edores, 67, 268);
doc.text(munires, 67 + item11Width + 30, 268);
doc.text(parrores, 67 + item11Width + 30 + value12Width + 30, 268);

//Sexta línea
const item13 = 'Direccción completa:';
const item13Width = doc.getTextWidth(item13);
doc.setFont('Arial','bold');
doc.text(item13, 67, 281);
doc.setFont('Arial','normal');
doc.text(direccion_hab, 67 + item13Width + 9, 281);

//Séptima línea
doc.setFont('Arial','bold');
doc.text(`Datos de contacto:`, 67, 294);
const item14 = 'Teléfono móvil:';
const value14 = `${tlf_cel}`; 
const item15 = 'Teléfono residencial:';
const value15 = `${tlf_hab}`; 
const item16 = 'Email:';
const value16 = `${email}`; 

const item14Width = doc.getTextWidth(item14);
const value14Width = doc.getTextWidth(value14);
const item15Width = doc.getTextWidth(item15);
const value15Width = doc.getTextWidth(value15);
const item16Width = doc.getTextWidth(item16);

doc.setFont('Arial','bold');
doc.text(item14, 67, 307);
if (tlf_hab == null) {
doc.text(item16, 67 + item14Width + 5 + value14Width + 10, 307);
} else {
doc.text(item15, 67 + item14Width + 5 + value14Width + 10, 307);
doc.text(item16, 67 + item14Width + 5 + value14Width + 10 + item15Width + 5 + value15Width + 10 , 307);
}
doc.setFont('Arial','normal');
doc.text(value14, 67 + item14Width + 5, 307);

if (tlf_hab == null) {
doc.text(value16, 67 + item14Width + 5 + value14Width + 10 + item16Width + 3, 307);
} else {
doc.text(value15, 67 + item14Width + 5 + value14Width + 10 + item15Width + 5, 307);
doc.text(value16, 67 + item14Width + 5 + value14Width + 10 + item15Width + 5 + value15Width + 10 + item16Width + 3, 307);
}

//Octava línea
const item17 = 'Teléfono de emergencia:';
const value17 = `${tlf_emergencia}`; 
const item18 = 'Contacto de emergencia:';
const value18 = `${nombcontacto} - ${parentesco_emergencia}`; 

const item17Width = doc.getTextWidth(item17);
const value17Width = doc.getTextWidth(value17);
const item18Width = doc.getTextWidth(item18);

doc.setFont('Arial', 'bold');
doc.text(item17, 67, 320);
doc.text(item18, 67 + item17Width + 7 + value17Width + 10, 320);
doc.setFont('Arial', 'normal');
doc.text(value17, 67 + item17Width + 7, 320);
doc.text(value18, 67 + item17Width + 7 + value17Width + 10 + item18Width + 9, 320);


//Novena línea
const item19Width = doc.getTextWidth(edoplantel);
const value19Width = doc.getTextWidth(munplantel);

doc.setFont('Arial','bold');
doc.text(`3. Datos académicos`, 55, 337);
doc.text(`Educación Media General:`, 67, 350);
doc.text(`Ubicación geográfica del plantel:`, 67, 363);
doc.text(`Estado:`, 67, 376);
doc.text(`Municipio:`, 67 + item19Width + 30, 376);
doc.text(`Parroquia:`, 67 + item19Width + 30 + value19Width + 30, 376);
doc.setFont('Arial','normal');
doc.text(edoplantel, 67, 389);
doc.text(munplantel, 67 + item19Width + 30, 389);
doc.text(parplantel, 67 + item19Width + 30 + value19Width + 30, 389);
doc.setFont('Arial','bold');
doc.text(`Nombre del plantel: `, 67, 402);
doc.setFont('Arial','normal');
doc.text(plantel, 157, 402);


//Décima línea
const item20 = 'Título/Mención:';
const value20 = `${mencion}`;
const item21 = 'Fecha de grado:';
const value21 = `${gradoedumedia}`;
const item22 = 'Índice:';
const value22 = `${indice}`;
const item23 = 'N° SNI:';
const value23 = `${sni}`;
const item20Width = doc.getTextWidth(item20);
const value20Width = doc.getTextWidth(value20);
const item21Width = doc.getTextWidth(item21);
const value21Width = doc.getTextWidth(value21);
const item22Width = doc.getTextWidth(item22);
const value22Width = doc.getTextWidth(value22);
const item23Width = doc.getTextWidth(item23);

doc.setFont('Arial', 'bold');
doc.text(item20, 67, 415);
doc.text(item21, 67 + item20Width + 6 + value20Width + 10, 415);
doc.text(item22, 67 + item20Width + 6 + value20Width + 10 + item21Width + 8 + value21Width + 10, 415);
doc.text(item23, 67 + item20Width + 6 + value20Width + 10 + item21Width + 8 + value21Width + 10 + item22Width + 4 + value22Width + 10, 415);
doc.setFont('Arial', 'normal');
doc.text(value20, 67 + item20Width + 6, 415);
doc.text(value21, 67 + item20Width + 6 + value20Width + 10 + item21Width + 8, 415);
doc.text(value22, 67 + item20Width + 6 + value20Width + 10 + item21Width + 8 + value21Width + 10 + item22Width + 4, 415);
doc.text(value23, 67 + item20Width + 6 + value20Width + 10 + item21Width + 8 + value21Width + 10 + item22Width + 4 + value22Width + 10 + item23Width + 4 , 415);

if (nombies == null) {
//Se muestran directamente los datos del paso 4 si no tiene datos universitarios

doc.setFont('Arial','bold');
doc.text(`4. Datos de inscripción en la UNETRANS`, 55, 432);
const item24 = 'N° de Carnet:';
const value24 = `${carnet}`;
const item25 = 'Trayecto de ingreso:';
const value25 = `${trayecto_ing}`;
const item26 = 'Modo de ingreso:';
const value26 = `${mod_ingreso}`;
const item27 = 'Sede:';
const value27 = 'Central' //`${sede}`;
const item28 = 'PNF:';
const value28 = `${pnf}` 
const item24Width = doc.getTextWidth(item24);
const value24Width = doc.getTextWidth(value24);
const item25Width = doc.getTextWidth(item25);
const value25Width = doc.getTextWidth(value25);
const item26Width = doc.getTextWidth(item26);
const value26Width = doc.getTextWidth(value26);
const item27Width = doc.getTextWidth(item27);
const value27Width = doc.getTextWidth(value27);
const item28Width = doc.getTextWidth(item28);
const value28Width = doc.getTextWidth(value28);

doc.setFont('Arial', 'bold');
doc.text(item24, 67, 445);
doc.text(item25, 67 + item24Width + 2 + value24Width + 10, 445);
doc.text(item26, 67 + item24Width + 2 + value24Width + 10 + item25Width + 4 + value25Width + 10, 445);
// linea que muestra en pnf y la sede (titulos en negrita)
doc.text(item28, 67, 458);
doc.text(item27, 67 + item28Width + 2 + value28Width + 10, 458);

doc.setFont('Arial', 'normal');
doc.text(value24, 67 + item24Width + 2, 445);
doc.text(value25, 67 + item24Width + 2 + value24Width + 10 + item25Width + 4, 445);
doc.text(value26, 67 + item24Width + 2 + value24Width + 10 + item25Width + 4 + value25Width + 10 + item26Width + 4, 445);
// linea que muestra en pnf y la sede
doc.text(value28, 67 + item28Width + 2, 458);
doc.text(value27, 67 + item28Width + 2 + value28Width + 10 + item27Width + 3, 458);

doc.setFontSize(10);
doc.setFont('Arial', 'bold');
doc.text('Requisitos para formalizar el proceso de inscripción', doc.internal.pageSize.getWidth() / 2, 495, { align: 'center' });
doc.setFontSize(8);
doc.setFont('Arial', 'bold');
doc.text('SÓLO PARA SER LLENADO POR CONTROL DE ESTUDIOS', doc.internal.pageSize.getWidth() / 2, 508, { align: 'center' });

//tabla de requisitos
var body = [
[1, 'Una (1) copia ampliada de la cédula de identidad al 150% sin recortar','', 6, 'Constancia de inscripcion en el Sistema Nacional de Ingreso.'],
[2, 'Una (1) copia de la Partida de Nacimiento. ','',7, 'Una (1) copia de la inscripción del Registro Militar, sin recortar.'],
[3, 'Una (1) Foto tipo carnet fondo blanco. ','',8, 'Una (1) copia del tipeaje sanguíneo.'],
[4, 'Una (1) copia simple del Título de Bachiller','',9, 'Cuatro (4) fundas plásticas'],
[5, 'Una (1) copia de las Notas Certificadas con sus timbre fiscal (Del 1er al 5to año).','',10, 'Una (1) carpeta manila tamaño OFICIO, con gancho.']
]
// New Header and Footer Data Include the table
let margin = doc.internal.pageSize.getWidth() / 2;
autoTable(doc,{
body: body,
startY: 520,
head:[['N°','Documento', '','N°','Documento', '']],
headStyles :{lineWidth: 1,fillColor: [0, 62, 133],textColor: [255,255,255], fontSize: 7,
},
bodyStyles :{ fontSize: 6,
},
margin: {left: 60, right: margin},
theme: 'grid',
columnStyles: {
0: {
 halign: 'center',
 valign: 'middle',
 cellWidth: 20,
 fillColor: [232, 252, 245],
},
1: {
 halign: 'left',
 valign: 'middle',
 cellWidth: 230,
 fillColor: [232, 252, 245],
},
2: {
 halign: 'center',
 cellWidth: 20,
 fillColor: [232, 252, 245],
},
3: {
 halign: 'center',
 valign: 'middle',
 cellWidth: 20,
 fillColor: [232, 252, 245],
},
4: {
 halign: 'left',
 valign: 'middle',
 cellWidth: 190,
 fillColor: [232, 252, 245],
},
5: {
 halign: 'center',
 cellWidth: 20,
 fillColor: [232, 252, 245],
},
},
})
doc.setFontSize(9);
doc.setFont('Arial','normal');
doc.text('NOTA: Al momento de formalizar la inscripción debe consignar la documentación en ORIGINAL para su verificación', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 150, { align: 'center' });
doc.text(`____________________________`, 80, doc.internal.pageSize.getHeight() - 60);
doc.text(`____________________________`, 250, doc.internal.pageSize.getHeight() - 60);
doc.text(`____________________________`, 420, doc.internal.pageSize.getHeight() - 60);
doc.setFont('Arial','bold');
doc.text(`Firma del participante`, 100, doc.internal.pageSize.getHeight() - 50);
doc.text(`Personal de Control de Estudios`, 250, doc.internal.pageSize.getHeight() - 50);
doc.text(`Fecha consignación`, 446, doc.internal.pageSize.getHeight() - 50);

} else {

//Décima línea
const item29 = 'Institución de Educ. Univ.:';
const value29 = `${nombies}`;
const item30 = 'Título:';
const value30 = `${tituloies} (${mencionies})`;
const item31 = 'Fecha de grado:';
const value31 = `${gradoies}`;
const item29Width = doc.getTextWidth(item29);
const value29Width = doc.getTextWidth(value29);
const item30Width = doc.getTextWidth(item30);
const value30Width = doc.getTextWidth(value30);
const item31Width = doc.getTextWidth(item31);

doc.setFont('Arial','bold');
doc.text(`Educación Universitaria:`, 67, 432);
doc.setFont('Arial', 'bold');
doc.text(item29, 67, 445);
doc.text(item30, 67 + item29Width + 10 + value29Width + 5, 445);
doc.text(item31, 67 + item29Width + 10 + value29Width + 5 + item30Width + 8 + value30Width + 10, 445);
doc.setFont('Arial', 'normal');
doc.text(value29, 67 + item29Width + 10, 445);
doc.text(value30, 67 + item29Width + 10 + value29Width + 5 + item30Width + 8, 445);
doc.text(value31, 67 + item29Width + 10 + value29Width + 5 + item30Width + 8 + value30Width + 10 + item31Width + 8, 445);

doc.setFont('Arial','bold');
doc.text(`4. Datos de inscripción en la UNETRANS`, 55, 462);
const item24 = 'N° de Carnet:';
const value24 = `${carnet}`;
const item25 = 'Trayecto de ingreso:';
const value25 = `${trayecto_ing}`;
const item26 = 'Modo de ingreso:';
const value26 = `${mod_ingreso}`;
const item27 = 'Sede:';
const value27 = 'Central' //`${sede}`;
const item28 = 'PNF:';
const value28 = `${pnf}` 
const item24Width = doc.getTextWidth(item24);
const value24Width = doc.getTextWidth(value24);
const item25Width = doc.getTextWidth(item25);
const value25Width = doc.getTextWidth(value25);
const item26Width = doc.getTextWidth(item26);
const value26Width = doc.getTextWidth(value26);
const item27Width = doc.getTextWidth(item27);
const value27Width = doc.getTextWidth(value27);
const item28Width = doc.getTextWidth(item28);
const value28Width = doc.getTextWidth(value28);

doc.setFont('Arial', 'bold');
doc.text(item24, 67, 475);
doc.text(item25, 67 + item24Width + 2 + value24Width + 10, 475);
doc.text(item26, 67 + item24Width + 2 + value24Width + 10 + item25Width + 4 + value25Width + 10, 475);
// linea que muestra en pnf y la sede (titulos en negrita)
doc.text(item28, 67, 488);
doc.text(item27, 67 + item28Width + 2 + value28Width + 10, 488);

doc.setFont('Arial', 'normal');
doc.text(value24, 67 + item24Width + 2, 475);
doc.text(value25, 67 + item24Width + 2 + value24Width + 10 + item25Width + 4, 475);
doc.text(value26, 67 + item24Width + 2 + value24Width + 10 + item25Width + 4 + value25Width + 10 + item26Width + 4, 475);
// linea que muestra en pnf y la sede
doc.text(value28, 67 + item28Width + 2, 488);
doc.text(value27, 67 + item28Width + 2 + value28Width + 10 + item27Width + 3, 488);

doc.setFontSize(10);
doc.setFont('Arial', 'bold');
doc.text('Requisitos para formalizar el proceso de inscripción', doc.internal.pageSize.getWidth() / 2, 525, { align: 'center' });
doc.setFontSize(8);
doc.setFont('Arial', 'bold');
doc.text('SÓLO PARA SER LLENADO POR CONTROL DE ESTUDIOS', doc.internal.pageSize.getWidth() / 2, 538, { align: 'center' });

//tabla de requisitos
var body = [
[1, 'Una (1) copia ampliada de la cédula de identidad al 150% sin recortar','', 6, 'Constancia de inscripcion en el Sistema Nacional de Ingreso.'],
[2, 'Una (1) copia de la Partida de Nacimiento. ','',7, 'Una (1) copia de la inscripción del Registro Militar, sin recortar.'],
[3, 'Una (1) Foto tipo carnet fondo blanco. ','',8, 'Una (1) copia del tipeaje sanguíneo.'],
[4, 'Una (1) copia simple del Título de Bachiller','',9, 'Cuatro (4) fundas plásticas'],
[5, 'Una (1) copia de las Notas Certificadas con sus timbre fiscal (Del 1er al 5to año).','',10, 'Una (1) carpeta manila tamaño OFICIO, con gancho.']
]
// New Header and Footer Data Include the table
let margin = doc.internal.pageSize.getWidth() / 2;
autoTable(doc,{
body: body,
startY: 550,
head:[['N°','Documento', '','N°','Documento', '']],
headStyles :{lineWidth: 1,fillColor: [0, 62, 133],textColor: [255,255,255], fontSize: 7,
},
bodyStyles :{ fontSize: 6,
},
margin: {left: 60, right: margin},
theme: 'grid',
columnStyles: {
0: {
 halign: 'center',
 valign: 'middle',
 cellWidth: 20,
 fillColor: [232, 252, 245],
},
1: {
 halign: 'left',
 valign: 'middle',
 cellWidth: 230,
 fillColor: [232, 252, 245],
},
2: {
 halign: 'center',
 cellWidth: 20,
 fillColor: [232, 252, 245],
},
3: {
 halign: 'center',
 valign: 'middle',
 cellWidth: 20,
 fillColor: [232, 252, 245],
},
4: {
 halign: 'left',
 valign: 'middle',
 cellWidth: 190,
 fillColor: [232, 252, 245],
},
5: {
 halign: 'center',
 cellWidth: 20,
 fillColor: [232, 252, 245],
},
},
})
doc.setFontSize(9);
doc.setFont('Arial','normal');
doc.text('NOTA: Al momento de formalizar la inscripción debe consignar la documentación en ORIGINAL para su verificación', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 120, { align: 'center' });
doc.text(`____________________________`, 80, doc.internal.pageSize.getHeight() - 60);
doc.text(`____________________________`, 250, doc.internal.pageSize.getHeight() - 60);
doc.text(`____________________________`, 420, doc.internal.pageSize.getHeight() - 60);
doc.setFont('Arial','bold');
doc.text(`Firma del participante`, 100, doc.internal.pageSize.getHeight() - 50);
doc.text(`Personal de Control de Estudios`, 250, doc.internal.pageSize.getHeight() - 50);
doc.text(`Fecha consignación`, 446, doc.internal.pageSize.getHeight() - 50);

}

// Pie de página
doc.setFontSize(6);
doc.setFont('Arial', 'bold');
doc.text('FORMATO UNETRANS-DACE-01.', 20, doc.internal.pageSize.getHeight() - 20);

  // Página 2 - Etiquetas
  doc.addPage();  // Añadir una nueva página
  doc.addImage(headerImg, 'PNG', 42, 10, 1052/2, 87/2);

  const nombre_corto = this.estudiante[0].nombre_corto;

  doc.setFontSize(10);
  doc.setFont('Arial', 'bold');
  doc.text('Etiquetas para expediente estudiantil', doc.internal.pageSize.getWidth() / 2, 76, { align: 'center' });

  // Texto de instrucciones para imprimir y recortar las etiquetas...
  var text = "Debes imprimir y recortar las etiquetas para ser pegadas en la parte frontal de la carpeta (rectangulo grande) y en la pestaña de la carpeta (rectangulo pequeño).";
  var splitText = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - 108);
  doc.text(splitText, 55, 100);

  // Dibujar etiquetas y contenido
  const x = 55;
  const y = 130;
  const width = 380;
  const height = 120;
  doc.setDrawColor(0);
  doc.setLineWidth(0.4);
  doc.setLineDashPattern([1, 1], 0);
  doc.rect(x, y, width, height, 'D');
  
  doc.setFont('Arial', 'bold');
  doc.text('Expediente estudiantil UNETRANS', width - 135, y + 16, { align: 'center' });
  doc.setFont('Arial', 'normal');
  doc.text(`Carnet: ${carnet}     Cédula: ${nacionalidad}-${cedula}`, x + 5, y + 34);
  doc.text(`Nombres: ${nombres}`, x + 5, y + 50);
  doc.text(`Apellidos: ${apellidos}`, x + 5, y + 66);
  doc.text(`PNF: ${pnf}`, x + 5, y + 82);
  doc.text(`Ingreso: ${mod_ingreso}`, x + 5, y + 98);

  // Dibujar la línea para el carnet y nombre
  const lineStartX = x;
  const lineStartY = y+10 + height + 10;
  const lineEndX = x + width;
  
  //doc.setLineDash([]);
  doc.setLineWidth(0.4);
  doc.setLineDashPattern([1, 1], 0);
  const width2 = 412;
  const height2 = 28;
  doc.rect(lineStartX, lineStartY, width2, height2, 'D');


  // Escribir el texto del carnet y nombre
  const lineTextX = lineStartX + 5;
  
  doc.text(`Carnet: ${carnet}  Cédula: ${nacionalidad}-${cedula}  Estudiante: ${nombre_corto}`, lineTextX-2, lineStartY +16);
  
  doc.setFontSize(10);
  doc.setFont('Arial', 'normal');
  var text = "Para poder completar tu proceso de inscripción debes consignar los documentos en original y copia así como la carpeta con las etiquetas ya pegadas, deberás asistir a entregar el expediente el día que seas convocado.";
  var splitText = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - 108);
  doc.text(splitText, 55, 350);

  doc.setFontSize(10);
  doc.setFont('Arial', 'bold');
  var text = "NOTA: no perforar los documentos, los mismos deben ser revisados previamente por el personal de Control de Estudios";
  var splitText = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - 108);
  doc.text(splitText, 55, 380);

  // Pie de página
doc.setFontSize(6);
doc.setFont('Arial', 'bold');
doc.text('FORMATO UNETRANS-DACE-02.', 20, doc.internal.pageSize.getHeight() - 20);

  // Guardar el archivo PDF final con las dos páginas
  doc.save(`ficha_y_etiquetas_${cedula}.pdf`);
}


}
