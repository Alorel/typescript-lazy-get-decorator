const {expect} = require('chai');
const {LazyGetter} = require('../dist/LazyGetter');
const noop = require('lodash/noop');
const tslibDecorate = require('tslib').__decorate;

describe(`LazyGetter (${TEST_TYPE})`, () => {
  describe('Valid decorations', () => {
    describe('Default result selector', () => {
      class MyTestClass {
        static staticGets = 0;
        static instanceGets = 0;

        @LazyGetter(false)
        static get staticGetterFalse() {
          MyTestClass.staticGets++;

          return 1;
        }

        @LazyGetter()
        static get staticGetterDefault() {
          MyTestClass.staticGets++;

          return 1;
        }

        @LazyGetter(true)
        static get staticGetterTrue() {
          MyTestClass.staticGets++;

          return 1;
        }

        @LazyGetter(true)
        get instanceGetterTrue() {
          MyTestClass.instanceGets++;

          return 1;
        }

        @LazyGetter()
        get instanceGetterDefault() {
          MyTestClass.instanceGets++;

          return 1;
        }

        @LazyGetter(false)
        get instanceGetterFalse() {
          MyTestClass.instanceGets++;

          return 1;
        }

        @LazyGetter(false, true)
        get lazyGetterNoConfig() {
          return 1;
        }

        @LazyGetter(false)
        get lazyGetterConfig() {
          return 1;
        }
      }

      beforeEach('Reset MyTestClass', () => {
        MyTestClass.staticGets = 0;
        MyTestClass.instanceGets = 0;
      });

      describe('Static', () => {
        it('false', () => {
          expect(MyTestClass.staticGets).to.eq(0, 'Initial gets = 0');

          noop(MyTestClass.staticGetterFalse);
          expect(MyTestClass.staticGets).to.eq(1, 'Gets = 1');

          noop(MyTestClass.staticGetterFalse);
          expect(MyTestClass.staticGets).to.eq(1, 'Gets still 1');
        });

        it('default', () => {
          expect(MyTestClass.staticGets).to.eq(0, 'Initial gets = 0');

          noop(MyTestClass.staticGetterDefault);
          expect(MyTestClass.staticGets).to.eq(1, 'Gets = 1');

          noop(MyTestClass.staticGetterDefault);
          expect(MyTestClass.staticGets).to.eq(1, 'Gets still 1');
        });

        it('true', () => {
          expect(MyTestClass.staticGets).to.eq(0, 'Initial gets = 1');

          noop(MyTestClass.staticGetterTrue);
          expect(MyTestClass.staticGets).to.eq(1, 'Gets = 1');

          noop(MyTestClass.staticGetterTrue);
          expect(MyTestClass.staticGets).to.eq(1, 'Gets still 1');
        });
      });

      describe('Instance', () => {
        it('Instance getter: false', () => {
          expect(MyTestClass.instanceGets).to.eq(0, 'Initial gets = 0');

          const inst1 = new MyTestClass();

          noop(inst1.instanceGetterFalse);
          expect(MyTestClass.instanceGets).to.eq(1, 'Gets = 1');

          noop(inst1.instanceGetterFalse);
          expect(MyTestClass.instanceGets).to.eq(1, 'Gets still 1');

          const inst2 = new MyTestClass();

          noop(inst2.instanceGetterFalse);
          expect(MyTestClass.instanceGets).to.eq(2, 'Gets = 2');

          noop(inst2.instanceGetterFalse);
          expect(MyTestClass.instanceGets).to.eq(2, 'Gets still 1');
        });

        it('Instance getter: default', () => {
          expect(MyTestClass.instanceGets).to.eq(0, 'Initial gets = 0');

          const inst1 = new MyTestClass();

          noop(inst1.instanceGetterDefault);
          expect(MyTestClass.instanceGets).to.eq(1, 'Gets = 1');

          noop(inst1.instanceGetterDefault);
          expect(MyTestClass.instanceGets).to.eq(1, 'Gets still 1');

          const inst2 = new MyTestClass();

          noop(inst2.instanceGetterDefault);
          expect(MyTestClass.instanceGets).to.eq(2, 'Gets = 2');

          noop(inst2.instanceGetterDefault);
          expect(MyTestClass.instanceGets).to.eq(2, 'Gets still 2');
        });

        it('Instance getter: true', () => {
          expect(MyTestClass.instanceGets).to.eq(0, 'Initial gets = 0');

          const inst1 = new MyTestClass();

          noop(inst1.instanceGetterTrue);
          expect(MyTestClass.instanceGets).to.eq(1, 'Gets = 1');

          noop(inst1.instanceGetterTrue);
          expect(MyTestClass.instanceGets).to.eq(1, 'Gets still 1');

          const inst2 = new MyTestClass();

          noop(inst2.instanceGetterTrue);
          expect(MyTestClass.instanceGets).to.eq(1, '2nd instance gets = 1');

          noop(inst2.instanceGetterTrue);
          expect(MyTestClass.instanceGets).to.eq(1, '2nd instance gets still 1');
        });
      });

      it('Configurable getter', () => {
        const i = new MyTestClass();
        noop(i.lazyGetterConfig);

        expect(Object.getOwnPropertyDescriptor(i, 'lazyGetterConfig').configurable).to.eq(true);
      });

      it('Non-configurable getter', () => {
        const i = new MyTestClass();
        noop(i.lazyGetterNoConfig);

        expect(Object.getOwnPropertyDescriptor(i, 'lazyGetterNoConfig').configurable).to.eq(false);
      });
    });

    describe('Custom result selector', () => {
      class Class {
        static gets = 0;

        @LazyGetter(false, false, v => v === 2)
        static get next() {
          return Class.gets++;
        }
      }

      it('1st call should return 0', () => {
        expect(Class.next).to.eq(0);
      });

      it('2nd call should return 1', () => {
        expect(Class.next).to.eq(1);
      });

      it('3rd call should return 2', () => {
        expect(Class.next).to.eq(2);
      });

      it('4th call should return 2', () => {
        expect(Class.next).to.eq(2);
      });
    });
  });

  describe('Errors', () => {
    it('Not a getter', () => {
      expect(() => {
        class C {
          @LazyGetter()
          notAGetter() {

          }
        }
      }).to.throw('@LazyGetter can only decorate getters!');
    });

    it('Not configurable', () => {
      expect(() => {
        class Test {

        }

        Object.defineProperty(Test.prototype, 'foo', {
          configurable: false,
          get() {
            return 1;
          }
        });

        tslibDecorate(
          [LazyGetter()],
          Test.prototype,
          'foo',
          null
        )
      }).to.throw('@LazyGetter target must be configurable');
    });
  });

  describe('Reset descriptor', () => {
    describe('Instance', () => {
      let dec, inst;

      before('Instantiate', () => {
        dec = LazyGetter();

        class MyClass {
          count = 0;

          @dec
          get computed() {
            return this.count++;
          }
        }

        inst = new MyClass();
      });

      it('1st call should return 0', () => {
        expect(inst.computed).to.eq(0);
      });

      it('2nd call should return 0', () => {
        expect(inst.computed).to.eq(0);
      });

      it('3rd call should return 1', () => {
        dec.reset(inst);
        expect(inst.computed).to.eq(1);
      });

      it('4th call should return 1', () => {
        expect(inst.computed).to.eq(1);
      });
    });

    describe('Static', () => {
      let count = 0;
      const dec = LazyGetter();

      class MyClass {
        @dec
        static get computed() {
          return count++;
        }
      }

      it('1st call should return 0', () => {
        expect(MyClass.computed).to.eq(0);
      });

      it('2nd call should return 0', () => {
        expect(MyClass.computed).to.eq(0);
      });

      it('3rd call should return 1', () => {
        dec.reset(MyClass);
        expect(MyClass.computed).to.eq(1);
      });

      it('4th call should return 1', () => {
        expect(MyClass.computed).to.eq(1);
      });
    });

    describe('Errors', () => {
      const specs = [
        ['Unable to restore descriptor on an undefined target', () => {
          const dec = LazyGetter();

          class C {
            @dec
            get m() {
              return 1
            }
          }

          dec.reset();
        }],
        ['Unable to restore descriptor. Did you remember to apply your decorator to a method?', () => {
          LazyGetter().reset(1);
        }],
        ['This decoration modifies the class prototype and cannot be reset.', () => {
          const dec = LazyGetter(true);

          class MC {
            @dec
            get m() {
            }
          }

          dec.reset();
        }]
      ];

      for (const [txt, fn] of specs) {
        it(txt, () => {
          expect(fn).to.throw(txt);
        });
      }
    });
  });
});
