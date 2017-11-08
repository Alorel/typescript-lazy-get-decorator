/**
 * Evaluate the getter function and cache the result
 * @param {boolean} [setProto=false] Set the value on the class prototype as well. Only applies to non-static getters.
 * @param {boolean} [makeNonConfigurable=false] Set to true to make the resolved property non-configurable
 * @return {(target: any, key: string, descriptor: PropertyDescriptor) => void} A Typescript decorator function
 */
export function LazyGetter(setProto = false, makeNonConfigurable = false) {
    return (target, key, descriptor) => {
        if (!descriptor) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        const originalMethod = descriptor.get;
        if (!originalMethod) {
            throw new Error('@LazyGetter can only decorate getters!');
        }
        else if (!descriptor.configurable) {
            throw new Error('@LazyGetter target must be configurable');
        }
        else {
            descriptor.get = function () {
                const value = originalMethod.apply(this, arguments);
                const newDescriptor = {
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
            };
        }
    };
}
//# sourceMappingURL=LazyGetter.js.map