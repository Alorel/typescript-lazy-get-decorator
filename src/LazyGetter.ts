import {defaultFilter} from './common';
import {decorateLegacy} from './legacy';
import {decorateNew} from './new';
import {NewDescriptor} from './NewDescriptor';
import {RestorableDescriptor} from './RestorableDescriptor';
import {ResultSelectorFn} from './ResultSelectorFn';

type StdLazyGetterReturn = PropertyDescriptor | NewDescriptor;
type LazyGetterReturn = StdLazyGetterReturn & RestorableDescriptor;

/**
 * Evaluate the getter function and cache the result
 * @param {boolean} [setProto=false] Set the value on the class prototype as well. Only applies to non-static getters.
 * @param {boolean} [makeNonConfigurable=false] Set to true to make the resolved property non-configurable
 * @param {ResultSelectorFn} [resultSelector] A filter function that must return true for the value to cached
 * @return A Typescript decorator function
 */
function LazyGetter(setProto?: boolean,
                    makeNonConfigurable?: boolean,
                    resultSelector: ResultSelectorFn = defaultFilter): MethodDecorator {
  return (targetOrDesc: any, key: PropertyKey, descriptor: PropertyDescriptor): LazyGetterReturn => {
    return key === undefined ?
      <any>decorateNew(targetOrDesc, setProto, makeNonConfigurable, resultSelector) :
      <any>decorateLegacy(targetOrDesc, key, descriptor, setProto, makeNonConfigurable, resultSelector);
  };
}

export {ResultSelectorFn, LazyGetter};
