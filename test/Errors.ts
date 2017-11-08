import test from 'ava';
import * as tslib from 'tslib';
import {LazyGetter} from '../src/LazyGetter';

test('Not a getter', t => {
  t.throws(() => {
    // tslint:disable-next-line:no-unused-variable
    class Test {

      @LazyGetter()
      // tslint:disable-next-line:no-empty
      public notAGetter() {
      }
    }
  },       (e: Error) => e.message === '@LazyGetter can only decorate getters!');
});

test('Not configurable', t => {
  t.throws(() => {
    // tslint:disable-next-line:max-classes-per-file
    class Test {

    }

    Object.defineProperty(Test.prototype, 'foo', {
      configurable: false,
      get() {
        return 1;
      }
    });

    tslib.__decorate(
      [LazyGetter()],
      Test.prototype,
      'foo',
      null
    );
  },       (e: Error) => e.message === '@LazyGetter target must be configurable');
});
