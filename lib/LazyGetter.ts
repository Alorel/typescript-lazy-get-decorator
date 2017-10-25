/**
 * Evaluate the getter function and cache the result
 * @param {boolean} [setProto=false] x Set the value on the class prototype as well. Only applies to non-static getters.
 * @return {(target: any, key: string, descriptor: PropertyDescriptor) => void} A Typescript decorator function
 */
export function LazyGetter(setProto: boolean = false) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    const originalMethod = descriptor.get;

    if (!originalMethod) {
      throw new Error('@LazyGetter can only decorate getters!');
    } else if (!descriptor.configurable) {
      throw new Error('@LazyGetter target must be configurable');
    } else {
      descriptor.get = function () {
        const value = originalMethod.apply(this, arguments);

        const newDescriptor: PropertyDescriptor = {
          value,
          enumerable: descriptor.enumerable,
          configurable: true
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
    }
  };
}
