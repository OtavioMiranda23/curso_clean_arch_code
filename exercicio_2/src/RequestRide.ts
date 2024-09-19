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

	constructor (readonly rideDAO: RideDAO) {
	}

	async execute (ride: RideRequest) {
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
        // deve verificar se o account_id tem is_passenger true
        // deve verificar se já não existe uma corrida do passageiro em status diferente de "completed", se existir lançar um erro
        // deve gerar o ride_id (uuid)
        // deve definir o status como "requested"
        // deve definir date com a data atual
		return rideId;
	}
}