import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { InMemoryItemRepository } from "../src/item/store/in-memory-item.repository";
import { ITEM_REPOSITORY } from "../src/item/store/item.repository";
import { createTestApp } from "./helpers/app";

describe("Items API", () => {
  let app: INestApplication;
  let store: InMemoryItemRepository;

  beforeAll(async () => {
    app = await createTestApp();
    store = app.get<InMemoryItemRepository>(ITEM_REPOSITORY);
  });

  beforeEach(() => store.clear());

  afterAll(async () => {
    await app.close();
  });

  it("lists no items after the store is emptied", async () => {
    const response = await request(app.getHttpServer())
      .get("/items")
      .expect(200);
    expect(response.body).toEqual([]);
  });

  it("drives the full create, read, update, delete lifecycle", async () => {
    const created = await request(app.getHttpServer())
      .post("/items")
      .send({ name: "Widget", description: "A small widget" })
      .expect(201);
    expect(created.body).toMatchObject({
      name: "Widget",
      description: "A small widget",
    });
    const id = created.body.id as number;
    expect(typeof id).toBe("number");

    const list = await request(app.getHttpServer()).get("/items").expect(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].name).toBe("Widget");

    const one = await request(app.getHttpServer())
      .get(`/items/${id}`)
      .expect(200);
    expect(one.body).toEqual({
      id,
      name: "Widget",
      description: "A small widget",
    });

    const updated = await request(app.getHttpServer())
      .put(`/items/${id}`)
      .send({ name: "Renamed", description: "Still here" })
      .expect(200);
    expect(updated.body).toEqual({
      id,
      name: "Renamed",
      description: "Still here",
    });

    await request(app.getHttpServer()).delete(`/items/${id}`).expect(204);
    await request(app.getHttpServer()).get(`/items/${id}`).expect(404);
  });

  it("stores a missing description as null", async () => {
    const created = await request(app.getHttpServer())
      .post("/items")
      .send({ name: "No description" })
      .expect(201);
    expect(created.body.description).toBeNull();
  });

  it("returns a 404 problem detail for an unknown id on GET", async () => {
    const response = await request(app.getHttpServer())
      .get("/items/999")
      .expect(404);
    expect(response.headers["content-type"]).toContain(
      "application/problem+json",
    );
    expect(response.body).toEqual({
      type: "about:blank",
      title: "Item not found",
      status: 404,
      detail: "Item 999 was not found",
    });
  });

  it("returns a 404 for an unknown id on PUT", async () => {
    const response = await request(app.getHttpServer())
      .put("/items/999")
      .send({ name: "X" })
      .expect(404);
    expect(response.body.title).toBe("Item not found");
  });

  it("returns a 404 for an unknown id on DELETE", async () => {
    const response = await request(app.getHttpServer())
      .delete("/items/999")
      .expect(404);
    expect(response.body.title).toBe("Item not found");
  });

  it("rejects a blank name with 400", async () => {
    await request(app.getHttpServer())
      .post("/items")
      .send({ name: "" })
      .expect(400);
    await request(app.getHttpServer())
      .post("/items")
      .send({ name: "   " })
      .expect(400);
  });

  it("rejects an over-length name with 400", async () => {
    await request(app.getHttpServer())
      .post("/items")
      .send({ name: "a".repeat(201) })
      .expect(400);
  });

  it("rejects an over-length description with 400", async () => {
    await request(app.getHttpServer())
      .post("/items")
      .send({ name: "Ok", description: "a".repeat(2001) })
      .expect(400);
  });

  it("rejects malformed JSON with 400", async () => {
    await request(app.getHttpServer())
      .post("/items")
      .set("Content-Type", "application/json")
      .send('{"name": "Broken"')
      .expect(400);
  });
});

describe("Startup seed", () => {
  it("seeds three items on startup", async () => {
    const app = await createTestApp();
    const response = await request(app.getHttpServer())
      .get("/items")
      .expect(200);
    expect(response.body).toHaveLength(3);
    expect(response.body.map((item: { name: string }) => item.name)).toEqual([
      "Widget",
      "Gadget",
      "Gizmo",
    ]);
    await app.close();
  });
});
