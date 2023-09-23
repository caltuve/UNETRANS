import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import { ControlEstudiosService } from '../control-estudios.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-expediente-digital',
  templateUrl: './expediente-digital.component.html',
  styleUrls: ['./expediente-digital.component.scss']
})
export class ExpedienteDigitalComponent implements OnInit {
  estudiante: any;
  constructor(
    public controlestudiosService: ControlEstudiosService) {}

  ngOnInit() {
    this.findEstudiante();
    

  } 
  title = 'htmltopdf';

  @ViewChild('pdfTable') pdfTable: ElementRef;

  public generatedPDFFile() {


    const doc = new jsPDF('p', 'pt', 'letter');

    // Obtener los valores del JSON
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
    const conapdis = this.estudiante[0].conapdis
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
    
    // Resto del código para agregar contenido al PDF...
// Título
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



 


// // Pie de página
// doc.setFontSize(9);
// doc.setFont('Arial', 'bold');
// doc.text('FORMATO UNETRANS-DACE-01.', 20, doc.internal.pageSize.getHeight() - 20);
// doc.addPage();

// doc.addImage(headerImg, 'PNG', 42, 10, 1052/2, 87/2);
    
//     doc.setDrawColor(0);
//     doc.setFillColor(255, 255, 255);
//     doc.setFontSize(12);


// Pie de página
doc.setFontSize(6);
doc.setFont('Arial', 'bold');
doc.text('FORMATO UNETRANS-DACE-01.', 20, doc.internal.pageSize.getHeight() - 20);
    
    // Guardar el archivo PDF
    doc.save(`ficha_registro_ingreso_${cedula}.pdf`);

  }
  findEstudiante(){
    this.controlestudiosService.getEstudiante().subscribe(
      (result: any) => {

        //this.estudiante = result;
        this.estudiante = Object.values(result);
        const nombre = this.estudiante[0].conapdis;
        console.log(nombre)
        this.generatedPDFFile();

      }
    );
  }
}
