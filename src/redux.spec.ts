import { createStore } from './redux';
import { Store } from './store';
import { State, reducer } from '../examples/reducer';
import { changeName, loadCountries } from '../examples/actions';

describe('store', () => {
  let store: Store<State>;
  it('should create store', () => {
    store = createStore(<State>{}, reducer);
    expect(store instanceof Store).toBe(true);
  });
  it('should get name from state', (done) => {
    store.select('countries').subscribe((resp) => {
      console.log('resp', resp);
      if (!resp || !resp['name']) {
        return;
      }
      expect(resp['name']).toBe('test');
      done();
    });
    changeName('test');
  });
  it('should get countries', (done) => {
    store.select('countries', 'countries').subscribe((resp) => {
      if (!resp) {
        return;
      }
      expect(Array.isArray(resp)).toBe(true);
      done();
    });
    loadCountries();
  });
});
