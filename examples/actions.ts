import { Observable } from 'rxjs';
import { Action, actionCreator } from '../src/redux';
import { request } from './ajax';
import { action$ } from '../src/redux';
import { label } from '../src/utils';
const countryUrl = 'https://restcountries-v1.p.mashape.com/all';

export const CountryActionType = {
  ALL_COUNTRIES_LOADING: label('loading all countries'),
  ALL_COUNTRIES_LOADED: label('all countries are loaded'),
  ALL_COUNTRIES_FAILED: label('failed to load country'),
  NAME_CHANGED: label('change name')
}

export class LoadCountries implements Action {
  readonly type = CountryActionType.ALL_COUNTRIES_LOADING;
  constructor(public payload?: any) { }
}

export class LoadCountriesComplete implements Action {
  readonly type = CountryActionType.ALL_COUNTRIES_LOADED;
  constructor(public payload: any) { }
}

export class LoadCountriesFailed implements Action {
  readonly type = CountryActionType.ALL_COUNTRIES_FAILED;
  constructor(public payload: any) { }
}

export type Actions = LoadCountries | LoadCountriesComplete | LoadCountriesFailed;

export const changeName = actionCreator((payload) => ({
  type: CountryActionType.NAME_CHANGED,
  payload
}));
