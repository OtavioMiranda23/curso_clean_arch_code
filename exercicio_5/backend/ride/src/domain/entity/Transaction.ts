
import Password, { PasswordFactory } from "../vo/Password";
import UUID from "../vo/UUID";

export default class Transaction {
	private transactionId: UUID;
	private rideId: UUID;
	private amount: number;
	private date: Date;
	private status: string;

	constructor (transactionId: string, rideId: string, amount: number, date: Date, status: string) {
		this.transactionId = new UUID(transactionId);
		this.rideId = new UUID(rideId);
		this.amount = amount;
		this.date = date;
        this.status = status;
	}

	// static factory method
	static create (rideId: string,amount: number, date: Date, status: string) {
		const transactionId = UUID.create();
		return new Transaction(transactionId.getValue(), rideId, amount, date, status);
	}

	getTransactionId () {
		return this.transactionId.getValue();
	}

	getRideId () {
		return this.rideId.getValue();
	}

	getAmount () {
		return this.amount;
	}

	getDate () {
		return this.date;
	}

	getStatus () {
		return this.status;
	}
}
