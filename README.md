# Lazy Get decorator

[![Build Status](https://travis-ci.org/Alorel/typescript-lazy-get-decorator.png?branch=2.1.0)](https://travis-ci.org/Alorel/typescript-lazy-get-decorator)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/typescript-lazy-get-decorator/badge.svg?branch=2.1.0)](https://coveralls.io/github/Alorel/typescript-lazy-get-decorator?branch=2.1.0)
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
