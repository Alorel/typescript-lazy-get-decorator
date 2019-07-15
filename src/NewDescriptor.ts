/** ES7 proposal descriptor, tweaked for Babel */
export interface NewDescriptor extends PropertyDescriptor {
  descriptor?: PropertyDescriptor;

  key: PropertyKey;

  kind: string;

  placement: string;
}
