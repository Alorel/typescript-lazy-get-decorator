Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Evaluate the getter function and cache the result
 * @param {boolean} [setProto=false] Set the value on the class prototype as well. Only applies to non-static getters.
 * @param {boolean} [makeNonConfigurable=false] Set to true to make the resolved property non-configurable
 * @return {(target: any, key: string, descriptor: PropertyDescriptor) => void} A Typescript decorator function
 */
function LazyGetter(setProto, makeNonConfigurable) {
    if (setProto === void 0) { setProto = false; }
    if (makeNonConfigurable === void 0) { makeNonConfigurable = false; }
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
                    configurable: !makeNonConfigurable,
                    enumerable: descriptor.enumerable,
                    value: value
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