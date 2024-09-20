import { inject, Registry } from "../../infra/di/DI";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
	@inject("rideRepository")
	rideRepository?: RideRepository;

	async execute (ride_id: string, driver_id: string ): Promise<void> {
		await this.rideRepository?.updateRide(ride_id, driver_id);
    }
}