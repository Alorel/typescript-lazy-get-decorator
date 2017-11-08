/**
 * Evaluate the getter function and cache the result
 * @param {boolean} [setProto=false] Set the value on the class prototype as well. Only applies to non-static getters.
 * @param {boolean} [makeNonConfigurable=false] Set to true to make the resolved property non-configurable
 * @return {(target: any, key: string, descriptor: PropertyDescriptor) => void} A Typescript decorator function
 */
export declare function LazyGetter(setProto?: boolean, makeNonConfigurable?: boolean): (target: any, key: string, descriptor: PropertyDescriptor) => void;
