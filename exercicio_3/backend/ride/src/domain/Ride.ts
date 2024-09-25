import Coord from "./Coord";
import RideStatus, { AcceptedStatus, InProgressStatus, RequestedStatus } from "./RideStatus";
import UUID from "./UUID";

export default class Ride {
	private rideId: UUID;
	private passengerId: UUID;
	private driverId?: UUID;
	private from: Coord;
	private to: Coord;
	private status: RideStatus;
	private date: Date;
	private positionId?: UUID;

	constructor (
		rideId: string, 
		passengerId: string, 
		fromLat: number, 
		fromLong: number, 
		toLat: number, 
		toLong: number, 
		status: string, 
		date: Date, 
		driverId: string = "",
		positionId?: string,
	) {
		this.rideId = new UUID(rideId);
		this.passengerId = new UUID(passengerId);
		if (driverId) this.driverId = new UUID(driverId);  
		this.from = new Coord(fromLat, fromLong);
		this.to = new Coord(toLat, toLong);
		this.status = RideStatusFactory.create(status, this);
		this.date = date;
		if (this.getStatus() === "in_progress") this.positionId = new UUID(positionId?);  

	}

	static create (passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
		const uuid = UUID.create();
		const status = "requested";
		const date = new Date();
		return new Ride(uuid.getValue(), passengerId, fromLat, fromLong, toLat, toLong, status, date);
	}

	getRideId () {
		return this.rideId.getValue();
	}

	getPassengerId () {
		return this.passengerId.getValue();
	}

	getFrom () {
		return this.from;
	}

	getTo () {
		return this.to;
	}

	accept (driverId: string) {
		this.status.accept();
		this.setDriverId(driverId);
	}

	start () {
		this.status.start();
	}

	setStatus (status: RideStatus) {
		this.status = status;
	}

	setDriverId(driverId: string) {
		this.driverId = new UUID(driverId);
	}
	getDriverId() {
		return this.driverId?.getValue();
	}
	getStatus () {
		return this.status.value;
	}

	getDate () {
		return this.date;
	}

}

export enum StatusEnum {
	IN_PROGRESS = "in_progress",
	REQUESTED = "requested",
	ACCEPTED = "accepted"

}

export class RideStatusFactory {
	static create (status: string, ride: Ride) {
		if (status === "requested") return new RequestedStatus(ride);
		if (status === "accepted") return new AcceptedStatus(ride);
		if (status === "in_progress") return new InProgressStatus(ride);
		throw new Error("Invalid status");
		


	}
}