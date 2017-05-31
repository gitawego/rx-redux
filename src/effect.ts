import "reflect-metadata";
import { action$ } from './redux';

const EFFECT_KEY = Symbol('effect');
export function Effect() {
  return function (target: any, propertyName: string) {
    const effectProperties = Reflect.getOwnMetadata(EFFECT_KEY, target) || [];
    effectProperties.push(propertyName);
    Reflect.defineMetadata(EFFECT_KEY, effectProperties, target);
  }
}

export function addEffect(instance) {
  const target = Object.getPrototypeOf(instance);
  const effectProperties = Reflect.getOwnMetadata(EFFECT_KEY, target) || [];
  effectProperties.forEach(name => {
    instance[name].subscribe(action$.dispatch.bind(action$));
  });
}
export function runEffects(instances) {
  instances.forEach(addEffect);
}
