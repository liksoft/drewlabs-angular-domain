import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'positiveNumber'})

export class PositiveNumber implements PipeTransform {
    transform(value: number): number {
      return Math.abs(value);
    }
}
