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
		accountId: "486eb6d9-8c29-40bb-960d-f724071acb84"
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
test("Tenta criar nova corrida com uma já em andamento",  async function () {
	const input = { 
		accountId: "109cabbb-11c5-4b6e-9659-d494539ba449"
	};
	const responseRace = await axios.post("http://localhost:3000/race", input);	
	const outputRace = responseRace.data;
	expect(outputRace).toBe(-2);
})
test("Passageiro com id invalido",  async function () {
	const input = { 
		accountId: "a8698393-646a-4f22-a1eb-6388d0cebe75"
	};
	const responseRace = await axios.post("http://localhost:3000/race", input);	
	const outputRace = responseRace.data;
	expect(outputRace).toBe(-1);
})

// test("Finaliza corrida do passageiro", async function () {
// 	const rideId = "08698393-646a-4f22-a1eb-6388d0cebe75";
// 	await axios.put(`http://localhost:3000/race/${rideId}`);
// 	const responseRaceGet = await axios.get(`http://localhost:3000/race/${rideId}`);
// 	const outputRaceGet = responseRaceGet.data;
// 	expect(outputRaceGet.status).toBe("completed");
// })
