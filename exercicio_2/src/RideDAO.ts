import pgp from "pg-promise";
export type Ride = { 
    ride_id: string,
	passenger_id: string,
	status: string,
	from_lat: number,
	from_long: number,
	to_lat: number,
	to_long: number,
	date: string
}

type RideSave = {
	ride_id: string,
	passenger_id: string,
	driver_id: string | null,
	status: string,
	fare: number | null,
	distance: number | null,
	from_lat: number,
	from_long: number,
	to_lat: number,
	to_long: number,
	date: string
}
// Port
export default interface RideDAO {
	getRideById (rideId: string): Promise<RideSave>;
	getRideByPassenger (passengerId: string): Promise<RideSave>;
	saveRide (account: Ride): Promise<string>;
	makeRequestedRide(rideID: string): Promise<void>
}

// Adapter
export class RideDAODatabase implements RideDAO {
	async makeRequestedRide(rideId: string): Promise<void> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("update ccca.ride set status = 'requested' where ride_id = $1", [rideId]);
		await connection.$pool.end();
	}
	async saveRide (account: Ride): Promise<string> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [ride] = await connection.query(
			"insert into ccca.ride (ride_id, passenger_id, status,from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ride_id", 
			[
				account.ride_id, 
				account.passenger_id, 
				account.status,account.from_lat, 
				account.from_long, account.to_lat, 
				account.to_long, account.date                
			]);
		await connection.$pool.end();
		return ride.ride_id;			
	}
	async getRideById (rideId: string): Promise<RideSave> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [rideData] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
		return rideData;
	}
	async getRideByPassenger(passengerId: string): Promise<RideSave> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [rideData] = await connection.query("select * from ccca.ride where passenger_id = $1", [passengerId]);
		await connection.$pool.end();
		return rideData;
	}
}
