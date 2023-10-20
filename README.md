# Lazy Get decorator

Getter decorator that memoises the return value

[![MASTER CI status](https://github.com/Alorel/typescript-lazy-get-decorator/actions/workflows/core.yml/badge.svg)](https://github.com/Alorel/typescript-lazy-get-decorator/actions/workflows/core.yml?query=branch%3Amaster)
[![NPM badge](https://img.shields.io/npm/v/lazy-get-decorator)](https://www.npmjs.com/package/lazy-get-decorator)
[![dependencies badge](https://img.shields.io/librariesio/release/npm/lazy-get-decorator)](https://libraries.io/npm/lazy-get-decorator)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/typescript-lazy-get-decorator/badge.svg)](https://coveralls.io/github/Alorel/typescript-lazy-get-decorator)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [Options](#options)
  - [Using the result selector](#using-the-result-selector)
- [Compatibility](#compatibility)
- [Migrating from v2](#migrating-from-v2)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

```shell
npm install lazy-get-decorator
```

# Usage

```typescript
import {LazyGetter} from 'lazy-get-decorator';

class MyClass {
  @LazyGetter(/* optional config */)
  get foo(): number {
    // ...
  } 
  
  @LazyGetter(/* optional config */)
  static get bar(): string {
    // ...
  }
}
```

## Options

All options are optional

| Name     | Type                                         | Default | Description                                                                                                                                                                                                      |
|----------|----------------------------------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `global` | `boolean`                                    | `false` | If set to true, the lazy getter triggering on one class instance will end up saving the returned value on all class instances, current and future. Has no effect on static getters.                              |
| `select` | `<T, R>(this: T, output: R, self: T) => any` |         | A function to determine whether we should save the results (returning a truthy value) or continue calling the original getter (returning a falsy value). The default behaviour is to always save the 1st result. |

## Using the result selector

The following example will save the value only if the counter is `10` or above. The selector executes after the getter
function, hence the offset of 1: the current value of 9 is returned and passed on to the result selector, but the
counter value is already incremented at this point.

```typescript
class MyClass {
  #counter = 0;
  
  @LazyGetter({select: v => v === 9})
  get timesAccessed(): number {
    return this.#counter++;
  }
}
```

# Compatibility

The library's only goal is to be compatible with Typescript 5 decorators which, at the time of writing, use the [2022-03 stage 3 decorators proposal](https://2ality.com/2022/10/javascript-decorators.html).
If you need experimental TS decorators or can't use a suitable Babel transform just stick to v2 - there are no new features in this release.

Typescript has further gotchas depending on the compiler target you've set.

ES2022 and higher allows you to use a class' method as a result selector:

```typescript
class MyClass {
  static shouldMemoiseStatic = false;
  shouldMemoiseInstance = true;
  
  @LazyGetter({select: MyClass.bar})
  static get foo() {}

  @LazyGetter({select: MyClass.prototype.bar2})
  get foo2() {}

  static bar() {
    return this.shouldMemoiseStatic;
  }
  
  bar2() {
    return this.shouldMemoiseInstance;
  }
}
```

Attempting to do this on ES2021 or lower will result in a runtime error as of Typescript 5.2.

# Migrating from v2

- The function signature has changed to accept an object instead of multiple arguments
- `makeNonConfigurable` option removed
- `setProto` option renamed to `global`
- The only officially supported version is now the non-experimental decorators of Typescript 5 - see [compatibility](#compatibility)
- The ability to reset a memoised getter has been removed.
   - If you need to do this as part of your unit tests, use a different class every time. The library's test suites have a few variations of this pattern - creating classes through a helper function, running similar tests through a helper function that accepts a class
   - If you need this at runtime then it's not a lazy getter you have - add whatever checks you need in your getter's logic and don't decorate it
