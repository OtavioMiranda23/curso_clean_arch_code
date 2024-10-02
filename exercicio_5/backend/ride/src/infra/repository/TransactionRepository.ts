import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/DI";
import Ride from "../../domain/entity/Ride";
import Logger from "../logger/Logger";

export default interface TransactionRepository {
	saveTransaction (transaction: Transaction): Promise<void>;
	getRideById (transactionId: string): Promise<Transaction>;
}

export class TransactionRepositoryDatabase implements TransactionRepository {
	@inject("databaseConnection")
	connection?: DatabaseConnection;

	async saveTransaction (transaction: Transaction): Promise<void>;
		Logger.getInstance().debug("saveTransaction", transaction);
		await this.connection?.query("insert into ccca.transaction (transaction_id, ride_id, amount, date, status) values ($1, $2, $3, $4)", 
            [transaction.getTransactionId(), transaction.getRideId(), transaction.getAmount(), transaction.getDate().getStatus(),]);
	}

	async getRideById (transactionId: string): Promise<Transaction>;
		const [rideData] = await this.connection?.query("select * from ccca.ride where ride_id = $1", [rideId]);
		if (!rideData) throw new Error("Ride not found");
		const ride = new Ride(rideData.ride_id, rideData.passenger_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date, rideData.driver_id, parseFloat(rideData.distance), parseFloat(rideData.fare));
		Logger.getInstance().debug("getRideById", ride);
		return ride;
	}
}
