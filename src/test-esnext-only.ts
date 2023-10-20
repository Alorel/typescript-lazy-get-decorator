import {LazyGetter} from './index';

/* eslint-disable @typescript-eslint/no-magic-numbers */

export class StaticClassResultSelector {
  public static gets = 0;

  @LazyGetter({select: StaticClassResultSelector.shouldSave})
  public static get foo(): number {
    return this.gets++;
  }

  private static shouldSave(): boolean {
    return this.gets === 2;
  }
}

export class InstanceResultSelector {
  public gets = 0;

  @LazyGetter({select: InstanceResultSelector.prototype.shouldSave})
  public get foo(): number {
    return this.gets++;
  }

  private shouldSave(): boolean {
    return this.gets === 2;
  }
}
