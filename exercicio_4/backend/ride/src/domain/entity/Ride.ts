import Position from "./Position";
import DistanceCalculator from "../service/DistanceCalculator";
import Coord from "../vo/Coord";
import RideStatus, { RequestedStatus, RideStatusFactory } from "../vo/RideStatus";
import UUID from "../vo/UUID";

// Entity
export default class Ride {
	private rideId: UUID;
	private passengerId: UUID;
	private driverId?: UUID;
	private from: Coord;
	private to: Coord;
	private status: RideStatus;
	private date: Date;
	private fare: number;

	constructor (rideId: string, 
		passengerId: string, 
		fromLat: number, 
		fromLong: number, 
		toLat: number, 
		toLong: number, 
		status: string, 
		date: Date, 
		driverId: string = "",
		fare: number = 0
	) {
		this.rideId = new UUID(rideId);
		this.passengerId = new UUID(passengerId);
		if (driverId) this.driverId = new UUID(driverId);
		this.from = new Coord(fromLat, fromLong);
		this.to = new Coord(toLat, toLong);
		this.status = RideStatusFactory.create(status, this);
		this.date = date;
		this.fare = fare;
	}

	static create (passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
		const uuid = UUID.create();
		const status = "requested";
		const date = new Date();
		return new Ride(uuid.getValue(), passengerId, fromLat, fromLong, toLat, toLong, status, date, "", 0);
	}

	getRideId () {
		return this.rideId.getValue();
	}

	getPassengerId () {
		return this.passengerId.getValue();
	}

	getDriverId () {
		return this.driverId?.getValue();
	}

	getFrom () {
		return this.from;
	}

	getTo () {
		return this.to;
	}

	getStatus () {
		return this.status.value;
	}

	setStatus (status: RideStatus) {
		this.status = status;
	}

	accept (driverId: string) {
		this.status.accept();
		this.driverId = new UUID(driverId);
	}

	start () {
		this.status.start();
	}
	
	finish () {
		this.status.finish();
	}

	success () {
		this.status.success();
	}

	getDistance (positions: Position[]) {
		let distance = 0;
		for (const [index, position] of positions.entries()) {
			const nextPosition = positions[index + 1];
			if (!nextPosition) continue;
			distance += DistanceCalculator.calculate(position.coord, nextPosition.coord);
		}
		return distance;
	}

	getDate () {
		return this.date;
	}

	setFare(distance: number) {
		this.fare = distance * 2.1
	}

	getFare() {
		return this.fare;
	}

}
