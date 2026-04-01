import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

interface ChartData {
  name: string;
  color?: string;
  data: { x: string; y: number }[];
}

@Component({
  selector: 'app-custom-chart',
  templateUrl: './custom-chart.component.html',
  styleUrl: './custom-chart.component.css'
})
export class CustomChartComponent implements OnChanges {

  @Input() series: ChartData[] = [];
  @Input() type: 'line' | 'bar' | 'area' = 'line';
  @Input() title: string = 'Gráfico dinámico';

  chartType: ChartType = 'line';
  chartLabels: string[] = [];
  chartDatasets: ChartDataset[] = [];

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          font: { size: 9 },           // ← Letras de leyenda más pequeñas
          padding: 15,
          boxWidth: 12
        }
      },
      title: {
        display: true,
        text: '',
        font: { size: 14 },             // ← Título más pequeño
        padding: { top: 10, bottom: 20 }
      },
      tooltip: {
        titleFont: { size: 12 },
        bodyFont: { size: 12 }
      }
    },
    scales: {
      x: {
        ticks: {
          font: { size: 9 },           // ← Letras del eje X más pequeñas
          maxRotation: 45,
          minRotation: 0
        },
        grid: { display: true, color: '#e0e0e0' }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 11 }            // ← Letras del eje Y más pequeñas
        },
        grid: { display: true, color: '#e0e0e0' }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series'] || changes['type'] || changes['title']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.series?.length) {
      this.chartDatasets = [];
      this.chartLabels = [];
      return;
    }

    this.chartLabels = this.series[0].data.map(point => point.x);

    this.chartDatasets = this.series.map((serie, index) => ({
      label: `${serie.name} (Total: ${this.calculateTotal(serie.data)})`,
      data: serie.data.map(point => point.y),
      borderColor: serie.color || this.getDefaultColor(index),
      backgroundColor: serie.color
        ? this.hexToRgba(serie.color, this.type === 'area' ? 0.5 : 0.7)
        : this.getDefaultColor(index, this.type === 'area' ? 0.4 : 0.7),
      borderWidth: this.type === 'line' || this.type === 'area' ? 3 : 2,
      tension: 0.3,
      fill: this.type === 'area',
    }));

    this.chartOptions.plugins!.title!.text = this.title;
    this.chartType = this.type === 'area' ? 'line' : this.type;
  }

  private calculateTotal(data: { x: string; y: number }[]): number {
    return data.reduce((sum, point) => sum + point.y, 0);
  }

  private getDefaultColor(index: number, alpha: number = 1): string {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const color = colors[index % colors.length];
    return alpha === 1 ? color : this.hexToRgba(color, alpha);
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}