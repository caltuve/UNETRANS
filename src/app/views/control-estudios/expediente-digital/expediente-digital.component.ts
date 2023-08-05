import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import { ControlEstudiosService } from '../control-estudios.service';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
@Component({
  selector: 'app-expediente-digital',
  templateUrl: './expediente-digital.component.html',
  styleUrls: ['./expediente-digital.component.scss']
})
export class ExpedienteDigitalComponent implements OnInit {
  estudiante: any []= [];
  constructor(
    public controlestudiosService: ControlEstudiosService) {}

  ngOnInit() {
    this.findEstudiante();
    this.generatedPDFFile();

  }
  title = 'htmltopdf';

  @ViewChild('pdfTable') pdfTable: ElementRef;

  public generatedPDFFile() {
    const doc = new jsPDF();

    const pdfTable = this.pdfTable.nativeElement;

    var result = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = { content: result };
    pdfMake.createPdf(documentDefinition).open();

  }
  findEstudiante(){
    this.controlestudiosService.getEstudiante().subscribe(
      (result: any) => {
        this.estudiante = result;
      }
    );
  }
}
