export default function reducer(state, action) {
  switch (action.type) {
    case 'ALL_COUNTRIES_LOADING':
      return {
        ...state,
        countriesLoading: true
      };
    case 'ALL_COUNTRIES_LOADED':
      return {
        ...state,
        countriesLoading: false,
        countries: action.payload,
      };
    case 'NAME_CHANGED':
      return {
        ...state,
        name: action.payload
      };
    default:
      return state;
  }
}
