import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DiaCalendario {
  dia?: number;
  status: 'empty' | 'green' | 'yellow' | 'red' | 'future';
}

@Component({
  selector: 'app-performance-calendar-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './performance-calendar-widget.component.html',
})
export class PerformanceCalendarWidgetComponent {
  public dias = signal<DiaCalendario[]>([
    { status: 'empty' },
    { status: 'empty' },
    { dia: 1, status: 'green' },
    { dia: 2, status: 'green' },
    { dia: 3, status: 'green' },
    { dia: 4, status: 'yellow' },
    { dia: 5, status: 'red' },
    { dia: 6, status: 'green' },
    { dia: 7, status: 'green' },
    { dia: 8, status: 'green' },
    { dia: 9, status: 'yellow' },
    { dia: 10, status: 'green' },
    { dia: 11, status: 'green' },
    { dia: 12, status: 'red' },
    { dia: 13, status: 'green' },
    { dia: 14, status: 'green' },
    { dia: 15, status: 'future' },
    { dia: 16, status: 'future' },
    { dia: 17, status: 'future' },
    { dia: 18, status: 'future' },
    { dia: 19, status: 'future' },
    { dia: 20, status: 'future' },
    { dia: 21, status: 'future' },
    { dia: 22, status: 'future' },
    { dia: 23, status: 'future' },
    { dia: 24, status: 'future' },
    { dia: 25, status: 'future' },
    { dia: 26, status: 'future' },
    { dia: 27, status: 'future' },
    { dia: 28, status: 'future' },
    { dia: 29, status: 'future' },
    { dia: 30, status: 'future' }
  ]);
}
