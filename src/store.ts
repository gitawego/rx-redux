import { Observable } from 'rxjs/Observable';
export class Store<T> extends Observable<T> {
  constructor(
    $state: Observable<any>
  ) {
    super();
    this.source = $state;
  }
  getState() {
    return { ...this.source['stateValue'] };
  }
  select<S>(...keys: string[]): Observable<S> {
    return this.pluck(...keys)
      .distinctUntilChanged();
  }
  complete() {
    // noop
  }
}
