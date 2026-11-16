import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaudeService } from '../../saude/services/saude.service';

@Component({
  selector: 'app-metric-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-cards.component.html',
})
export class MetricCardsComponent {
  saudeService = inject(SaudeService);
}
