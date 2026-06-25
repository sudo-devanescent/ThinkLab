import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'feedbackLabel',
  standalone: true
})
export class FeedbackLabelPipe implements PipeTransform {
  transform(value: number, dimension: 'coherence' | 'risk' | 'consistency'): string {
    // Both backend and requirements use thresholds: >= 0.7 is Alto, >= 0.4 is Medio, < 0.4 is Bajo
    if (value >= 0.7) {
      return 'Alto';
    } else if (value >= 0.4) {
      return 'Medio';
    } else {
      return 'Bajo';
    }
  }
}
