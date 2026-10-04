import { describe, expect, it } from 'vitest';
import { InMemoryItemRepository, DEFAULT_ITEMS } from './in-memory-item.repository';

describe('InMemoryItemRepository', () => {
  it('seeds the default items on construction', () => {
    const store = new InMemoryItemRepository();

    expect(store.findAll()).toHaveLength(DEFAULT_ITEMS.length);
    expect(store.findAll().map((item) => item.name)).toEqual(['Widget', 'Gadget', 'Gizmo']);
  });

  it('assigns increasing ids and reads them back', () => {
    const store = new InMemoryItemRepository();
    store.clear();

    const first = store.save({ id: null, name: 'One', description: null });
    const second = store.save({ id: null, name: 'Two', description: 'second' });

    expect(first.id).toBe(1);
    expect(second.id).toBe(2);
    expect(store.findById(2)).toEqual({ id: 2, name: 'Two', description: 'second' });
  });

  it('keeps the id when replacing an existing record', () => {
    const store = new InMemoryItemRepository();
    store.clear();
    store.save({ id: null, name: 'One', description: null });

    store.save({ id: 1, name: 'Renamed', description: null });

    expect(store.findAll()).toHaveLength(1);
    expect(store.findById(1)?.name).toBe('Renamed');
  });

  it('deletes and reports existence', () => {
    const store = new InMemoryItemRepository();
    store.clear();
    store.save({ id: null, name: 'One', description: null });

    expect(store.existsById(1)).toBe(true);
    store.deleteById(1);
    expect(store.existsById(1)).toBe(false);
    expect(store.findAll()).toEqual([]);
  });

  it('resets to the seeds on seed()', () => {
    const store = new InMemoryItemRepository();
    store.clear();

    store.seed(DEFAULT_ITEMS);

    expect(store.findAll()).toHaveLength(DEFAULT_ITEMS.length);
  });
});
