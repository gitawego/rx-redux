
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
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
  (state: any, action: Action): any;
}


const action$ = new Subject();
let store = null;
export const initStore = (initState: State, reducer: Reducer) => {
  return action$
    .flatMap((action: any) => isObservable(action) ? action : Observable.from([action]))
    .startWith(initState)
    .map(state => {
      console.log('start with', state);
      return state;
    })
    .scan(reducer)
    .map((state) => {
      console.log('state scan', state);
      Object.assign(initState, state);
      return state;
    });
};


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
  const stateStore = new Subject();
  store.subscribe((state) => {
    stateStore.next(state);
  });
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
      return stateStore.startWith(initState).pluck(key).distinctUntilChanged();
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
