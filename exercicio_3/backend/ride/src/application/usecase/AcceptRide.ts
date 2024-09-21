import Account from "../../domain/Account";
import Ride from "../../domain/Ride";
import { inject, Registry } from "../../infra/di/DI";
import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
	@inject("rideRepository")
	rideRepository?: RideRepository;
	@inject("accountRepository")
	accountRepository?: AccountRepository;

	async execute (rideId: string, driverId: string ): Promise<void> {
		const signupAccount: Account | undefined = await this.accountRepository?.getAccountById(driverId);
		const outputRideById: Ride | undefined = await this.rideRepository?.getRideById(rideId);
		const outputRideByDriver: Ride | null| undefined = await this.rideRepository?.getRideByDriverId(driverId);		
		if (!signupAccount) throw new Error("Account not found");
		if (!signupAccount.isDriver) throw new Error("Account must be from a driver");
		if (outputRideById && outputRideById.getStatus() !== "requested") throw new Error("The ride is no longer open");
		if (outputRideByDriver && (outputRideByDriver.getStatus() === "accepted" || outputRideByDriver.getStatus() === "in_progress")) throw new Error("There is an unfinished ride");
		await this.rideRepository?.updateRide(rideId, driverId, "accepted");
    }
}