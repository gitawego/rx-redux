import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
import reducer from './reducer';
import { isObservable } from './utils';

export interface Action {
  type: string;
  payload?: any;
}
export interface ReduxStore {
  dispatch(type: string, payload?: any): void;
  getState(): any;
  subscribe(listener: (event) => void): () => void;
  select(key: string): Observable<any>;
}
export interface State {
  [id: string]: any;
}
export interface Reducer {
  (state: State, action: Action): State;
}

const action$ = new Subject();
let store = null;
export const initStore = (initState: State, reducer: Reducer) =>
  action$
    .flatMap((action: any) => isObservable(action) ? action : Observable.from([action]))
    .startWith(initState)
    .scan(reducer);

export const dispatch = (type: string, payload?: any) => {
  const action: Action = {
    type,
    payload
  };
  action$.next(action);
  if (isObservable(action.payload)) {
    action$.next(action.payload);
  }
}


export const createStore = (initState: State, reducer: Reducer): ReduxStore => {
  if (store) {
    throw new Error('store is already created');
  }
  store = initStore(initState, reducer);
  return {
    dispatch,
    getState(): State {
      return { ...initState };
    },
    subscribe(listener) {
      const sub = store.subscribe(listener);
      return () => sub.unsubscribe();
    },
    select(key: string) {
      return store.map(state => state[key]).distinctUntilChanged();
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
export const combineReducers = (reducers: Reducer[]) =>
  (state, action): State => {
    reducers.forEach((reducer) => {
      state = reducer(state, action);
    });
    return state;
  }
