import { Observable } from 'rxjs';
import { actionCreator } from '../src/redux';
import { request } from './ajax';
import { action$ } from '../src/redux';
import { label } from '../src/utils';
const countryUrl = 'https://restcountries-v1.p.mashape.com/all';

export const CountryActionType = {
  LOAD_ALL_COUNTRIES: label('LOAD all countries'),
  ALL_COUNTRIES_LOADING: label('loading all countries'),
  ALL_COUNTRIES_LOADED: label('all countries are loaded'),
  NAME_CHANGED: label('change name')
}



export const loadCountries = actionCreator(() => {
  return {
    type: CountryActionType.ALL_COUNTRIES_LOADING,
    payload: request({
      url: countryUrl,
      headers: {
        'X-Mashape-Key': 'l5eMXwY6d3mshmvnljsx6GVH9YWxp1IsKhsjsnSAZ5yXpYiGRl',
        'Content-Type': 'application/json'
      }
    })
      .map((xhr) => ({
        type: CountryActionType.ALL_COUNTRIES_LOADED,
        payload: xhr.response
      }))
  };
});

export const changeName = actionCreator((payload) => ({
  type: CountryActionType.NAME_CHANGED,
  payload
}));
