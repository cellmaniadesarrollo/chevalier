import { Component } from '@angular/core';
import { SalesService } from '../../service/sales/sales.service';
import { ListHairdresserI } from '../../models/hairdresser.interface';
import { PdfReportComponent } from '../../layout/pdf-report/pdf-report.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  filtros = {
    fechaHoraInicio: '',
    fechaHoraFin: '',
    tipoReporte: 'normal',
    barbero: null
  };
  mostrarIngresos: boolean = false; // Cambia según tu lógica
  toggleIngresos(condicion:boolean): void { 
    this.displayedColumns = condicion
    ? ['servicio', '#Total', 'ingresoTotal']
    : ['servicio', '#Hoy', 'totalHoy', '#Semana', 'totalSemana', '#Mes', 'totalMes', '#Ano', 'totalAno'];
  }
  displayedColumns: string[] = this.mostrarIngresos
  ? ['servicio', '#Total', 'ingresoTotal']
  : ['servicio', '#Hoy', 'totalHoy', '#Semana', 'totalSemana', '#Mes', 'totalMes', '#Ano', 'totalAno'];

  barberos: ListHairdresserI[] = [];
  textoFecha: string = '';

  // Variables para el resumen y detalles
  resumenIngresos = {
    servicio:"Total",
    countTotal: 0,
    ingresoTotal: 0,
    countHoy:0,
    totalHoy: 0,
    countSemana: 0,
    totalSemana: 0,
    countMes: 0,
    totalMes: 0,
    countAno: 0,
    totalAno: 0
  };
  detallesIngresos: any[] = [];

  constructor(private salesservice: SalesService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.cambiarRangoFechas(); // Inicializa las fechas según el tipo de reporte
    this.aplicarFiltros();
  }

  cambiarRangoFechas() {
    const hoy = new Date();
    let fechaInicio: Date | undefined;
    let fechaFin: Date | undefined;

    switch (this.filtros.tipoReporte) {
      case 'normal':
        fechaInicio = new Date(hoy.setHours(0, 0, 0, 0));
        this.filtros.fechaHoraInicio = '';
        this.filtros.fechaHoraFin = '';
        fechaFin = new Date(hoy.setHours(23, 59, 59, 999));
        this.textoFecha = `Hoy: ${fechaInicio.toLocaleDateString()}`;
        break;

      case 'Seleccionar Fecha':
        this.textoFecha = ''; // Limpiar el texto cuando seleccionan la opción de fechas manuales
        break;
    }
  }

  async aplicarFiltros() {
 
    // Llamada al servicio para obtener los datos del backend
    const data = await this.salesservice.Salesreports(this.consultaFiltros());

    // Asignar los barberos al dropdown
    this.barberos = data.hairdresser;

    //this.detallesIngresos = data.report;
    // Asignar el resumen de ingresos y los detalles de servicios a las variables
    if (data.report && data.report.resumenIngresos && data.report.resumenIngresos.length > 0) {
      const resumen = data.report.resumenIngresos[0].resumenIngresos;
      if(resumen.countTotal&&resumen.ingresoTotal){
        this.toggleIngresos(true)
      }else{
        this.toggleIngresos(false)
      }
      this.resumenIngresos = {
        servicio:"Total",
        countTotal:resumen.countTotal || 0,
        ingresoTotal: resumen.ingresoTotal || 0,
        countHoy:resumen.countHoy || 0,
        totalHoy: resumen.totalHoy || 0,
        totalSemana: resumen.totalSemana || 0,
        countSemana: resumen.countSemana || 0,
        countMes:resumen.countMes|| 0,
        totalMes: resumen.totalMes || 0,
        countAno:resumen.countAno || 0,
        totalAno: resumen.totalAno || 0
      };
    }else{
      this.resumenIngresos = {

        servicio:"Total",
        countTotal:0,
        ingresoTotal:   0,
        countHoy:  0,
        totalHoy:   0,
        countSemana:0,
        totalSemana:   0,
        countMes: 0,
        totalMes:  0,
        countAno: 0,
        totalAno:  0
      };
    }

    if (data.report && data.report.serviciosreportes) {
      this.detallesIngresos = data.report.serviciosreportes.map((item:any)=> ({
        servicio:item.servicio,
        countTotal: item.countTotal || 0,
        ingresoTotal: item.ingresoTotal || 0,
        countHoy:item.countHoy|| 0,
        totalHoy: item.totalHoy || 0,
        countSemana:item.countSemana || 0,
        totalSemana: item.totalSemana || 0,
        countMes:item.countMes || 0,
        totalMes: item.totalMes || 0,
        countAno:item.countAno || 0,
        totalAno: item.totalAno || 0
      } )); 
      this.detallesIngresos.push(this.resumenIngresos)
    }else{
      this.detallesIngresos =[this.resumenIngresos]
    } 
  }

  openDialogpdf(): void {
    let consulta=this.consultaFiltros() as any
     consulta.nombrebarbero = this.barberos.find((barbero: ListHairdresserI) => barbero._id === this.filtros.barbero)?.name?? 'TODOS';
    const dialogRef = this.dialog.open(PdfReportComponent, {
      width: '600px',
      height: '200px',
      disableClose: false,
      data: consulta
    });

 
  }
  consultaFiltros(){
    let datafecha = null;

    if (this.filtros.fechaHoraInicio !== '' && this.filtros.fechaHoraFin !== '') {
      datafecha = {
        start: this.filtros.fechaHoraInicio,
        end: this.filtros.fechaHoraFin
      };
    }
    return {
      fecha: datafecha,
      tipoReporte: this.filtros.tipoReporte,
      barbero: this.filtros.barbero
    };
  }



  isLastRow(row: any): boolean {
    return this.detallesIngresos[this.detallesIngresos.length - 1] === row;
  }

}