interface NewDescriptor extends PropertyDescriptor {
  descriptor?: PropertyDescriptor;

  readonly key: PropertyKey;

  readonly kind: string;

  placement: string;
}

function validateAndExtractMethodFromDescriptor(desc: PropertyDescriptor): Function {
  const originalMethod = <Function>desc.get;

  if (!originalMethod) {
    throw new Error('@LazyGetter can only decorate getters!');
  } else if (!desc.configurable) {
    throw new Error('@LazyGetter target must be configurable');
  }

  return originalMethod;
}

function getterCommon(target: any, //tslint:disable-line:parameters-max-number
                      key: PropertyKey,
                      isStatic: boolean,
                      enumerable: boolean,
                      originalMethod: Function,
                      thisArg: any,
                      args: IArguments,
                      setProto?: boolean,
                      makeNonConfigurable?: boolean): any {
  const value = originalMethod.apply(thisArg, <any>args);

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

  return value;
}

function decorateLegacy(target: any,
                        key: PropertyKey,
                        descriptor: PropertyDescriptor,
                        setProto?: boolean,
                        makeNonConfigurable?: boolean): PropertyDescriptor {
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
        makeNonConfigurable
      );
    }
  });
}

function decorateNew(inp: NewDescriptor, setProto?: boolean, makeNonConfigurable?: boolean): NewDescriptor {
  const out: NewDescriptor = Object.assign({}, inp);
  if (out.descriptor) {
    out.descriptor = Object.assign({}, out.descriptor);
  }
  const actualDesc: PropertyDescriptor = <any>(out.descriptor || out); //incorrect babel implementation support

  const originalMethod = validateAndExtractMethodFromDescriptor(actualDesc);
  const isStatic = inp.placement === 'static';

  actualDesc.get = function (this: any): any {
    return getterCommon(
      isStatic ? this : Object.getPrototypeOf(this),
      out.key,
      isStatic,
      !!actualDesc.enumerable,
      originalMethod,
      this,
      arguments,
      setProto,
      makeNonConfigurable
    );
  };

  return out;
}

/**
 * Evaluate the getter function and cache the result
 * @param {boolean} [setProto=false] Set the value on the class prototype as well. Only applies to non-static getters.
 * @param {boolean} [makeNonConfigurable=false] Set to true to make the resolved property non-configurable
 * @return A Typescript decorator function
 */
export function LazyGetter(setProto?: boolean, makeNonConfigurable?: boolean): MethodDecorator {
  return (targetOrDesc: any, key: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor | NewDescriptor => {
    return key === undefined ?
      decorateNew(targetOrDesc, setProto, makeNonConfigurable) :
      decorateLegacy(targetOrDesc, key, descriptor, setProto, makeNonConfigurable);
  };
}
