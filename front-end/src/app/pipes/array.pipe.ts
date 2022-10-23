import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ArrayPipe implements PipeTransform {

  transform(value: Array<any>, ...args: unknown[]): unknown {
    return value.reverse();
  }

}
