import { inject } from "../../infra/di/DI";
import RideRepository from "../../infra/repository/RideRepository";

export default class FinishRide {
	@inject("rideRepository")
	rideRepository?: RideRepository;

	async execute (input: Input): Promise<void> {
		const ride = await this.rideRepository?.getRideById(input.rideId);
		if (!ride) throw new Error();
		ride.finish();
		await this.rideRepository?.updateRide(ride);
	}
}

type Input = {
	rideId: string
}
