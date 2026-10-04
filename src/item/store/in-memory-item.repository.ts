import { Injectable } from '@nestjs/common';
import type { Item } from '../domain/item';
import type { ItemRepository } from './item.repository';

/** The three items seeded on startup so the API has something to return. */
export const DEFAULT_ITEMS: ReadonlyArray<Pick<Item, 'name' | 'description'>> = [
  { name: 'Widget', description: 'A small widget' },
  { name: 'Gadget', description: 'A handy gadget' },
  { name: 'Gizmo', description: 'A clever gizmo' },
];

/**
 * In-memory store adapter. It converges to the seeded state on restart, so a
 * restart discards every item the caller created and restores the three seeds.
 */
@Injectable()
export class InMemoryItemRepository implements ItemRepository {
  private readonly items = new Map<number, Item>();
  private nextId = 1;

  constructor() {
    this.seed(DEFAULT_ITEMS);
  }

  findAll(): Item[] {
    return [...this.items.values()];
  }

  findById(id: number): Item | undefined {
    return this.items.get(id);
  }

  save(item: Item): Item {
    const id = item.id ?? this.nextId++;
    const stored: Item = { id, name: item.name, description: item.description };
    this.items.set(id, stored);
    return stored;
  }

  deleteById(id: number): void {
    this.items.delete(id);
  }

  existsById(id: number): boolean {
    return this.items.has(id);
  }

  /** Replaces every record with the given seeds. Used by the dev seed and tests. */
  seed(seeds: ReadonlyArray<Pick<Item, 'name' | 'description'>>): void {
    this.items.clear();
    this.nextId = 1;
    for (const seed of seeds) this.save({ id: null, name: seed.name, description: seed.description });
  }

  /** Empties the store. */
  clear(): void {
    this.items.clear();
    this.nextId = 1;
  }
}
