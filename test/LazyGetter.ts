import test from 'ava';
import {LazyGetter} from "../lib/LazyGetter";

class MyTestClass {

  static staticGets: number = 0;
  static instanceGets: number = 0;

  @LazyGetter(false)
  static get staticGetterFalse(): number {
    MyTestClass.staticGets++;
    return 1;
  }

  @LazyGetter()
  static get staticGetterDefault(): number {
    MyTestClass.staticGets++;
    return 1;
  }

  @LazyGetter(true)
  static get staticGetterTrue(): number {
    MyTestClass.staticGets++;
    return 1;
  }

  @LazyGetter(true)
  get instanceGetterTrue(): number {
    MyTestClass.instanceGets++;
    return 1;
  }

  @LazyGetter()
  get instanceGetterDefault(): number {
    MyTestClass.instanceGets++;
    return 1;
  }

  @LazyGetter(false)
  get instanceGetterFalse(): number {
    MyTestClass.instanceGets++;
    return 1;
  }
}

function noop(input: any) {

}

test.beforeEach('Reset MyTestClass', () => {
  MyTestClass.staticGets = 0;
  MyTestClass.instanceGets = 0;
});

test('Static getter: false', t => {
  t.is(MyTestClass.staticGets, 0, 'Initial gets = 0');

  noop(MyTestClass.staticGetterFalse);
  t.is(MyTestClass.staticGets, 1, 'Gets = 1');

  noop(MyTestClass.staticGetterFalse);
  t.is(MyTestClass.staticGets, 1, 'Gets still 1');
});

test('Static getter: default', t => {
  t.is(MyTestClass.staticGets, 0, 'Initial gets = 0');

  noop(MyTestClass.staticGetterDefault);
  t.is(MyTestClass.staticGets, 1, 'Gets = 1');

  noop(MyTestClass.staticGetterDefault);
  t.is(MyTestClass.staticGets, 1, 'Gets still 1');
});

test('Static getter: true', t => {
  t.is(MyTestClass.staticGets, 0, 'Initial gets = 0');

  noop(MyTestClass.staticGetterTrue);
  t.is(MyTestClass.staticGets, 1, 'Gets = 1');

  noop(MyTestClass.staticGetterTrue);
  t.is(MyTestClass.staticGets, 1, 'Gets still 1');
});

test('Instance getter: false', t => {
  t.is(MyTestClass.instanceGets, 0, 'Initial gets = 0');

  const inst1 = new MyTestClass();

  noop(inst1.instanceGetterFalse);
  t.is(MyTestClass.instanceGets, 1, 'Gets = 1');

  noop(inst1.instanceGetterFalse);
  t.is(MyTestClass.instanceGets, 1, 'Gets still 1');

  const inst2 = new MyTestClass();

  noop(inst2.instanceGetterFalse);
  t.is(MyTestClass.instanceGets, 2, 'Gets = 2');

  noop(inst2.instanceGetterFalse);
  t.is(MyTestClass.instanceGets, 2, 'Gets still 2');
});

test('Instance getter: default', t => {
  t.is(MyTestClass.instanceGets, 0, 'Initial gets = 0');

  const inst1 = new MyTestClass();

  noop(inst1.instanceGetterDefault);
  t.is(MyTestClass.instanceGets, 1, 'Gets = 1');

  noop(inst1.instanceGetterDefault);
  t.is(MyTestClass.instanceGets, 1, 'Gets still 1');

  const inst2 = new MyTestClass();

  noop(inst2.instanceGetterDefault);
  t.is(MyTestClass.instanceGets, 2, 'Gets = 2');

  noop(inst2.instanceGetterDefault);
  t.is(MyTestClass.instanceGets, 2, 'Gets still 2');
});

test('Instance getter: true', t => {
  t.is(MyTestClass.instanceGets, 0, 'Initial gets = 0');

  const inst1 = new MyTestClass();

  noop(inst1.instanceGetterTrue);
  t.is(MyTestClass.instanceGets, 1, 'Gets = 1');

  noop(inst1.instanceGetterTrue);
  t.is(MyTestClass.instanceGets, 1, 'Gets still 1');

  const inst2 = new MyTestClass();

  noop(inst2.instanceGetterTrue);
  t.is(MyTestClass.instanceGets, 1, '2nd instance gets = 1');

  noop(inst2.instanceGetterTrue);
  t.is(MyTestClass.instanceGets, 1, '2nd instance gets still 1');
});
