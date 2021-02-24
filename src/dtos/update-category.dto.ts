import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDTO {

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}

interface Event {
  name: string,
  operation: string,
  value: number,
}