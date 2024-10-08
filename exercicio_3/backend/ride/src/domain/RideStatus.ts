import Ride from "./Ride";

export default interface RideStatus {
    value: string;
    request (): void;
    accept (): void;
    start (): void;
}

export class RequestedStatus implements RideStatus {
    value: string;

    constructor(readonly ride: Ride) {
        this.value = "requested"
    }
    request(): void {
        throw new Error("Invalid status")
    }
    accept(): void {
        this.ride.setStatus(new AcceptedStatus(this.ride))
    }
    start(): void {
        throw new Error("Invalid status")
    }
}

export class AcceptedStatus implements RideStatus {
    value: string;

    constructor(readonly ride: Ride) {
        this.value = "accepted"
    }
    request(): void {
        throw new Error("Invalid status")
    }
    accept(): void {
        throw new Error("Invalid status")
    }
    start(): void {
        this.ride.setStatus(new InProgressStatus(this.ride))
    }
}

export class InProgressStatus implements RideStatus {
    value: string;

    constructor(readonly ride: Ride) {
        this.value = "in_progress"
    }
    request(): void {
        throw new Error("Invalid status")
    }
    accept(): void {
        throw new Error("Invalid status")
    }
    start(): void {
        throw new Error("Invalid status")
    }
}