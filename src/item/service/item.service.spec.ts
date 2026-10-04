import { describe, expect, it, vi } from 'vitest';
import type { Item } from '../domain/item';
import { ItemNotFoundException } from '../domain/item-not-found.exception';
import type { ItemRepository } from '../store/item.repository';
import { ItemService } from './item.service';

function makeRepository(overrides: Partial<ItemRepository> = {}): ItemRepository {
  return {
    findAll: vi.fn(() => []),
    findById: vi.fn(() => undefined),
    save: vi.fn((item: Item) => ({ ...item, id: item.id ?? 1 })),
    deleteById: vi.fn(),
    existsById: vi.fn(() => false),
    ...overrides,
  };
}

describe('ItemService', () => {
  it('lists every item', () => {
    const items: Item[] = [{ id: 1, name: 'Widget', description: null }];
    const service = new ItemService(makeRepository({ findAll: vi.fn(() => items) }));

    expect(service.listItems()).toEqual(items);
  });

  it('returns an item by id', () => {
    const repository = makeRepository({ findById: vi.fn(() => ({ id: 1, name: 'Widget', description: null })) });

    expect(new ItemService(repository).getItem(1).name).toBe('Widget');
  });

  it('throws when an item is missing', () => {
    const repository = makeRepository({ findById: vi.fn(() => undefined) });
    const service = new ItemService(repository);

    expect(() => service.getItem(9)).toThrow(ItemNotFoundException);
    expect(() => service.getItem(9)).toThrow('Item 9 was not found');
  });

  it('creates an item through the store', () => {
    const save = vi.fn((item: Item) => ({ ...item, id: 2 }));
    const service = new ItemService(makeRepository({ save }));

    const created = service.createItem('Gadget', 'A handy gadget');

    expect(save).toHaveBeenCalledWith({ id: null, name: 'Gadget', description: 'A handy gadget' });
    expect(created.id).toBe(2);
  });

  it('replaces an existing item', () => {
    const save = vi.fn((item: Item) => ({ ...item, id: item.id ?? 7 }));
    const repository = makeRepository({ existsById: vi.fn(() => true), save });

    const updated = new ItemService(repository).updateItem(1, 'Renamed', null);

    expect(save).toHaveBeenCalledWith({ id: 1, name: 'Renamed', description: null });
    expect(updated.name).toBe('Renamed');
  });

  it('refuses to update a missing item', () => {
    const save = vi.fn();
    const repository = makeRepository({ existsById: vi.fn(() => false), save });

    expect(() => new ItemService(repository).updateItem(404, 'Nope', null)).toThrow(ItemNotFoundException);
    expect(save).not.toHaveBeenCalled();
  });

  it('deletes an existing item', () => {
    const deleteById = vi.fn();
    const repository = makeRepository({ existsById: vi.fn(() => true), deleteById });

    new ItemService(repository).deleteItem(1);

    expect(deleteById).toHaveBeenCalledWith(1);
  });

  it('refuses to delete a missing item', () => {
    const deleteById = vi.fn();
    const repository = makeRepository({ existsById: vi.fn(() => false), deleteById });

    expect(() => new ItemService(repository).deleteItem(404)).toThrow(ItemNotFoundException);
    expect(deleteById).not.toHaveBeenCalled();
  });
});
