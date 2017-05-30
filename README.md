# RX Redux

a simple rxjs based redux inspired by [rxjs-as-redux](https://github.com/ryardley/rxjs-as-redux) and [ngrx/store](https://github.com/ngrx/store)


## usage

```ts
import {reducer} from './reducer';
import {reducer2} from './reducer2';
import {CountryActionType,changeName,loadCountries} from './actions';
import {combineReducers, createStore} from './store';

// define initial state
const initialState = {};

//create store
const store = createStore(initialState,combineReducers([reducer,reducer2]));

// observe the whole state
const stateUnsub = store.subscribe((state)=>{
	console.log(state);
});
// observe key 'countries'
store.select('countries').subscribe((countries)=>{
	console.log('countries',countries);
});

// observe key 'name'
store.select('name').subscribe((name)=>{
	console.log('name changed to',name);
});

// take action of loading countries
loadCountries();

// take action of changing name
changeName('my name1');
// use dispatch instead of precreated function
store.dispatch(CountryActionType.NAME_CHANGED,'name1');

// unsubscribe from store
stateUnsub();
```
