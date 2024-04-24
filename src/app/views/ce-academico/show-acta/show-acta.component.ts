import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-show-acta',
  templateUrl: './show-acta.component.html',
  styleUrls: ['./show-acta.component.scss']
})
export class ShowActaComponent {

  @Input() detalle_acta: any;
  @Input() inscritos: any[];

  constructor(public modalRef: BsModalRef) {}

  displayedColumnsDetail: string[] = ['orden','carnet','cedula','nombre_completo','telefono','correo'];

  exportarAExcel(): void {
    if (this.detalle_acta && this.detalle_acta.length > 0) {
      const primerDetalle = this.detalle_acta[0];
      const numeroActa = primerDetalle[0].acta || 'Acta';
      const numeroSeccion = primerDetalle[0].seccion || 'Seccion';
  
      const encabezado = [
        { A: 'Acta', B: primerDetalle[0].acta || '' },
        { A: 'Periodo Académico', B: primerDetalle[0].periodo || '' },
        { A: 'PNF', B: primerDetalle[0].nombre_programa || '' },
        { A: 'Unidad Curricular', B: (primerDetalle[0].cod_ucurr || '') + ' - ' + (primerDetalle[0].uni_curr || '') },
        { A: 'Sección', B: (primerDetalle[0].seccion || '') + ' - ' + (primerDetalle[0].tipo_sec || '') },
        { A: 'Docente', B: primerDetalle[0].prof_asignado || '' },
        // Una fila vacía como separador
        {},
      ];
  
      // Crear hoja de cálculo para el encabezado
      const wsEncabezado: XLSX.WorkSheet = XLSX.utils.json_to_sheet(encabezado, { skipHeader: true });
  
      // Agregar los datos de los inscritos a la hoja de cálculo
      XLSX.utils.sheet_add_json(wsEncabezado, this.inscritos, { skipHeader: true, origin: -1 });
  
      // Crear el libro y añadir la hoja
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsEncabezado, 'Estudiantes');
  
      const nombreArchivo = `Acta_${numeroActa}_Seccion_${numeroSeccion}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  
}
