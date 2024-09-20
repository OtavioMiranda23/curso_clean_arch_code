import { AccountRepositoryDatabase, AccountRepositoryMemory } from "../src/infra/repository/AccountRepository";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { Registry } from "../src/infra/di/DI";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";
import Signup from "../src/application/usecase/Signup";
import RequestRide from "../src/application/usecase/RequestRide";
import UUID from "../src/domain/UUID";
import AcceptRide from "../src/application/usecase/AcceptRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

beforeEach(() => {
	Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
	Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
	Registry.getInstance().provide("rideRepository", new RideRepositoryDatabase());
	Registry.getInstance().provide("mailerGateway", new MailerGatewayMemory());
	signup = new Signup();
	getAccount = new GetAccount();
	requestRide = new RequestRide();
	getRide = new GetRide();
    acceptRide = new AcceptRide();
});

test("Deve aceitar uma corrida", async function () {    
    const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	
	const driverId = UUID.create().getValue();
	acceptRide.execute(outputGetRide.rideId, driverId);
	const outputGetRideById = await new RideRepositoryDatabase().getRideById(outputRequestRide.rideId);
	expect(outputGetRideById.getStatus()).toBe("accepted");

});

test("Não deve solicitar uma corrida se a conta não for de um passageiro", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		carPlate: "AAA9999",
		isDriver: true
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account must be from a passenger"));
	//TODO: Subir o docker
});

afterEach(async () => {
	const connection = Registry.getInstance().inject("databaseConnection");
	await connection.close();
});
