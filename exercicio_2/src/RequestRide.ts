import AccountDAO from "./AccountDAO";
import RideDAO, { Ride } from "./RideDAO";
import crypto from "crypto";

type RideRequest = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
}

export default class RequestRide {

	constructor (readonly rideDAO: RideDAO, readonly accountDAO: AccountDAO) {
	}

	async execute (ride: RideRequest) {
        const responseAccount = await this.accountDAO.getAccountById(ride.passengerId);       
        if (!responseAccount.is_passenger) throw new Error("The passenger is false");
        const responseRideByPassenger = await this.rideDAO.getRideByPassenger(ride.passengerId);
        if (responseRideByPassenger && responseRideByPassenger.status !== "completed") throw new Error("There is already a race with a status other than completed");
        const rideInput: Ride = {
            ride_id: crypto.randomUUID(),
            passenger_id: ride.passengerId,
            from_lat: ride.fromLat,
            from_long: ride.fromLong,
            to_lat: ride.toLat,
            to_long: ride.toLong,
            date: new Date().toISOString(),
            status: "requested"
        }   
        const rideId = await this.rideDAO.saveRide(rideInput);
		return rideId;
	}
}