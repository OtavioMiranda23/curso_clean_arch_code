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
		accountId: "3fb47e21-9b70-4d82-b4ca-31c61dc6f61d"
	};
	const responseRace = await axios.post("http://localhost:3000/race", input);
	const outputRace = responseRace.data;
	const responseRaceById = await axios.get(`http://localhost:3000/race/${outputRace.ride_id}`);
	const outputRaceById = responseRaceById.data;	
	expect(outputRace.ride_id).toBe(outputRaceById.ride_id);
	expect(outputRace.status).toBe(outputRaceById.status);
	const date1 = new Date(outputRace.date).getTime();
	const date2 = new Date(outputRaceById.date).getTime();
	
	expect(date1).toBeCloseTo(date2, -10800000);
})

test("Passageiro com id invalido",  async function () {
	const input = { 
		accountId: "3fb47e21-9b70-4d82-b4ca-31c61dc6f11d"
	};
	const responseRace = await axios.post("http://localhost:3000/race", input);	
	const outputRace = responseRace.data;
	expect(outputRace).toBe(-1);
})
