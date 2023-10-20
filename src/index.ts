import {privateInstance, privateStatic, publicInstance, publicInstanceGlobal} from './lib';

interface Options<T, R> {

  /**
   * If set to true, the lazy getter triggering on one class instance will end up saving the returned value on all
   * class instances, current and future.
   *
   * Has no effect on static getters.
   */
  global?: boolean;

  /**
   * A function to determine whether we should save the results (returning a truthy value) or continue calling the
   * original getter (returning a falsy value). The default behaviour is to always save the 1st result.
   *
   * Gotcha: compatibility further depends on the Typescript compiler target you've set -
   * see README for further details.
   */
  select?: ResultSelector<T, R>;
}

type Fn<T, R> = (this: T) => R;

/** @see {Options#select} */
type ResultSelector<T, R> = (this: T, output: R, self: T) => any;
type Decorator<T, R> = (origFn: Fn<T, R>, ctx: ClassGetterDecoratorContext<T, R>) => undefined | Fn<T, R>;

/** Save the getter's return value and don't call it again */
function LazyGetter<T, R>(opts?: Options<T, R>): Decorator<T, R> {
  const {global = false, select} = opts ?? {};

  return function decorateLazyGetter(target, {name, static: isStatic, private: isPrivate}) {
    if (isStatic) {
      if (isPrivate) {
        return privateStatic(target, select);
      }
    } else if (global) {
      return isPrivate
        ? privateStatic(target, select)
        : publicInstanceGlobal(name, target, select);
    } else if (isPrivate) {
      return privateInstance(name, target, select);
    }

    return publicInstance(name, target, select);
  };
}

export {LazyGetter};
export type {ResultSelector, Options as LazyGetterOptions};

/** @internal */
export type {Fn};
