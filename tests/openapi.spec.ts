import "reflect-metadata";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { INestApplication } from "@nestjs/common";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildOpenApiDocument } from "../src/openapi";
import { createTestApp } from "./helpers/app";

const SPEC_PATH = resolve(process.cwd(), "docs/openapi.json");
const WRITE = process.env.WRITE_OPENAPI === "1";

/**
 * Generates the OpenAPI document. With `WRITE_OPENAPI=1` (run by `just spec`
 * through scripts/write-openapi.mjs) it writes `docs/openapi.json`. Otherwise
 * it asserts the committed document matches the generated one, so a hand edit
 * or a drifting route fails the suite.
 */
describe("OpenAPI document", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it(
    WRITE
      ? "writes docs/openapi.json"
      : "matches the committed docs/openapi.json",
    () => {
      const serialized = `${JSON.stringify(buildOpenApiDocument(app), null, 2)}\n`;
      if (WRITE) {
        writeFileSync(SPEC_PATH, serialized, "utf8");
        return;
      }
      expect(existsSync(SPEC_PATH)).toBe(true);
      expect(serialized).toBe(readFileSync(SPEC_PATH, "utf8"));
    },
  );
});
