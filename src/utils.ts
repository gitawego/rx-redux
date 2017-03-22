import { Observable } from 'rxjs/Observable';

let labelCache: { [label: string]: boolean } = {};
export const isObservable = obs => obs instanceof Observable;
export const log = console.log.bind(console);
export function label<T extends string>(label: T): T {
  if (labelCache[<string> label]) {
    throw new Error(`Action type "${label}" is not unique"`);
  }
  labelCache[<string> label] = true;
  return <T> label;
};
