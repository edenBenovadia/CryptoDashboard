import { Pipe, PipeTransform } from '@angular/core';
import { Token } from '..';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(items: Token[]): Token[] {
    return items.sort((a, b) => comparator(a, b));
  }

}

function comparator(a: Token, b: Token) {
  const left = a.totalValueInDollars || 0;
  const right = b.totalValueInDollars || 0;
  if (!left && !!right) {
    return 1;
  } else if(!!left && !right) {
    return -1;
  } else {
    return right - left;
  }
}
