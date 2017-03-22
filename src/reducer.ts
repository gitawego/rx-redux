import {CountryActionType} from './actions';
export default function reducer(state, action) {
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
