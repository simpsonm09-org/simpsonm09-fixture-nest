import type { Item } from "../domain/item";
import type { ItemRequestDto, ItemResponseDto } from "./item.dto";

/** Translates between the transport DTOs and the domain type. */
export function toItemResponse(item: Item): ItemResponseDto {
  if (item.id === null) throw new Error("a persisted item must have an id");
  return { id: item.id, name: item.name, description: item.description };
}

export function toItem(request: ItemRequestDto): Item {
  return {
    id: null,
    name: request.name,
    description: request.description ?? null,
  };
}
