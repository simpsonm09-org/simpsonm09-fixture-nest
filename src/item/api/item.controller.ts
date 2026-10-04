import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  type ApiResponseOptions,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { ItemService } from "../service/item.service";
import { ItemRequestDto, ItemResponseDto } from "./item.dto";
import { toItem, toItemResponse } from "./item.mapper";
import { ProblemDetailDto } from "./problem-detail.dto";

/** 404 body, served as `application/problem+json` (see the exception filter). */
const NOT_FOUND_RESPONSE: ApiResponseOptions = {
  status: 404,
  description: "Item not found",
  content: {
    "application/problem+json": {
      schema: { $ref: getSchemaPath(ProblemDetailDto) },
    },
  },
};

/** Item CRUD endpoints. It speaks DTOs and never touches the store. */
@ApiExtraModels(ProblemDetailDto)
@ApiTags("Items")
@Controller("items")
export class ItemController {
  constructor(@Inject(ItemService) private readonly service: ItemService) {}

  @Get()
  @ApiOperation({ summary: "List every item" })
  @ApiOkResponse({ type: ItemResponseDto, isArray: true })
  listItems(): ItemResponseDto[] {
    return this.service.listItems().map(toItemResponse);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get one item by id" })
  @ApiParam({
    name: "id",
    schema: { type: "integer", format: "int64", example: 1 },
  })
  @ApiOkResponse({ type: ItemResponseDto })
  @ApiResponse(NOT_FOUND_RESPONSE)
  getItem(@Param("id", ParseIntPipe) id: number): ItemResponseDto {
    return toItemResponse(this.service.getItem(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create an item" })
  @ApiCreatedResponse({ type: ItemResponseDto })
  @ApiBadRequestResponse({ description: "Validation failed" })
  createItem(@Body() request: ItemRequestDto): ItemResponseDto {
    const domain = toItem(request);
    return toItemResponse(
      this.service.createItem(domain.name, domain.description),
    );
  }

  @Put(":id")
  @ApiOperation({ summary: "Replace an item" })
  @ApiParam({
    name: "id",
    schema: { type: "integer", format: "int64", example: 1 },
  })
  @ApiOkResponse({ type: ItemResponseDto })
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiBadRequestResponse({ description: "Validation failed" })
  updateItem(
    @Param("id", ParseIntPipe) id: number,
    @Body() request: ItemRequestDto,
  ): ItemResponseDto {
    const domain = toItem(request);
    return toItemResponse(
      this.service.updateItem(id, domain.name, domain.description),
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete an item" })
  @ApiParam({
    name: "id",
    schema: { type: "integer", format: "int64", example: 1 },
  })
  @ApiNoContentResponse({ description: "Item deleted" })
  @ApiResponse(NOT_FOUND_RESPONSE)
  deleteItem(@Param("id", ParseIntPipe) id: number): void {
    this.service.deleteItem(id);
  }
}
