export interface NewDescriptor extends PropertyDescriptor {
  descriptor?: PropertyDescriptor;

  readonly key: PropertyKey;

  readonly kind: string;

  placement: string;
}
