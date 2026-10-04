import { Inject, Injectable } from "@nestjs/common";
import type { Item } from "../domain/item";
import { ItemNotFoundException } from "../domain/item-not-found.exception";
import { ITEM_REPOSITORY, type ItemRepository } from "../store/item.repository";

/**
 * Item business logic. It works in the domain `Item` and depends on the
 * `ItemRepository` port, so it never sees a transport DTO or a store record.
 */
@Injectable()
export class ItemService {
  constructor(
    @Inject(ITEM_REPOSITORY) private readonly repository: ItemRepository,
  ) {}

  listItems(): Item[] {
    return this.repository.findAll();
  }

  getItem(id: number): Item {
    const item = this.repository.findById(id);
    if (item === undefined) throw new ItemNotFoundException(id);
    return item;
  }

  createItem(name: string, description: string | null): Item {
    return this.repository.save({ id: null, name, description });
  }

  updateItem(id: number, name: string, description: string | null): Item {
    if (!this.repository.existsById(id)) throw new ItemNotFoundException(id);
    return this.repository.save({ id, name, description });
  }

  deleteItem(id: number): void {
    if (!this.repository.existsById(id)) throw new ItemNotFoundException(id);
    this.repository.deleteById(id);
  }
}
