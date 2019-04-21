import {getterCommon, validateAndExtractMethodFromDescriptor} from './common';
import {NewDescriptor} from './NewDescriptor';
import {ResultSelectorFn} from './ResultSelectorFn';

/** @internal */
export function decorateNew(inp: NewDescriptor,
                            setProto: boolean | undefined,
                            makeNonConfigurable: boolean | undefined,
                            resultSelector: ResultSelectorFn): NewDescriptor {
  const out: NewDescriptor = Object.assign({}, inp);
  if (out.descriptor) {
    out.descriptor = Object.assign({}, out.descriptor);
  }
  const actualDesc: PropertyDescriptor = <any>(out.descriptor || out); //incorrect babel implementation support

  const originalMethod = validateAndExtractMethodFromDescriptor(actualDesc);
  const isStatic = inp.placement === 'static';

  actualDesc.get = function (this: any): any {
    return getterCommon(
      isStatic ? this : Object.getPrototypeOf(this),
      out.key,
      isStatic,
      !!actualDesc.enumerable,
      originalMethod,
      this,
      arguments,
      setProto,
      makeNonConfigurable,
      resultSelector
    );
  };

  return out;
}
