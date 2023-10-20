import {expect} from 'chai';
import {LazyGetter} from './index';
import type {ResultSelector} from './index';
import type {InstanceResultSelector, StaticClassResultSelector} from './test-esnext-only';

/* eslint-disable @typescript-eslint/no-magic-numbers,max-lines,max-lines-per-function */

const IS_ESNEXT = !process.env.TS_NODE_COMPILER_OPTIONS;
const descEsnextOnly = IS_ESNEXT ? describe : describe.skip;

interface Inst {
  gets: number;

  get foo(): number;
}

interface InstClass<T> {
  new(): T;
}

interface InstCtx<T, C> {
  get calls(): C;
  get inst(): T;
}

type CallsNRS = [number, number];
type CallsRS = [number, number, number];

function ctxNRS<T extends Inst>(ctx: InstCtx<T, CallsNRS>): void {
  for (let i = 0; i < 2; ++i) {
    it(`Call ${i + 1} should have called orig fn`, () => {
      expect(ctx.calls[i]).to.eq(1);
    });
  }

  it('gets should be 1', () => {
    expect(ctx.inst.gets).to.eq(1);
  });
}

function ctxRS<T extends Inst>(ctx: InstCtx<T, CallsRS>): void {
  for (const [i, res] of [0, 1, 1].entries()) {
    it(`Call ${i + 1} should return ${res}`, () => {
      expect(ctx.calls[i]).to.eq(res);
    });
  }

  it('gets should be 2', () => {
    expect(ctx.inst.gets).to.eq(2);
  });
}

function checkDescriptor(inst: () => Inst): void {
  it('Should turn the descriptor into a property', () => {
    const desc = Object.getOwnPropertyDescriptor(inst(), 'foo')!;
    expect(desc).to.not.have.property('get');
    expect(desc).to.have.property('value');
  });
}

describe('Instance', () => {
  interface GlobalClass {
    gets: number;

    new(): GlobalInst;
  }

  interface GlobalInst {
    rawFoo: number;
    get foo(): number;
  }

  function testGlobals(makeClass: (selector?: ResultSelector<never, number>) => GlobalClass): void {
    describe('No result selector', () => {
      it('Serial instances', () => {
        const clazz = makeClass();

        const i1 = new clazz();
        expect(i1.foo).to.eq(1, 'access 1');
        expect(i1.foo).to.eq(1, 'access 2');
        expect(clazz.gets).to.eq(1, 'gets for instance 1');
        expect(new clazz().foo).to.eq(1, 'access 3');
        expect(clazz.gets).to.eq(1, 'gets for instance 2');
      });

      it('Concurrent instances', () => {
        const clazz = makeClass();

        const i1 = new clazz();
        const i2 = new clazz();

        expect(i1.foo).to.eq(1, 'access 1');
        expect(i1.foo).to.eq(1, 'access 2');
        expect(i2.foo).to.eq(1, 'access 3');
        expect(i2.foo).to.eq(1, 'access 4');
        expect(clazz.gets).to.eq(1);
      });
    });

    describe('With result selector', () => {
      function select(this: GlobalInst): boolean {
        return this.rawFoo === 2;
      }

      it('Serial instances', () => {
        const clazz = makeClass(select);

        const i1 = new clazz();
        expect(i1.foo).to.eq(1, 'access 1');
        expect(i1.foo).to.eq(2, 'access 2');
        expect(i1.foo).to.eq(2, 'access 3');
        expect(new clazz().foo).to.eq(2, 'access 4');
      });
      it('Concurrent instances', () => {
        const clazz = makeClass(select);

        const i1 = new clazz();
        const i2 = new clazz();

        expect(i1.foo).to.eq(1, 'access 1');
        expect(i1.foo).to.eq(2, 'access 2');
        expect(i1.foo).to.eq(2, 'access 3');
        expect(i2.foo).to.eq(2, 'access 4');
      });
    });
  }

  function commonRS<T extends Inst>(clazz: InstClass<T>): InstCtx<T, CallsRS> {
    let inst: T;
    let calls: CallsRS;

    before(() => {
      inst = new clazz();
      calls = [inst.foo, inst.foo, inst.foo];
    });

    const ctx: InstCtx<T, typeof calls> = {
      get calls() {
        return calls;
      },
      get inst() {
        return inst;
      }
    };

    ctxRS(ctx);

    return ctx;
  }

  function commonNRS<T extends Inst>(clazz: InstClass<T>): InstCtx<T, CallsNRS> {
    let inst: T;
    let calls: CallsNRS;

    before(() => {
      inst = new clazz();
      calls = [inst.foo, inst.foo];
    });

    const ctx: InstCtx<T, typeof calls> = {
      get calls() {
        return calls;
      },
      get inst() {
        return inst;
      }
    };

    ctxNRS(ctx);

    return ctx;
  }

  describe('Private', () => {
    describe('Global', () => {
      testGlobals(selector => (
        class Foo {
          public static gets = 0;

          public rawFoo = Foo.gets;

          public get foo(): number {
            return this.#foo;
          }

          @LazyGetter({global: true, select: selector})
          get #foo(): number {
            return (this.rawFoo = ++Foo.gets);
          }
        }
      ));
    });

    describe('Local', () => {
      describe('No result selector', () => {
        commonNRS(class implements Inst {
          public gets = 0;

          public get foo(): number {
            return this.#foo;
          }

          @LazyGetter()
          get #foo(): number {
            return ++this.gets;
          }
        });
      });

      describe('With result selector', () => {
        function select(val: number): boolean {
          return val === 1;
        }

        commonNRS(class implements Inst {
          public gets = 0;

          public get foo(): number {
            return this.#foo;
          }

          @LazyGetter({select})
          get #foo(): number {
            return ++this.gets;
          }
        });
      });
    });
  });

  describe('Public', () => {
    describe('Global', () => {
      testGlobals(selector => (
        class Foo {
          public static gets = 0;

          public rawFoo = Foo.gets;

          @LazyGetter({global: true, select: selector})
          public get foo(): number {
            return (this.rawFoo = ++Foo.gets);
          }
        }
      ));
    });

    describe('Local', () => {
      describe('No result selector', () => {
        const ctx = commonNRS(class implements Inst {
          public gets = 0;

          @LazyGetter()
          public get foo(): number {
            return ++this.gets;
          }
        });
        checkDescriptor(() => ctx.inst);
      });

      describe('With result selector', () => {
        function select(val: number): boolean {
          return val === 1;
        }

        const ctx = commonRS(class implements Inst {
          public gets = 0;

          @LazyGetter({select})
          public get foo(): number {
            return this.gets++;
          }
        });
        checkDescriptor(() => ctx.inst);
      });
    });
  });

  descEsnextOnly('Class method as result selector', () => {
    let calls: CallsRS;
    let inst: InstanceResultSelector;

    before(async () => {
      const clazz = (await import('./test-esnext-only')).InstanceResultSelector;
      inst = new clazz();
      calls = [inst.foo, inst.foo, inst.foo];
    });

    ctxRS({
      get calls() {
        return calls;
      },
      get inst() {
        return inst;
      }
    });
  });
});

