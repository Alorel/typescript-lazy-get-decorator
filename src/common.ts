import {ResultSelectorFn} from './LazyGetter';

/** @internal */
export function defaultFilter(): boolean {
  return true;
}

/** @internal */
export function validateAndExtractMethodFromDescriptor(desc: PropertyDescriptor): Function {
  const originalMethod = <Function>desc.get;

  if (!originalMethod) {
    throw new Error('@LazyGetter can only decorate getters!');
  } else if (!desc.configurable) {
    throw new Error('@LazyGetter target must be configurable');
  }

  return originalMethod;
}

/** @internal */
export function getterCommon(target: any, //tslint:disable-line:parameters-max-number
                             key: PropertyKey,
                             isStatic: boolean,
                             enumerable: boolean,
                             originalMethod: Function,
                             thisArg: any,
                             args: IArguments,
                             setProto: boolean | undefined,
                             makeNonConfigurable: boolean | undefined,
                             resultSelector: ResultSelectorFn): any {
  const value = originalMethod.apply(thisArg, <any>args);

  if (resultSelector(value)) {
    const newDescriptor: PropertyDescriptor = {
      configurable: !makeNonConfigurable,
      enumerable,
      value
    };

    if (isStatic || setProto) {
      Object.defineProperty(target, key, newDescriptor);
    }

    if (!isStatic) {
      Object.defineProperty(thisArg, key, newDescriptor);
    }
  }

  return value;
}
