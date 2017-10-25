# Typescript Lazy Getter

[![Greenkeeper badge](https://badges.greenkeeper.io/Alorel/typescript-lazy-get-decorator.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/Alorel/typescript-lazy-get-decorator.png?branch=master)](https://travis-ci.org/Alorel/typescript-lazy-get-decorator)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/typescript-lazy-get-decorator/badge.svg?branch=master)](https://coveralls.io/github/Alorel/typescript-lazy-get-decorator?branch=master)

[![NPM](https://nodei.co/npm/typescript-lazy-get-decorator.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/typescript-lazy-get-decorator)

# API

```typescript
/**
 * Evaluate the getter function and cache the result
 * @param {boolean} [setProto=false] Set the value on the class prototype as well. Only applies to non-static getters.
 * @return {(target: any, key: string, descriptor: PropertyDescriptor) => void} A Typescript decorator function
 */
function LazyGetter(setProto: boolean = false) {}
```

# Usage

```typescript
import {LazyGetter} from 'typescript-lazy-get-decorator';

class AClass {

    @LazyGetter()
    get lazyNoProto():string {
        console.log('Evaluating lazyNoProto');
        return 'lazyNoProtoValue';
    }

    @LazyGetter(true)
    get lazyWithProto():string {
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

Outputs:

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