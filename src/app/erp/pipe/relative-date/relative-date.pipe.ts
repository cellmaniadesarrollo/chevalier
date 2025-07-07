import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'relativeDate'
})
export class RelativeDatePipe implements PipeTransform {
   transform(value: string | Date | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (this.isSameDayUTC(date, today)) {
      return 'Hoy ' + this.formatTimeUTC(date);
    } else if (this.isSameDayUTC(date, yesterday)) {
      return 'Ayer ' + this.formatTimeUTC(date);
    } else {
      return this.formatFullDateUTC(date);
    }
  }

  private isSameDayUTC(date1: Date, date2: Date): boolean {
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
           date1.getUTCMonth() === date2.getUTCMonth() &&
           date1.getUTCDate() === date2.getUTCDate();
  }

  private formatTimeUTC(date: Date): string {
    return new Intl.DateTimeFormat('es-EC', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    }).format(date);
  }

  private formatFullDateUTC(date: Date): string {
    return new Intl.DateTimeFormat('es-EC', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    }).format(date);
  }
}
