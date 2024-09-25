import { inject } from "../../infra/di/DI";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class FinishRide {
	@inject("rideRepository")
	rideRepository?: RideRepository;

    @inject("positionRepository")
	positionRepository?: PositionRepository;


	async execute (input: Input): Promise<void> {
		const ride = await this.rideRepository?.getRideById(input.rideId);
		if (!ride) throw new Error();
		ride.finish();
        const positions = await this.positionRepository?.getPositionsByRideId(input.rideId);
		const distance = ride.getDistance(positions || []);
        ride.setFare(distance);       
		await this.rideRepository?.updateRide(ride);
	}
}

type Input = {
	rideId: string
}
