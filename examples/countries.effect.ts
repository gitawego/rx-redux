import { Effect } from '../src/effect';
import { action$ } from '../src/redux';
import { request } from './ajax';
import { Observable } from 'rxjs';
import * as countriesActions from './actions';

const countryUrl = 'https://restcountries-v1.p.mashape.com/all';

export class CountryEffects {
  @Effect() countries$: Observable<any> = action$
    .ofType(countriesActions.CountryActionType.ALL_COUNTRIES_LOADING)
    .switchMap((action) => request({
      url: countryUrl,
      headers: {
        'X-Mashape-Key': 'l5eMXwY6d3mshmvnljsx6GVH9YWxp1IsKhsjsnSAZ5yXpYiGRl',
        'Content-Type': 'application/json'
      }
    })
      .map((xhr) => new countriesActions.LoadCountriesComplete(xhr.response))
      .catch((err) => Observable.of(new countriesActions.LoadCountriesFailed(err)))
    );
}
