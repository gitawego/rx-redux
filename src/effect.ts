import { action$ } from './redux';

const EFFECT_KEY = Symbol('effect');

/**
 * effect requires ``reflect-metadata``
 */
export function Effect() {
  return function (target: any, propertyName: string) {
    const effectProperties = (Reflect as any).getOwnMetadata(EFFECT_KEY, target) || [];
    effectProperties.push(propertyName);
    (Reflect as any).defineMetadata(EFFECT_KEY, effectProperties, target);
  }
}

export function addEffect(instance) {
  const target = Object.getPrototypeOf(instance);
  const effectProperties = (Reflect as any).getOwnMetadata(EFFECT_KEY, target) || [];
  effectProperties.forEach(name => {
    instance[name].subscribe(action$.dispatch.bind(action$));
  });
}
export function runEffects(instances: any[]) {
  instances.forEach(addEffect);
}
