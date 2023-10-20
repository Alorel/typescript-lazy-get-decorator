import type {Fn, ResultSelector} from './index';

function set(obj: any, prop: PropertyKey, value: any, enumerable = true): void {
  Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable,
    value
  });
}

function nameFn<T extends Pick<Function, 'name'>>(name: PropertyKey, fn: T): T {
  set(fn, 'name', `@LazyGetter${String(name)}`);

  return fn;
}

function autoNameFn({name}: Pick<Function, 'name'>): string {
  return `@LazyGetter(${name})`;
}

/** @internal */
export function publicInstance<T, R>(
  name: PropertyKey,
  target: Fn<T, R>,
  select?: ResultSelector<T, R>
): Fn<T, R> {
  return nameFn(autoNameFn(target), select
    ? function (): R {
      const value = target.call(this);
      if (select.call(this, value, this)) {
        set(this, name, value);
      }

      return value;
    }
    : function (): R {
      const value = target.call(this);
      set(this, name, value);

      return value;
    });
}

/** @internal */
export function privateInstance<T, R>(
  name: PropertyKey,
  target: Fn<T, R>,
  select?: ResultSelector<T, R>
): Fn<T, R> {
  const RESULT_COMPUTED: unique symbol = Symbol(`${String(name)} result`);
  type RC = T & {[RESULT_COMPUTED]?: R};

  return nameFn(autoNameFn(target), select
    ? function (): R {
      if (RESULT_COMPUTED in (this as RC)) {
        return (this as RC)[RESULT_COMPUTED]!;
      }

      const value = target.call(this);
      if (select.call(this, value, this)) {
        set(this, RESULT_COMPUTED, value, false);
      }

      return value;
    }
    : function (): R {
      if (RESULT_COMPUTED in (this as RC)) {
        return (this as RC)[RESULT_COMPUTED]!;
      }

      const value = target.call(this);
      set(this, RESULT_COMPUTED, value, false);

      return value;
    });
}

/** @internal */
export function publicInstanceGlobal<T, R>(
  name: PropertyKey,
  target: Fn<T, R>,
  select?: ResultSelector<T, R>
): Fn<T, R> {
  return nameFn(autoNameFn(target), select
    ? function (): R {
      const value = target.call(this);
      if (select.call(this, value, this)) {
        set(Object.getPrototypeOf(this), name, value, false);
      }

      return value;
    }
    : function (): R {
      const value = target.call(this);
      set(Object.getPrototypeOf(this), name, value, false);

      return value;
    });
}

/** @internal */
export function privateStatic<T, R>(target: Fn<T, R>, select?: ResultSelector<T, R>): Fn<T, R> {
  let firstCall = true;
  let value: R;

  return nameFn(autoNameFn(target), select
    ? function () {
      if (firstCall) {
        value = target.call(this);
        if (select.call(this, value, this)) {
          firstCall = false;
        }
      }

      return value;
    }
    : function (): R {
      if (firstCall) {
        value = target.call(this);
        firstCall = false;
      }

      return value;
    });
}
