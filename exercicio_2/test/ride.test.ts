import { AccountDAODatabase, AccountDAOMemory } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
import { MailerGatewayMemory } from "../src/MailerGateway";
import RequestRide from "../src/RequestRide";
import { RideDAODatabase } from "../src/RideDAO";
import Signup from "../src/Signup";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;

beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	const mailerGateway = new MailerGatewayMemory();
	const rideDAO = new RideDAODatabase();
	signup = new Signup(accountDAO, mailerGateway);
	getAccount = new GetAccount(accountDAO);
    requestRide = new RequestRide(rideDAO, accountDAO);
});

test("Deve solicitar uma corrida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
    const inputRide = {
        passengerId: outputSignup.accountId,
        fromLat: -80.7838,
        fromLong: -150.2264,
        toLat: -90.7964,
        toLong: -160.2255,
    }
    const outputRequestRideId: string = await requestRide.execute(inputRide);
	expect(outputRequestRideId).toBeDefined();
	const outputGetRide =  await new RideDAODatabase().getRideById(outputRequestRideId);
	expect(outputRequestRideId).toBe(outputGetRide.ride_id);	
});

test("falha ao criar passenger false", async () => {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: false
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
    const inputRide = {
        passengerId: outputSignup.accountId,
        fromLat: -80.7838,
        fromLong: -150.2264,
        toLat: -90.7964,
        toLong: -160.2255,
    }
	await expect(()=> requestRide.execute(inputRide)).rejects.toThrow(new Error ("The passenger is false"));
})

test("falha ao criar corrida com o status diferente de completed", async () => {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
    const inputRide = {
        passengerId: outputSignup.accountId,
        fromLat: -80.7838,
        fromLong: -150.2264,
        toLat: -90.7964,
        toLong: -160.2255,
    }
	const responseRide: string = await requestRide.execute(inputRide);
	await new RideDAODatabase().makeRequestedRide(responseRide);
	await expect(() => requestRide.execute(inputRide)).rejects.toThrow(new Error ("There is already a race with a status other than completed"));
})