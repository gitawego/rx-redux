import { BehaviorSubject, Observable } from 'rxjs';
import { Action } from './redux';
import { isObservable } from './utils';

export class Dispatcher extends BehaviorSubject<Action> {
  static INIT = 'store/init';

  constructor() {
    super({ type: Dispatcher.INIT });
  }

  dispatch(action: Action): void {
    this.next(action);
  }
  ofType(type: string): Observable<any> {
    return this.filter((action) => action.type === type);
  }
  complete() {
    // noop
  }
}
