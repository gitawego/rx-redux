import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
import { isObservable } from './utils';
import { Store } from './store';
import { State } from './state';
import { ActionReducer } from './reducer';
import { Action } from './dispatcher';


const action$ = new Subject();

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


/**
 * create action
 * @param func
 * @returns (...any[]):void
 */
export const actionCreator = (func) => (...args) => {
  const action: Action = func(...args);
  dispatch(action.type, action.payload);
};

export function createStore<S>(initState: S, reducer: ActionReducer<S>) {
  const state = new State<S>(initState, action$, reducer);
  return new Store<S>(state);
}

