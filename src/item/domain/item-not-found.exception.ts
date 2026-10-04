/**
 * Raised when an item id has no matching record. The API filter maps it to an
 * HTTP 404 problem detail.
 */
export class ItemNotFoundException extends Error {
  constructor(readonly itemId: number) {
    super(`Item ${itemId} was not found`);
    this.name = 'ItemNotFoundException';
  }
}
