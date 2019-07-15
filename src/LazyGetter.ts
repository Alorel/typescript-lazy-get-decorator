import {defaultFilter} from './common';
import {decorateLegacy} from './legacy';
import {decorateNew} from './new';
import {NewDescriptor} from './NewDescriptor';
import {ResettableDescriptor} from './ResettableDescriptor';
import {ResultSelectorFn} from './ResultSelectorFn';

type DecoratorReturn = PropertyDescriptor | NewDescriptor;

/**
 * Evaluate the getter function and cache the result
 * @param [setProto=false] Set the value on the class prototype as well. Only applies to non-static getters.
 * @param [makeNonConfigurable=false] Set to true to make the resolved property non-configurable
 * @param [resultSelector] A filter function that must return true for the value to cached
 * @return A decorator function
 */
function LazyGetter(
  setProto = false,
  makeNonConfigurable = false,
  resultSelector: ResultSelectorFn = defaultFilter
): MethodDecorator & ResettableDescriptor {
  let desc: PropertyDescriptor;
  let prop: PropertyKey;
  let args: IArguments = <any>null;
  let isLegacy: boolean;

  function decorator(targetOrDesc: any, key: PropertyKey, descriptor: PropertyDescriptor): DecoratorReturn {
    args = arguments;
    if (key === undefined) {
      if (typeof desc === 'undefined') {
        isLegacy = false;
        prop = (<NewDescriptor>targetOrDesc).key;
        desc = Object.assign(
          {},
          (<NewDescriptor>targetOrDesc).descriptor || /* istanbul ignore next */ targetOrDesc
        );
      }

      return decorateNew(targetOrDesc, setProto, makeNonConfigurable, resultSelector);
    } else {
      if (typeof desc === 'undefined') {
        isLegacy = true;
        prop = key;
        desc = Object.assign(
          {},
          descriptor || /* istanbul ignore next */ Object.getOwnPropertyDescriptor(targetOrDesc, key)
        );
      }

      return decorateLegacy(targetOrDesc, key, descriptor, setProto, makeNonConfigurable, resultSelector);
    }
  }

  decorator.reset = setProto ? thrower : (on: any): void => {
    if (!on) {
      throw new Error('Unable to restore descriptor on an undefined target');
    }
    if (!desc) {
      throw new Error('Unable to restore descriptor. Did you remember to apply your decorator to a method?');
    }
    // Restore descriptor to its original state
    Object.defineProperty(on, prop, desc);
    const ret: any = decorator.apply(null, <any>args);
    Object.defineProperty(on, prop, isLegacy ? ret : (ret.descriptor || ret));
  };

  return decorator;
}

function thrower(): never {
  throw new Error('This decoration modifies the class prototype and cannot be reset.');
}

export {ResultSelectorFn, LazyGetter};
