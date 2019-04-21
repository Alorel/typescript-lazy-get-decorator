import {getterCommon, validateAndExtractMethodFromDescriptor} from './common';
import {ResultSelectorFn} from './ResultSelectorFn';

/** @internal */
export function decorateLegacy(target: any,
                               key: PropertyKey,
                               descriptor: PropertyDescriptor,
                               setProto: boolean | undefined,
                               makeNonConfigurable: boolean | undefined,
                               resultSelector: ResultSelectorFn): PropertyDescriptor {
  /* istanbul ignore if */
  if (!descriptor) {
    descriptor = <any>Object.getOwnPropertyDescriptor(target, key);
    if (!descriptor) {
      const e = new Error('@LazyGetter is unable to determine the property descriptor');
      (<any>e).$target = target;
      (<any>e).$key = key;
      throw e;
    }
  }

  const originalMethod = validateAndExtractMethodFromDescriptor(descriptor);

  return Object.assign({}, descriptor, {
    get: function (this: any): any {
      return getterCommon(
        target,
        key,
        Object.getPrototypeOf(target) === Function.prototype,
        !!descriptor.enumerable,
        originalMethod,
        this,
        arguments,
        setProto,
        makeNonConfigurable,
        resultSelector
      );
    }
  });
}
