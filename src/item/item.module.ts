import { Module } from "@nestjs/common";
import { ItemController } from "./api/item.controller";
import { ItemService } from "./service/item.service";
import { InMemoryItemRepository } from "./store/in-memory-item.repository";
import { ITEM_REPOSITORY } from "./store/item.repository";

@Module({
  controllers: [ItemController],
  providers: [
    ItemService,
    { provide: ITEM_REPOSITORY, useClass: InMemoryItemRepository },
  ],
  exports: [ItemService, ITEM_REPOSITORY],
})
export class ItemModule {}
