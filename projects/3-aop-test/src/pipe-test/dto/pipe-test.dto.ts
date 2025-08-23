import { IsInt } from 'class-validator';

export class PipeTestDto {
  name: string;

  @IsInt()
  age: number;

  sex: boolean;
  hobbies: Array<string>;
}
