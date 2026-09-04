import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
import { SalesService } from '../../service/sales/sales.service';
import { MatDialog } from '@angular/material/dialog';
import { MovementDetailModalComponent } from '../movement-detail-modal/movement-detail-modal.component';

interface Grafico {
  x: string;
  y: number;
}
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  private semanasales: Grafico[] = [];
  private semanaanterior: Grafico[] = [];
  summarizedData: Grafico[] = [];
  summarizedDatalastweek: Grafico[] = [];
  summarizedDataservices: Grafico[] = [];
  transformedData: { name: string; data: { x: string; y: number }[] }[] = [];
  transformedDatalastweek: { name: string; data: { x: string; y: number }[] }[] = [];
  isDataLoaded: boolean = false;

  // Reportes de caja
  recentSessions: any[] = [];
  recentMovements: any[] = [];

  // Totales y métricas
  totalThisWeek: number = 0;
  totalLastWeek: number = 0;
  avgDailyThisWeek: number = 0;
  avgDailyLastWeek: number = 0;
  topBarberThisWeek: string = '';
  topServiceThisWeek: string = '';
  weekChangePercent: number = 0;
  activeDaysThisWeek: number = 0;
  totalLastWeekEquivalent: number = 0;

  constructor(
    private authService: AuthService,
    private salesService: SalesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.isAdminOrSupervisor()) {
      this.getdata();
    }
  }

  // 🔹 Evaluación de roles
  isAdminOrSupervisor(): boolean {
    return this.authService.hasRole(['ADMIN', 'SUPERVISOR']);
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
      this.summarizedDataservices = response.thisWeekservices;

      this.recentSessions = response.recentSessions || [];
      this.recentMovements = response.recentMovements || [];

      this.totalThisWeek = response.thisWeek.reduce((s: number, d: any) => s + d.y, 0);
      this.totalLastWeek = response.lastWeek.reduce((s: number, d: any) => s + d.y, 0);

      this.activeDaysThisWeek = response.thisWeek.filter((d: any) => d.y > 0).length;
      const activeDaysLastWeek = response.lastWeek.filter((d: any) => d.y > 0).length;

      this.avgDailyThisWeek = this.activeDaysThisWeek > 0
        ? Math.round(this.totalThisWeek / this.activeDaysThisWeek) : 0;
      this.avgDailyLastWeek = activeDaysLastWeek > 0
        ? Math.round(this.totalLastWeek / activeDaysLastWeek) : 0;

      const equivalentLastWeek = response.lastWeek.slice(0, this.activeDaysThisWeek);
      this.totalLastWeekEquivalent = equivalentLastWeek.reduce((s: number, d: any) => s + d.y, 0);

      this.weekChangePercent = this.totalLastWeekEquivalent > 0
        ? Math.round(((this.totalThisWeek - this.totalLastWeekEquivalent) / this.totalLastWeekEquivalent) * 100) : 0;

      const topBarber = this.summarizedData.reduce(
        (a, b) => a.y > b.y ? a : b, { x: '', y: 0 }
      );
      this.topBarberThisWeek = topBarber.x;

      const topService = response.thisWeekservices.reduce(
        (a: any, b: any) => a.y > b.y ? a : b, { x: '', y: 0 }
      );
      this.topServiceThisWeek = topService.x.split(' - ')[0];

      this.isDataLoaded = true;

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
      .sort((a, b) => a.x.localeCompare(b.x));
  }

  viewMovementDetail(movementId: string): void {
    this.dialog.open(MovementDetailModalComponent, {
      width: '600px',
      data: { movementId }
    });
  }
}
