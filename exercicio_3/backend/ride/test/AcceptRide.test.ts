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

test("Motorista deve aceitar uma corrida", async function () {    
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
	expect(outputGetRideById.getDriverId()).toBe(outputSignupDriver.accountId);
});
test("Não deve aceitar uma corrida com is_driver false", async function () {    
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
		isDriver: false,
	}
	const outputSignupDriver = await signup.execute(inputDriver);
	await expect( async () =>  { 
		await acceptRide.execute(outputGetRide.rideId, outputSignupDriver.accountId)
	 } ).rejects.toThrow(new Error("Account must be from a driver"));
});
test("Não deve aceitar uma corrida com status diferente de 'requested'", async function () {    
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
	const inputSecondDriver = {
		name: "Adam Gold",
		email: `adam.gold${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isDriver: true,
		carPlate: "BRA2020"
	}
	const outputSignupSecondDriver = await signup.execute(inputSecondDriver);
	await expect( async () =>  { 
		await  acceptRide.execute(outputGetRide.rideId, outputSignupSecondDriver.accountId)
	 } ).rejects.toThrow(new Error("Invalid status"));
});

//deve verificar se o motorista já tem outra corrida com status "accepted" ou "in_progress", se tiver lançar um erro
test("O motorista não deve aceitar uma corrida com outra em movimento", async function () {    
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
	const outputSignupDriver:{ accountId: string; } = await signup.execute(inputDriver);
	await acceptRide.execute(outputGetRide.rideId, outputSignupDriver.accountId);
	const outputGetRideById = await new RideRepositoryDatabase().getRideById(outputRequestRide.rideId);
	expect(outputGetRideById.getStatus()).toBe("accepted");
	const inputSignupSecondPassenger = {
		name: "John Doe Second",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignupSecondPassenger = await signup.execute(inputSignupSecondPassenger);
	const inputRequestSecondRide = {
		passengerId: outputSignupSecondPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestSecondRide = await requestRide.execute(inputRequestSecondRide);
	expect(outputRequestSecondRide.rideId).toBeDefined();
	await expect( async () =>  { 
		await acceptRide.execute(outputRequestRide.rideId, outputSignupDriver.accountId)
	 } ).rejects.toThrow(new Error("Invalid status"));
});
afterEach(async () => {
	const connection = Registry.getInstance().inject("databaseConnection");
	await connection.close();
});
