import { action$ } from './redux';

export function Effect() {
  return function (target: any, propertyName: string) {
    target[propertyName].subscribe(action$.dispatch.bind(action$));
  }
}
