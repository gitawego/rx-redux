import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Action } from './redux';
import { isObservable } from './utils';

export class Dispatcher extends BehaviorSubject<Action> {
  static INIT = 'store/init';

  constructor() {
    super({ type: Dispatcher.INIT });
  }

  dispatch(action: Action): void {
    this.next(action);
    if (isObservable(action.payload)) {
      this.next(action.payload);
    }
  }

  complete() {
    // noop
  }
}
