import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
import { isObservable } from './utils';
import { Store } from './store';
import { State } from './state';
import { Dispatcher } from './dispatcher';

export interface Action {
  type: string;
  payload?: any;
}

export interface ActionReducer<T> {
  (state: T, action: Action): T;
}

const action$ = new Dispatcher();

/**
 * create action
 * @param func
 * @returns (...any[]):void
 */
export const actionCreator = (func) => (...args) => {
  action$.dispatch(func(...args));
};

export function createStore<S>(initState: S, reducer: ActionReducer<S>) {
  const state = new State<S>(initState, action$, reducer);
  return new Store<S>(state);
}

