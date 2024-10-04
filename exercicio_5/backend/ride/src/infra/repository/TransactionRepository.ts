import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/DI";
import Ride from "../../domain/entity/Ride";
import Logger from "../logger/Logger";
import Transaction from "../../domain/entity/Transaction";

export default interface TransactionRepository {
	saveTransaction (transaction: Transaction): Promise<void>;
	getRideById (transactionId: string): Promise<Transaction>;
}

export class TransactionRepositoryDatabase implements TransactionRepository {
	@inject("databaseConnection")
	connection?: DatabaseConnection;

	async saveTransaction (transaction: Transaction): Promise<void> {
		Logger.getInstance().debug("saveTransaction", transaction);
		await this.connection?.query("insert into ccca.transaction (transaction_id, ride_id, amount, date, status) values ($1, $2, $3, $4)", 
            [transaction.getTransactionId(), transaction.getRideId(), transaction.getAmount(), transaction.getDate(), transaction.getStatus()]);
	}

	async getRideById (transactionId: string): Promise<Transaction> {
		const [transactionData] = await this.connection?.query("select * from ccca.ride where ride_id = $1", [transactionId]);
		if (!transactionData) throw new Error("Ride not found");
		return new Transaction(transactionData.transaction_id, transactionData.ride_id, parseFloat(transactionData.amount), transactionData.date, transactionData.status);
	}
}
