import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FalhasService } from '../../falhas/services/falhas.service';

@Component({
  selector: 'app-mistakes-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mistakes-widget.component.html',
})
export class MistakesWidgetComponent {
  falhasService = inject(FalhasService);
}
