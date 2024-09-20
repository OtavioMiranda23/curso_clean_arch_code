import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve criar a conta de um passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	const outputSignup = responseSignup.data;
	expect(outputSignup.accountId).toBeDefined();
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
	const outputGetAccount = responseGetAccount.data;
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.password).toBe(input.password);
	expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});

test("Não deve criar a conta de um passageiro com nome inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(422);
	const outputSignup = responseSignup.data;
	expect(outputSignup.message).toBe("Invalid name");
});

test("Deve criar uma nova corrida",  async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	const outputSignup = responseSignup.data;
	expect(outputSignup.accountId).toBeDefined();	
	const inputRide = {
        passengerId: outputSignup.accountId,
        fromLat: -80.7838,
        fromLong: -150.2264,
        toLat: -90.7964,
        toLong: -160.2255,
	};
	const responseRide = await axios.post("http://localhost:3000/ride", inputRide);
	expect(responseRide.status).toBe(200);
})
test("Não deve criar uma nova corrida",  async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		password: "123456",
		isPassenger: false
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	const outputSignup = responseSignup.data;
	expect(outputSignup.accountId).toBeDefined();
	console.log({responseSignup});
		
	const inputRide = {
        passengerId: outputSignup.accountId,
        fromLat: -80.7838,
        fromLong: -150.2264,
        toLat: -90.7964,
        toLong: -160.2255,
	};
	const responseRide = await axios.post("http://localhost:3000/ride", inputRide);
	expect(responseRide.status).toBe(500);
})