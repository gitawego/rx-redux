import { Observable, Subject } from 'rxjs';
import { ActionReducer, Action } from './redux';

let labelCache: { [label: string]: boolean } = {};
export const isObservable = obs => obs instanceof Observable;
export const isSubject = sub => sub instanceof Subject;
export const log = console.log.bind(console);
export function label<T extends string>(label: T): T {
  if (labelCache[<string>label]) {
    throw new Error(`Action type "${label}" is not unique"`);
  }
  labelCache[<string>label] = true;
  return <T>label;
}

export function combineReducers(reducers: any): ActionReducer<any> {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};

  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  const finalReducerKeys = Object.keys(finalReducers);
  const reducerKeyLength = finalReducerKeys.length;
  return function combination(state = {}, action) {
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < reducerKeyLength; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);

      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

export interface ActionHanlders<T, A> {
  [actionType: string]: (state: T, action: A) => any;
}
export function handleActions<T, A extends Action>(handlers: ActionHanlders<T, A>,
  defaultState = <T>{}): ActionReducer<T> {
  return (state: T = defaultState, action: A) => {
    if (action.type in handlers) {
      state = handlers[action.type](state, action);
    }
    return state;
  };
}
