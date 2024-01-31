import { IsString } from "class-validator";

export class ProsConsDto {
    @IsString()
    readonly prompt: string;
  
}