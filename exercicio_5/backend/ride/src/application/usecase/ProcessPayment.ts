import Transaction from "../../domain/entity/Transaction";
import UUID from "../../domain/vo/UUID";
import { inject } from "../../infra/di/DI";
import TransactionRepository from "../../infra/repository/TransactionRepository";

export default class ProcessPayment {
	@inject("transactionRepository")
	transactionRepository!: TransactionRepository;

	async execute (input: Input): Promise<void> {
		console.log("processPayment", input);
		// chamar o Pagar.me ou o PagSeguro ou o ASAAS...
		const transaction = new Transaction(UUID.create().getValue(), input.rideId, input.amount, new Date(), "success") 
		this.transactionRepository.saveTransaction(transaction);
	} 
}

type Input = {
	rideId: string,
	amount: number
}
