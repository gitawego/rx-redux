import { createStore } from './redux';
import { Store } from './store';
import { State, reducer } from '../examples/reducer';
import { changeName, loadCountries, CountryActionType } from '../examples/actions';

describe('store', () => {
  let store: Store<State>;
  it('should create store', () => {
    store = createStore(<State>{}, reducer);
    expect(store instanceof Store).toBe(true);
  });
  it('should get name from state', (done) => {
    const sub = store.select('countries').subscribe((resp) => {
      //console.log('resp', resp);
      if (!resp || !resp['name']) {
        return;
      }
      expect(resp['name']).toBe('test');
      sub.unsubscribe();
      done();
    });
    changeName('test');
  });
  it('should get countries', (done) => {
    const sub = store.select('countries', 'countries').subscribe((resp) => {
      if (!resp) {
        return;
      }
      expect(Array.isArray(resp)).toBe(true);
      sub.unsubscribe();
      done();
    });
    loadCountries();
  });
  it('should get countreis with ofType', (done) => {
    const sub = store.select('countries', 'countries').skip(1).subscribe((resp) => {
      if (!resp) {
        return;
      }
      expect(Array.isArray(resp)).toBe(true);
      sub.unsubscribe();
      done();
    });
    store.dispatch(CountryActionType.LOAD_ALL_COUNTRIES);
  })
});
