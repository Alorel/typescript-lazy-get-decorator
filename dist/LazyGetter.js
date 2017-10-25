"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
/**
 * Evaluate the getter function and cache the result
 * @param {boolean} [setProto=false] Set the value on the class prototype as well. Only applies to non-static getters.
 * @return {(target: any, key: string, descriptor: PropertyDescriptor) => void} A Typescript decorator function
 */
function LazyGetter(setProto) {
  if (setProto === void 0) {
    setProto = false;
  }
  return function (target, key, descriptor) {
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    var originalMethod = descriptor.get;
    if (!originalMethod) {
      throw new Error('@LazyGetter can only decorate getters!');
    }
    else if (!descriptor.configurable) {
      throw new Error('@LazyGetter target must be configurable');
    }
    else {
      descriptor.get = function () {
        var value = originalMethod.apply(this, arguments);
        var newDescriptor = {
          value: value,
          enumerable: descriptor.enumerable,
          configurable: true
        };
        var isStatic = Object.getPrototypeOf(target) === Function.prototype;
        if (isStatic || setProto) {
          Object.defineProperty(target, key, newDescriptor);
        }
        if (!isStatic) {
          Object.defineProperty(this, key, newDescriptor);
        }
        return value;
      };
    }
  };
}
exports.LazyGetter = LazyGetter;
//# sourceMappingURL=LazyGetter.js.map