const {expect} = require('chai');
const {LazyGetter} = require('../dist/LazyGetter');
const noop = require('lodash/noop');
const tslibDecorate = require('tslib').__decorate;

describe(`LazyGetter (${TEST_TYPE})`, () => {
  describe('Valid decorations', () => {
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
})
