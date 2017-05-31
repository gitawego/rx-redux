import { Effect } from '../src/effect';
import { action$ } from '../src/redux';
import { CountryActionType } from './actions';
import { request } from './ajax';
import { Observable } from 'rxjs';

const countryUrl = 'https://restcountries-v1.p.mashape.com/all';

export class CountryEffects {
  @Effect() countries$: Observable<any> = action$.ofType(CountryActionType.LOAD_ALL_COUNTRIES)
    .map((action) => {
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
    })
}
