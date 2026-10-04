# Items

## What it does

The service exposes item CRUD over HTTP. Each item has a server-assigned id, a name, and an
optional description.

| Method | Path | Success | Body |
| --- | --- | --- | --- |
| `GET` | `/items` | `200 OK` | list of items |
| `GET` | `/items/{id}` | `200 OK` | one item |
| `POST` | `/items` | `201 Created` | the created item |
| `PUT` | `/items/{id}` | `200 OK` | the replaced item |
| `DELETE` | `/items/{id}` | `204 No Content` | none |

The API document is generated from the controller and the DTOs by `@nestjs/swagger`.
`just spec` regenerates `docs/openapi.json`.

## Data shape

An item, as returned by the API:

```json
{
  "id": 1,
  "name": "Widget",
  "description": "A small widget"
}
```

- `id` is a positive integer assigned by the store. It is absent from requests.
- `name` is required and at most 200 characters.
- `description` is optional and at most 2000 characters. A request that omits it stores `null`.

The domain type is `domain.Item`, the stored shape is the record the in-memory adapter keeps in
its `Map`, and the transport shapes are `api.ItemRequestDto` and `api.ItemResponseDto`. The
service creates an item, then the store assigns the id.

## Failure modes

- An unknown id on `GET`, `PUT`, or `DELETE` returns `404 Not Found` as an RFC 7807 problem detail with content type `application/problem+json`. The service throws `ItemNotFoundException` and `HttpExceptionFilter` maps it to `{ "type": "about:blank", "title": "Item not found", "status": 404, "detail": "Item {id} was not found" }`.
- A `POST` or `PUT` body with a blank name, or a name over 200 characters, returns `400 Bad Request`. `class-validator` runs at the controller boundary through the global `ValidationPipe`.
- A `POST` or `PUT` body with a description over 2000 characters returns `400 Bad Request`.
- A malformed JSON body returns `400 Bad Request`.
- The store is in memory, so restarting the process discards every item and restores the three
  dev seeds (`Widget`, `Gadget`, `Gizmo`).
