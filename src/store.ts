import { Observable } from 'rxjs/Observable';
import { Dispatcher } from './dispatcher';
export class Store<T> extends Observable<T> {
  action$: Dispatcher;
  constructor(
    $state: Observable<any>,
    action$: Dispatcher
  ) {
    super();
    this.source = $state;
    this.action$ = action$;
  }
  getState() {
    return { ...this.source['stateValue'] };
  }
  dispatch(type, payload?) {
    this.action$.dispatch({
      type,
      payload
    });
  }
  select<S>(...keys: string[]): Observable<S> {
    return this.pluck(...keys)
      .distinctUntilChanged();
  }
  complete() {
    // noop
  }
}
