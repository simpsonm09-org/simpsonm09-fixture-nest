import { ApiProperty } from "@nestjs/swagger";

/** RFC 7807 problem detail returned for item errors. */
export class ProblemDetailDto {
  @ApiProperty({ description: "Problem type URI", example: "about:blank" })
  type!: string;

  @ApiProperty({
    description: "Short human-readable summary",
    example: "Item not found",
  })
  title!: string;

  @ApiProperty({
    description: "HTTP status code",
    example: 404,
    type: "integer",
  })
  status!: number;

  @ApiProperty({
    description: "Explanation specific to this occurrence",
    example: "Item 9 was not found",
  })
  detail!: string;
}
