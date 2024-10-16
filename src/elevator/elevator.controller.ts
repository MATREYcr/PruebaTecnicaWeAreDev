import { Controller, Post, Body } from '@nestjs/common';
import { ElevatorService } from './elevator.service';
import { addRequestedFloorsDto } from './dto/requestedFloors-elevator.dto';

@Controller('elevator')
export class ElevatorController {
  constructor(private readonly elevatorService: ElevatorService) { }
  @Post('requestedFloors')
  addRequestedFloors(@Body() callElevatorDto: addRequestedFloorsDto) {
    const response = this.elevatorService.addRequestedFloors(callElevatorDto);

    return {
      success: true,
      requestedFloors: response,
    };
  }

  @Post('doors')
  controlDoors(@Body() body: { action: 'open' | 'close' }) {
    const { action } = body;

    this.elevatorService.controlDoors(action);

    return { success: true, message: `Doors ${action}ed.` };
  }
}
