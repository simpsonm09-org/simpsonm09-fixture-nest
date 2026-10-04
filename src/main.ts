import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/http-exception.filter";
import { buildOpenApiDocument } from "./openapi";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(adapterHost));

  SwaggerModule.setup("docs", app, buildOpenApiDocument(app));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
