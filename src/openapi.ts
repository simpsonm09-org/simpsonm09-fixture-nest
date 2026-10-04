import type { INestApplication } from "@nestjs/common";
import {
  DocumentBuilder,
  type OpenAPIObject,
  SwaggerModule,
} from "@nestjs/swagger";

/** Builds the OpenAPI document from the running application. */
export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle("Simpsonm09 Fixture Nest API")
    .setDescription("Item CRUD service for the simpsonm09 repository fixture")
    .setVersion("0.1.0")
    .build();
  return SwaggerModule.createDocument(app, config);
}
