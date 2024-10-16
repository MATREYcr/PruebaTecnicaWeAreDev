import { Injectable } from '@nestjs/common';
import { addRequestedFloorsDto } from './dto/requestedFloors-elevator.dto';

@Injectable()

export class ElevatorService {
  private elevatorState = {
    currentFloor: 1,
    isMoving: false,
    doorsOpen: false,
    requestedFloors: []
  };

  private requestQueue: { requestedFloor: number }[] = [];

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
  addRequest(request: { requestedFloor: number }) {
    this.requestQueue.push(request);
    this.processNextRequest();
  }

  private async processNextRequest() {
    if (this.elevatorState.isMoving || this.requestQueue.length === 0) {
      return;
    }

    const nextRequest = this.getNextRequest();
    if (!nextRequest) return;

    this.elevatorState.isMoving = true;
    await this.moveToFloor(nextRequest.requestedFloor);

    this.elevatorState.doorsOpen = true;
    this.removeRequest(nextRequest);
    console.log(`Elevator opened doors at floor ${nextRequest.requestedFloor}`);

    await new Promise(resolve => setTimeout(resolve, 2000));

    this.elevatorState.doorsOpen = false;
    this.elevatorState.isMoving = false;

    this.processNextRequest();
  }

  private async moveToFloor(targetFloor: number) {
    while (this.elevatorState.currentFloor !== targetFloor) {
      if (this.elevatorState.currentFloor < targetFloor) {
        this.elevatorState.currentFloor++;
      } else {
        this.elevatorState.currentFloor--;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));

      const intermediateRequest = this.requestQueue.find(
        req => req.requestedFloor === this.elevatorState.currentFloor
      );

      if (intermediateRequest) {
        this.elevatorState.doorsOpen = true;

        await new Promise(resolve => setTimeout(resolve, 2000));

        this.elevatorState.doorsOpen = false;
        this.removeRequest(intermediateRequest);
      }
    }
  }

  private getNextRequest() {
    const { currentFloor } = this.elevatorState;

    return this.requestQueue
      .sort((a, b) => Math.abs(a.requestedFloor - currentFloor) - Math.abs(b.requestedFloor - currentFloor))
    [0];
  }

  private removeRequest(request: { requestedFloor: number }) {
    this.requestQueue = this.requestQueue.filter(
      req => req.requestedFloor !== request.requestedFloor
    );
  }
}
