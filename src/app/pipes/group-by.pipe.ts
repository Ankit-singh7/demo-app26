import { Pipe, PipeTransform } from '@angular/core'
import moment from 'moment';

@Pipe({ name: 'groupBy' })
export class GroupByPipe implements PipeTransform {
  transform(collection: Array<any>, property: string): Array<any> {
    if (!collection) {
      return null
    }
    const groupedCollection = collection.reduce((previous, current) => {
      const currentMonth = new Date(current[property]).getMonth();
      current.month = moment().month(currentMonth).format('MMMM');
      current.year = new Date(current[property]).getFullYear();

      if(!previous[current.month + ' ' + current.year]) {
        previous[current.month + ' ' +current.year] = [current];
      } else {
        previous[current.month + ' ' +current.year].push(current);
      }
      return previous
    }, {})
    return Object.keys(groupedCollection).map(key => ({ key, entries: groupedCollection[key].flatMap(x => x.entries) }))
  }
}