import { BehaviorSubject, Observable } from 'rxjs';
import { Action } from './redux';
import { isObservable } from './utils';

export class Dispatcher extends BehaviorSubject<Action> {
  static INIT = 'store/init';

  constructor() {
    super({ type: Dispatcher.INIT });
  }

  dispatch(action: Action): void {
    console.log('dispatch...', action.type, action.payload);
    this.next(action);
    if (isObservable(action.payload)) {
      this.next(action.payload);
    }
  }
  ofType(type: string): Observable<any> {
    return this.filter((action) => action.type === type);
  }
  complete() {
    // noop
  }
}
