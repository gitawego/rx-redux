import 'reflect-metadata';
import { createStore } from './redux';
import { Store } from './store';
import { State, reducer } from '../examples/reducer';
import { changeName, CountryActionType, LoadCountries } from '../examples/actions';
import { CountryEffects } from '../examples/countries.effect';
import { runEffects } from './effect';


describe('store', () => {
  let store: Store<State>;
  it('should create store', () => {
    store = createStore(<State>{}, reducer);
    runEffects([
      new CountryEffects(),
    ]);
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
    store.dispatch(new LoadCountries());
  });
});
