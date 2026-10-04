import { type ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter, type HttpAdapterHost } from "@nestjs/core";
import type { Response } from "express";
import { ItemNotFoundException } from "../item/domain/item-not-found.exception";

/**
 * Maps `ItemNotFoundException` to an RFC 7807 problem detail with content type
 * `application/problem+json`, and delegates every other exception to the Nest
 * default filter so validation and parse failures keep their standard shape.
 */
@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor(adapterHost: HttpAdapterHost) {
    super(adapterHost.httpAdapter);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof ItemNotFoundException) {
      const response = host.switchToHttp().getResponse<Response>();
      response
        .status(HttpStatus.NOT_FOUND)
        .type("application/problem+json")
        .send(
          JSON.stringify({
            type: "about:blank",
            title: "Item not found",
            status: HttpStatus.NOT_FOUND,
            detail: exception.message,
          }),
        );
      return;
    }
    super.catch(exception, host);
  }
}
