import { createStore } from './redux';
import { Store } from './store';
import { State, reducer } from '../examples/reducer';
import { changeName } from '../examples/actions';

describe('store', () => {
  let store: Store<State>;
  it('should create store', () => {
    store = createStore(<State>{}, reducer);
    expect(store instanceof Store).toBe(true);
  });
  it('should get name from state', (done) => {
    store.select('countries').subscribe((resp) => {
      console.log('resp', resp);
      if (!resp) {
        return;
      }
      expect(resp['name']).toBe('test');
      done();
    });
    changeName('test');
  });
});
