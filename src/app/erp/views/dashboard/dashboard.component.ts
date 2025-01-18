import { Component, AfterViewInit, ViewChild, ElementRef   } from '@angular/core'; 
import { SalesService } from '../../service/sales/sales.service';  
import { AuthService } from '../../../service/auth/auth.service';
interface Grafico {
  x: string;
  y: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private semanasales: Grafico[] = [];
  private semanaanterior: Grafico[] = [];
   summarizedData: Grafico[] = [];
   summarizedDatalastweek: Grafico[] = [];
   summarizedDataservices: Grafico[] = [];
  transformedData: { name: string; data: { x: string; y: number }[] }[] = [];
  transformedDatalastweek: { name: string; data: { x: string; y: number }[] }[] = [];
  isDataLoaded: boolean = false; // Variable para controlar la carga de datos

  constructor(private authService: AuthService, private salesService: SalesService) {}

  ngOnInit(): void {
    if (this.hasRole(['ADMIN', 'SUPERVISOR'])) {
      this.getdata();
    }
  }

  hasRole(roles: string[]): boolean {
    return this.authService.hasRole(roles);
  }

  async getdata() {
    try {
      const response = await this.salesService.Salesgetdatagraph();
      this.semanasales = response.thisWeek;
      this.semanaanterior = response.lastWeek;
      this.transformedData = this.transformData(response.thisWeekpeerbarber); 
      this.transformedDatalastweek = this.transformData(response.lastWeekpeerbarber); 

      this.summarizedData = this.summarizeData(response.thisWeekpeerbarber);
      this.summarizedDatalastweek = this.summarizeData(response.lastWeekpeerbarber);
      this.summarizedDataservices =  response.thisWeekservices 
      console.log(response.thisWeekservicespdf)
      this.isDataLoaded = true; // Marca los datos como cargados
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }
  transformData(rawData: any[]): { name: string; data: { x: string; y: number }[] }[] {
    return rawData.map((item) => ({
      name: item.name,
      data: item.data
    }));
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  // Métodos getter para proporcionar los datos actualizados
  getSemanaSalesData(): Grafico[] {
    return this.semanasales.length > 0 ? this.semanasales : [{ x: 'Sin datos', y: 0 }];
  }

  getSemanaAnteriorData(): Grafico[] {
    return this.semanaanterior.length > 0 ? this.semanaanterior : [{ x: 'Sin datos', y: 0 }];
  }

  summarizeData(data: any[]): { x: string; y: number }[] {
    return data
      .map(person => {
        const total = person.data.reduce((sum: number, day: { x: string; y: number }) => sum + day.y, 0);
        return { x: person.name, y: total };
      })
      .sort((a, b) => a.x.localeCompare(b.x)); // Ordenar alfabéticamente por `x`
  }


}



 
