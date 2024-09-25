import Account from "../../domain/Account";
import Ride, { StatusEnum } from "../../domain/Ride";
import UUID from "../../domain/UUID";
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
		if (!signupAccount) throw new Error("Account not found");
		if (!signupAccount.isDriver) throw new Error("Account must be from a driver");
		const ride: Ride | undefined = await this.rideRepository?.getRideById(rideId);
		if (!ride) throw new Error("The ride not find");	
		ride.accept(driverId);
		await this.rideRepository?.updateRide(ride);
    }
}