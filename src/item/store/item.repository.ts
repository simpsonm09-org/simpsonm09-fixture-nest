import type { Item } from '../domain/item';

/** Injection token for the store port. */
export const ITEM_REPOSITORY = Symbol('ItemRepository');

/**
 * The store port the service depends on. It speaks domain types, so the
 * service never sees a store record and the adapter can be swapped without
 * touching business logic.
 */
export interface ItemRepository {
  findAll(): Item[];
  findById(id: number): Item | undefined;
  save(item: Item): Item;
  deleteById(id: number): void;
  existsById(id: number): boolean;
}
