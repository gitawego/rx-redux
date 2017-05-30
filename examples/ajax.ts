import { ajax } from 'rxjs/observable/dom/ajax';
import { AjaxResponse } from 'rxjs/observable/dom/AjaxObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as xhr2 from 'xhr2';

const XHR = typeof XMLHttpRequest !== 'undefined'
  ? XMLHttpRequest
  : xhr2;

export const request = function request(options): Observable<AjaxResponse> {
  return ajax({ createXHR: () => new XHR(), ...options });
};
