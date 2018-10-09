// tslint:disable:no-magic-numbers no-identical-functions no-duplicate-string
import test from 'ava';
import {LazyGetter} from '../src/LazyGetter';

class MyTestClass {

  public static staticGets = 0;
  public static instanceGets = 0;

  @LazyGetter(false)
  public static get staticGetterFalse(): number {
    MyTestClass.staticGets++;

    return 1;
  }

  @LazyGetter()
  public static get staticGetterDefault(): number {
    MyTestClass.staticGets++;

    return 1;
  }

  @LazyGetter(true)
  public static get staticGetterTrue(): number {
    MyTestClass.staticGets++;

    return 1;
  }

  @LazyGetter(true)
  public get instanceGetterTrue(): number {
    MyTestClass.instanceGets++;

    return 1;
  }

  @LazyGetter()
  public get instanceGetterDefault(): number {
    MyTestClass.instanceGets++;

    return 1;
  }

  @LazyGetter(false)
  public get instanceGetterFalse(): number {
    MyTestClass.instanceGets++;

    return 1;
  }

  @LazyGetter(false, true)
  public get lazyGetterNoConfig(): number {

    return 1;
  }

  @LazyGetter(false)
  public get lazyGetterConfig(): number {

    return 1;
  }
}

// tslint:disable-next-line:no-empty
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

test('Configurable getter', t => {
  const i = new MyTestClass();
  noop(i.lazyGetterConfig);

  t.true(Object.getOwnPropertyDescriptor(i, 'lazyGetterConfig').configurable);
});

test('Configurable getter', t => {
  const i = new MyTestClass();
  noop(i.lazyGetterNoConfig);

  t.false(Object.getOwnPropertyDescriptor(i, 'lazyGetterNoConfig').configurable);
});
