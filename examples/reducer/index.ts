import * as countries from './countries.reducer';
import { combineReducers } from '../../src/utils';
import { ActionReducer } from '../../src/redux';

export interface State {
  countries: countries.State;
}

export const reducer: ActionReducer<State> = combineReducers({
  countries: countries.reducer
});

