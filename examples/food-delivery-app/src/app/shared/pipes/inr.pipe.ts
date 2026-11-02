import { Pipe, PipeTransform } from '@angular/core';

const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

/** Formats integer paise as rupees: 24950 | inr  ->  "₹249.50" */
@Pipe({ name: 'inr' })
export class InrPipe implements PipeTransform {
  transform(paise: number | null | undefined): string {
    if (paise == null) return '';
    return fmt.format(paise / 100);
  }
}