describe('Static', () => {
  function commonNRS<T extends Inst>(clazz: T): void {
    let calls: CallsNRS;
    before(() => {
      calls = [clazz.foo, clazz.foo];
    });

    ctxNRS({
      get calls() {
        return calls;
      },
      get inst() {
        return clazz;
      }
    });
  }

  function commonRS(clazz: Inst): void {
    let calls: CallsRS;

    before(() => {
      calls = [clazz.foo, clazz.foo, clazz.foo];
    });

    ctxRS({
      get calls() {
        return calls;
      },
      get inst() {
        return clazz;
      }
    });
  }

  describe('Private', () => {
    describe('No result selector', () => {
      commonNRS(class {
        public static gets = 0;

        public static get foo(): number {
          return this.#foo;
        }

        @LazyGetter()
        static get #foo(): number {
          return ++this.gets;
        }
      });
    });

    describe('With result selector', () => {
      function select(val: number): boolean {
        return val === 1;
      }

      commonRS(class {
        public static gets = 0;

        public static get foo(): number {
          return this.#foo;
        }

        @LazyGetter({select})
        static get #foo(): number {
          return this.gets++;
        }
      });
    });
  });

  describe('Public', () => {
    describe('No result selector', () => {
      class Foo {
        public static gets = 0;

        @LazyGetter()
        public static get foo(): number {
          return ++this.gets;
        }
      }

      commonNRS(Foo);
      checkDescriptor(() => Foo);
    });

    describe('With result selector', () => {
      function select(_val: number, instance: typeof Foo): boolean {
        return instance.gets === 2;
      }

      class Foo {
        public static gets = 0;

        @LazyGetter({select})
        public static get foo(): number {
          return this.gets++;
        }
      }

      commonRS(Foo);
      checkDescriptor(() => Foo);
    });
  });

  descEsnextOnly('Class method as result selector', () => {
    let calls: CallsRS;
    let clazz: typeof StaticClassResultSelector;

    before(async () => {
      clazz = (await import('./test-esnext-only')).StaticClassResultSelector;
      calls = [clazz.foo, clazz.foo, clazz.foo];
    });

    ctxRS({
      get calls() {
        return calls;
      },
      get inst() {
        return clazz;
      }
    });
  });
});
