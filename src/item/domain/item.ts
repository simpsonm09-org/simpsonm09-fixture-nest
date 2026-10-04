/**
 * An item as the service layer reasons about it, free of transport and store
 * detail. `id` is null until the store assigns it on save.
 */
export interface Item {
  readonly id: number | null;
  readonly name: string;
  readonly description: string | null;
}
