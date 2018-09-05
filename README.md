# Typescript Lazy Getter

[![Build Status](https://travis-ci.org/Alorel/typescript-lazy-get-decorator.png?branch=1.2.2)](https://travis-ci.org/Alorel/typescript-lazy-get-decorator)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/typescript-lazy-get-decorator/badge.svg?branch=1.2.2)](https://coveralls.io/github/Alorel/typescript-lazy-get-decorator?branch=1.2.2)
[![Dependency status](https://david-dm.org/alorel/typescript-lazy-get-decorator.svg)](https://david-dm.org/alorel/typescript-lazy-get-decorator#info=dependencies&view=list)
[![Dev dependency status](https://david-dm.org/alorel/typescript-lazy-get-decorator/dev-status.svg)](https://david-dm.org/alorel/typescript-lazy-get-decorator#info=devDependencies&view=list)
[![Greenkeeper badge](https://badges.greenkeeper.io/Alorel/typescript-lazy-get-decorator.svg)](https://greenkeeper.io/)

[![NPM](https://nodei.co/npm/typescript-lazy-get-decorator.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/typescript-lazy-get-decorator)

# API

```typescript
/**
 * Evaluate the getter function and cache the result
 * @param {boolean} [setProto=false] Set the value on the class prototype as well. Only applies to non-static getters.
 * @param {boolean} [makeNonConfigurable=false] Set to true to make the resolved property non-configurable
 * @return {(target: any, key: string, descriptor: PropertyDescriptor) => void} A Typescript decorator function
 */
function LazyGetter(setProto: boolean = false, makeNonConfigurable = false) {}
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
