import { Injectable } from '@nestjs/common';
import { addRequestedFloorsDto } from './dto/requestedFloors-elevator.dto';

@Injectable()

export class ElevatorService {
  private elevatorState = {
    currentFloor: 1,
    doorsOpen: false,
    isStopped: false,
    requestedFloors: []
  };

  addRequestedFloors(requested: addRequestedFloorsDto) {
    const { requestedFloors, direction } = requested;

    if (requestedFloors.length === 0) return;
    if (direction === 'up') {
      requestedFloors.sort((a, b) => a - b);
    } else if (direction === 'down') {
      requestedFloors.sort((a, b) => b - a);
    } else {
      return [];
    }
    this.elevatorState.requestedFloors = requestedFloors;
    return requestedFloors;
    
  }
  controlDoors(action: 'open' | 'close') {
    if (action === 'open') {
      this.elevatorState.doorsOpen = true;
    } else if (action === 'close') {
      this.elevatorState.doorsOpen = false;
    }
  }
}