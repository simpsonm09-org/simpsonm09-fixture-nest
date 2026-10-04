# simpsonm09-fixture-nest working agreements

A layered NestJS item CRUD service. It is the TypeScript fixture for the fleet standard.

## Ground rules

- Business logic lives in `src/item/service/` and works in `domain.Item`. The controller never touches the store and the service never sees a DTO. Only `api/item.mapper.ts` bridges DTOs and the domain; only the store adapter bridges the port and its records.
- `docs/openapi.json` is generated. Annotate the controller and the DTOs and run `just spec`; never hand-edit the document. A test fails when the committed document drifts.
- The store is in memory. A restart discards items and restores the three dev seeds.
- No secret, credential, or machine path is committed.

## Commands

- `just install`, `just deps`, `just lint`, `just lint-fix`, `just aislop`, `just test`, `just coverage`, `just spec`, `just serve`, `just verify`, `just prune`.

## Repo facts

- Language and toolchain: Node 26, NestJS 11, TypeScript 5.9 in strict mode, `@nestjs/swagger` for OpenAPI, `class-validator` and `class-transformer` for request validation, pinned in `mise.toml` and `package.json`.
- Tests: vitest and `supertest`, chosen over Jest so coverage writes `coverage/lcov.info`, the path the fleet patch-coverage gate reads. `@nestjs/swagger` does not run its CLI plugin under vitest, so DTO schemas are declared with explicit `@ApiProperty` decorators.
- Data: no database. `src/item/store/in-memory-item.repository.ts` holds a `Map` and seeds three items on construction.
- Domain: `GET`, `POST`, `PUT`, and `DELETE` over `/items`. Reads, updates, and deletes of an unknown id throw `ItemNotFoundException`, which `src/common/http-exception.filter.ts` maps to a 404 `application/problem+json` body.
- Contracts: `docs/openapi.json` is generated from the controller and the DTOs. Regenerate it with `just spec`.
- Docs: `docs/README.md` indexes the architecture, the items feature, and the OpenAPI contract.

## Skills

No repo-local skills. General best practices and integration come from the plugins.
