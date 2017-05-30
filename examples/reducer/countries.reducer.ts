import { CountryActionType } from '../actions';
import { ActionReducer } from '../../src/redux'
export interface State {
  countriesLoading: boolean;
  countries: any[];
  name: string;
}
export const initialState = <State>{

}
export function reducer(state = initialState, action) {
  switch (action.type) {
    case CountryActionType.ALL_COUNTRIES_LOADING:
      return {
        ...state,
        countriesLoading: true
      };
    case CountryActionType.ALL_COUNTRIES_LOADED:
      return {
        ...state,
        countriesLoading: false,
        countries: action.payload,
      };
    case CountryActionType.NAME_CHANGED:
      return {
        ...state,
        name: action.payload
      };
    default:
      return state;
  }
}
