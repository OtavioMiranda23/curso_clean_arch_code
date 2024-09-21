import { AccountRepositoryDatabase, AccountRepositoryMemory } from "../src/infra/repository/AccountRepository";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { Registry } from "../src/infra/di/DI";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";
import Signup from "../src/application/usecase/Signup";
import RequestRide from "../src/application/usecase/RequestRide";
import AcceptRide from "../src/application/usecase/AcceptRide";
import StartRide from "../src/application/usecase/StartRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

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
	startRide = new StartRide();
});

test("Deve iniciar uma corrida", async function () {    
    const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(inputSignupPassenger);
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
	const inputDriver = {
		name: "Adam Silver",
		email: `adam.silver${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isDriver: true,
		carPlate: "BRA2019"
	}
	const outputSignupDriver = await signup.execute(inputDriver);
	await acceptRide.execute(outputGetRide.rideId, outputSignupDriver.accountId);
	const outputGetRideById = await new RideRepositoryDatabase().getRideById(outputRequestRide.rideId);
	expect(outputGetRideById.getStatus()).toBe("accepted");

	const outputStartRide = new StartRide().execute(outputGetRide.rideId);
	expect(outputStartRide).toBeDefined();

	const outputGetStartRide = await new RideRepositoryDatabase().getRideById(outputGetRide.rideId);
	expect(outputGetStartRide.getStatus()).toBe("in_progress");
});
//Deve verificar se a corrida está em status "accepted", se não estiver lançar um erro
test("Deve falhar se tentar iniciar uma corrida que não foi aceita", async function () {    
    const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(inputSignupPassenger);
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
	const inputDriver = {
		name: "Adam Silver",
		email: `adam.silver${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isDriver: true,
		carPlate: "BRA2019"
	}

	const outputStartRide = await new StartRide().execute(outputRequestRide.rideId);
	await expect(async () => { outputStartRide }).rejects.toThrow(new Error("The ride was not accepted"));
});

afterEach(async () => {
	const connection = Registry.getInstance().inject("databaseConnection");
	await connection.close();
});
