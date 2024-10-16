import { IsArray, ArrayMinSize, IsIn } from 'class-validator';

export class addRequestedFloorsDto {
  @IsArray({ message: 'The requested floors must be an array.' })
  @ArrayMinSize(1, { message: 'The array must contain at least one floor.' })
  requestedFloors: number[];

  @IsIn(['up', 'down'], { message: 'The direction must be either "up" or "down".' })
  direction: 'up' | 'down';
}