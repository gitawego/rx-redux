import { Observable, Subject } from 'rxjs';
import { isObservable } from './utils';

export interface Action {
  type: string;
  payload?: any;
}
export interface ReduxStore {
  dispatch(type: string, payload?: any): void;
  getState(): any;
  subscribe(listener: (event) => void): () => void;
  select<T>(...keys: string[]): Observable<T>;
}
export interface State {
  [id: string]: any;
}

export type Reducer = (state: any, action: Action) => any;

const action$ = new Subject();
let store = null;
export const initStore = (initState: State, reducer: Reducer) => {
  return action$
    .flatMap((action: any) => isObservable(action) ? action : Observable.of(action))
    .startWith(initState)
    .scan(reducer)
    // these two lines make our observable hot and have it emit the last state
    // upon subscription
    .publishReplay(1)
    .refCount();
};

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

export const createStore = (initState: State, reducer: Reducer): ReduxStore => {
  if (store) {
    throw new Error('store is already created');
  }
  const stateHolder = {
    state: initState
  };
  store = initStore(initState, reducer);
  store.subscribe((state) => {
    // stateStore.next(state);
    stateHolder.state = state;
  });
  return {
    dispatch,
    getState(): State {
      return { ...stateHolder.state };
    },
    subscribe(listener) {
      const sub = store.map(() => stateHolder.state)
        .subscribe(listener);
      return () => sub.unsubscribe();
    },
    select(...keys: string[]) {
      return store.map(() => stateHolder.state)
        .pluck(...keys)
        .distinctUntilChanged();

    },
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
export const combineReducers = (reducers: Reducer[]) =>
  (state, action): State => {
    reducers.forEach((reducer) => {
      state = reducer(state, action);
    });
    return state;
  };
