# Lazy Get decorator

[![Build Status](https://travis-ci.org/Alorel/typescript-lazy-get-decorator.png?branch=2.2.0)](https://travis-ci.org/Alorel/typescript-lazy-get-decorator)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/typescript-lazy-get-decorator/badge.svg?branch=2.2.0)](https://coveralls.io/github/Alorel/typescript-lazy-get-decorator?branch=2.2.0)
[![Greenkeeper badge](https://badges.greenkeeper.io/Alorel/typescript-lazy-get-decorator.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/lazy-get-decorator.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/lazy-get-decorator)

Previously known as [typescript-lazy-get-decorator](https://www.npmjs.com/package/lazy-get-decorator).

# Compatibility

- Typescript - full
- Spec-compliant decorator proposal - full
- Babel (current proposal) - full
- Babel (legacy) - full

# API

```typescript
/**
 * Evaluate the getter function and cache the result
 * @param {boolean} [setProto=false] Set the value on the class prototype as well. Only applies to non-static getters.
 * @param {boolean} [makeNonConfigurable=false] Set to true to make the resolved property non-configurable
 * @param {ResultSelectorFn} [resultSelector] A filter function that must return true for the value to cached
 * @return A Typescript decorator function
 */
function LazyGetter(setProto?: boolean, makeNonConfigurable?: boolean, resultSelector?: (value: any) => boolean): MethodDecorator;
```

# Usage

```typescript
import {LazyGetter} from 'lazy-get-decorator';

class AClass {

    @LazyGetter()
    get lazyNoProto(): string {
        console.log('Evaluating lazyNoProto');

        return 'lazyNoProtoValue';
    }

    @LazyGetter(true)
    get lazyWithProto(): string {
        console.log('Evaluating lazyWithProto');

        return 'lazyWithProtoValue';
    }
}

const inst1 = new AClass();

console.log('==== inst 1 ====\n');

console.log(inst1.lazyNoProto);
console.log(inst1.lazyNoProto);
console.log(inst1.lazyWithProto);
console.log(inst1.lazyWithProto);

const inst2 = new AClass();

console.log('\n\n==== inst 2 ====\n');

console.log(inst2.lazyNoProto);
console.log(inst2.lazyNoProto);
console.log(inst2.lazyWithProto);
console.log(inst2.lazyWithProto);
```

Output:

    ==== inst 1 ====

    Evaluating lazyNoProto
    lazyNoProtoValue
    lazyNoProtoValue
    Evaluating lazyWithProto
    lazyWithProtoValue
    lazyWithProtoValue


    ==== inst 2 ====

    Evaluating lazyNoProto
    lazyNoProtoValue
    lazyNoProtoValue
    lazyWithProtoValue
    lazyWithProtoValue

# Using the result selector

```typescript
import {LazyGetter} from 'lazy-get-decorator';

class MyClass {
  public readonly someCondition = 10;
  
  @LazyGetter(false, false, (v: number) => v === 10)
  public get prop1(): number {
    // This will get cached
    return this.someCondition;
  }
  
  @LazyGetter(false, false, (v: number) => v === 1)
  public get prop2(): number {
    // This won't get cached
    return this.someCondition;
  }
}
```

# Resetting LazyGetter

The cached value can be reset if the decorator does not modify the class prototype,
i.e. is not called as `@LazyGetter(true)`:

```typescript
import {LazyGetter} from 'lazy-get-decorator';

const instanceDec = LazyGetter();
const staticDec = LazyGetter();

class MyClass {
  public instanceCount = 0;
  public static staticCount = 0;
  
  @instanceDec
  public get count(): number {
    return this.instanceCount++;
  }
  
  @staticDec
  public static get count(): number {
    return MyClass.staticCount++;
  }
}

const inst = new MyClass();

console.log(inst.count); // 0
console.log(inst.count); // 0
instanceDec.reset(inst);
console.log(inst.count); // 1

console.log(MyClass.count); // 0
console.log(MyClass.count); // 0
staticDec.reset(MyClass);
console.log(MyClass.count); // 1
```

Resetting the decoration performs the following steps:

1. Resets the property descriptor to its state before the decoration
1. Re-applies the decorator

This means that any descriptor changes made by other decorators may be lost, therefore you
should ensure `LazyGetter` is applied last if you intend on resetting it, i.e. place it
at the very top of your decorators list:

```typescript
class MyClass {

  @LazyGetter()
  @decorator2
  @decorator1
  get getter() {
    return 1;
  }
}
```
