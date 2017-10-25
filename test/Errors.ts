import test from 'ava';
import {LazyGetter} from "../lib/LazyGetter";
import * as tslib from 'tslib';

test('Not a getter', t => {
  t.throws(() => {
    class Test {

      @LazyGetter()
      notAGetter() {
      }
    }
  }, (e: Error) => e.message === '@LazyGetter can only decorate getters!')
});

test('Not configurable', t => {
  t.throws(() => {
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
  }, (e: Error) => e.message === '@LazyGetter target must be configurable')
});