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

	async execute (rideId: string): Promise<void> {
        const rideById: Ride | undefined = await this.rideRepository?.getRideById(rideId);
        if(!rideById || (rideById && rideById.getStatus() !== "accepted")) throw new Error("The ride was not accepted");
        await this.rideRepository?.updateRideStatus(rideId, "in_progress")
    }
}