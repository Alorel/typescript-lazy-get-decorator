export interface RestorableDescriptor {
  /**
   * Restore the property descriptor on the given class instance or prototype
   * @param on The class instance or prototype
   */
  restoreDescriptor(on: any): void;
}
