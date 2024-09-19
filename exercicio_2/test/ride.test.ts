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
    requestRide = new RequestRide(rideDAO);
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
	const outputGetRide =  await new RideDAODatabase().getRide(outputRequestRideId);
	expect(outputRequestRideId).toBe(outputGetRide.ride_id);	
});

//TODO: Fazer casos de quebra, seguindo as regras de negocio.