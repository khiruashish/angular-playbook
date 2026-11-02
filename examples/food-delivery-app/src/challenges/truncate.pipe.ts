import { Pipe, PipeTransform } from '@angular/core';

/** Challenge 1: {{ text | truncate:10 }} → cuts at a word boundary and appends an ellipsis. */
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, max = 20, suffix = '…'): string {
    if (!value || value.length <= max) return value ?? '';
    const cut = value.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() + suffix;
  }
}
