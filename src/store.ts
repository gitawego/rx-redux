import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
import { isObservable } from './utils';


//export { State };
export interface Action {
  type: string;
  payload?: any;
}
export type Reducer<S> = (state: S, action: Action) => S;
export interface ReduxStore<S> {
  dispatch(type: string, payload?: any): void;
  getState(): S;
  subscribe(listener: (state: S) => void): () => void;
  select<T>(...keys: string[]): Observable<T>;
}

const action$ = new Subject();
let store = null;

export const dispatch = (type: string, payload?: any) => {
  const action: Action = {
    type,
    payload,
  };
  action$.next(action);
  if (isObservable(action.payload)) {
    action$.next(action.payload);
  }
};

export function initStore<S>(initState: S, reducer: Reducer<S>): Observable<S> {
  return action$
    .flatMap((action: any) => isObservable(action) ? action : Observable.of(action))
    .scan(reducer, initState)
    // these two lines make our observable hot and have it emit the last state
    // upon subscription
    .publishReplay(1)
    .refCount();
};

export function createStore<S>(initState: S, reducer: Reducer<S>): ReduxStore<S> {
  if (store) {
    throw new Error('store is already created');
  }
  const stateHolder = {
    state: initState
  };
  store = initStore<S>(initState, reducer);
  store.subscribe((state: S) => {
      stateHolder.state = state;
    });
  return {
    dispatch,
    getState(): S {
      return stateHolder.state;
    },
    subscribe(listener) {
      const sub = store.map(() => stateHolder.state)
        .subscribe(listener);
      return () => sub.unsubscribe();
    },
    select<T>(...keys: string[]): Observable<T> {
      return store.map(() => stateHolder.state)
        .pluck(...keys)
        .distinctUntilChanged();
    }
  };
};

/**
 * create action
 * @param func
 * @returns (...any[]):void
 */
export const actionCreator = (func) => (...args) => {
  const action: Action = func(...args);
  dispatch(action.type, action.payload);
};

/**
 * this method can combine multiple reducers, then passes to method createStore
 * @param reducers
 */
export function combineReducers<S>(reducers: Array<Reducer<any>>) {
  return (state, action): S => {
    reducers.forEach((reducer) => {
      state = reducer(state, action);
    });
    return state;
  };
};
