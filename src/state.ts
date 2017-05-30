import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { isObservable } from './utils';

export class State<T> extends BehaviorSubject<T> {
  stateValue: T;
  constructor(initState: T, action$, reducer) {
    super(initState);
    this.stateValue = initState;
    const state$ = action$
      .flatMap((action: any) => isObservable(action) ? action : Observable.of(action))
      .scan(reducer, initState)
      // these two lines make our observable hot and have it emit the last state
      // upon subscription
      .publishReplay(1)
      .refCount();

    state$.subscribe(value => {
      this.stateValue = value;
      console.log('state.....', value);
      this.next(value);
    });
  }
}
