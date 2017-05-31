import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { queue } from 'rxjs/scheduler/queue';
import { isObservable } from './utils';

export class State<T> extends BehaviorSubject<T> {
  stateValue: T;
  constructor(initState: T, action$: Subject<any>, reducer) {
    super(initState);
    this.stateValue = initState;
    const actionInQueue$ = action$.observeOn(queue);
    const state$ = actionInQueue$
      .flatMap((action: any) => isObservable(action) ? action : Observable.of(action))
      .scan(reducer, initState);

    state$.subscribe((value: T) => {
      this.stateValue = value;
      //console.log('state.....', value);
      this.next(value);
    });
  }
}
