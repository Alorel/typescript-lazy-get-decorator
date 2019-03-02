type Options = Pick<PropertyDescriptor, 'configurable' | 'enumerable' | 'writable'>;

interface NewDescriptor<T = any> extends Options {
  descriptor?: Options;

  readonly key: PropertyKey;

  readonly kind: string;

  placement: string;

  initializer(): T;
}

function decorateLegacy(target: any,
                        key: PropertyKey,
                        descriptor: PropertyDescriptor,
                        setProto?: boolean,
                        makeNonConfigurable?: boolean): PropertyDescriptor {
  if (!descriptor) {
    descriptor = <PropertyDescriptor>Object.getOwnPropertyDescriptor(target, key);
    if (!descriptor) {
      const e = new Error('@LazyGetter is unable to determine the property descriptor');
      (<any>e).$target = target;
      (<any>e).$key = key;
      throw e;
    }
  }

  const originalMethod = <Function>descriptor.get;

  if (!originalMethod) {
    throw new Error('@LazyGetter can only decorate getters!');
  } else if (!descriptor.configurable) {
    throw new Error('@LazyGetter target must be configurable');
  }

  function get(this: any): any {
    const value = originalMethod.apply(this, <any>arguments);

    const newDescriptor: PropertyDescriptor = {
      configurable: !makeNonConfigurable,
      enumerable: descriptor.enumerable,
      value
    };

    const isStatic = Object.getPrototypeOf(target) === Function.prototype;

    if (isStatic || setProto) {
      Object.defineProperty(target, key, newDescriptor);
    }

    if (!isStatic) {
      Object.defineProperty(this, key, newDescriptor);
    }

    return value;
  }

  return Object.assign({}, descriptor, {get});
}

/**
 * Evaluate the getter function and cache the result
 * @param {boolean} [setProto=false] Set the value on the class prototype as well. Only applies to non-static getters.
 * @param {boolean} [makeNonConfigurable=false] Set to true to make the resolved property non-configurable
 * @return A Typescript decorator function
 */
export function LazyGetter(setProto?: boolean, makeNonConfigurable?: boolean): MethodDecorator {
  return (target: any, key: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor | NewDescriptor => {
    return decorateLegacy(target, key, descriptor, setProto, makeNonConfigurable);
  };
}
