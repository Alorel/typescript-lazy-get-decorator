/** Signifies that the modified property descriptor can be reset to its original state */
export interface ResettableDescriptor {
  /**
   * Restore the property descriptor on the given class instance or prototype and re-apply the lazy getter.
   * @param on The class instance or prototype
   */
  reset(on: any): void;
}
