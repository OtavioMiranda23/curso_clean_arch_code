import { inject } from "../../infra/di/DI";
import PaymentGateway, { PaymentGatewayMemory } from "../../infra/gateway/PaymentGateway";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class FinishRide {
	@inject("rideRepository")
	rideRepository?: RideRepository;

    @inject("paymentGateway")
	paymentGatewayMemory?: PaymentGateway;


	async execute (input: Input): Promise<void> {
		const ride = await this.rideRepository?.getRideById(input.rideId);
		if (!ride) throw new Error();
        if (ride.getStatus() !== "completed") throw new Error("Invalid status");
        const isValideDataPayment = this.paymentGatewayMemory?.isValide(input.creditCardToken, input.amount);
        if (!isValideDataPayment) throw new Error("Invalid payments data");
        const isApprovedPayment = this.paymentGatewayMemory?.isApproved()
        if (!isApprovedPayment) throw new Error("Invalid payment");
		ride.success();
        await this.rideRepository?.updateRide(ride);       
    }
}

type Input = {
	rideId: string,
    creditCardToken: string
    amount: number
}