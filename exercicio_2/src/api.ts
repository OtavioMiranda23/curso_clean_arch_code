import express from "express";
import Signup from "./Signup";
import { AccountDAODatabase } from "./AccountDAO";
import GetAccount from "./GetAccount";
import cors from "cors";
import { MailerGatewayMemory } from "./MailerGateway";
import pgp from "pg-promise";
import { log } from "console";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async function (req, res) {
	const input = req.body;
	try {
		const accountDAO = new AccountDAODatabase();
		const mailerGateway = new MailerGatewayMemory();
		const signup = new Signup(accountDAO, mailerGateway);
		const output = await signup.execute(input);
		res.json(output);
	} catch (e: any) {
		res.status(422).json({ message: e.message });
	}
});

app.get("/accounts/:accountId", async function (req, res) {
	const accountDAO = new AccountDAODatabase();
	const getAccount = new GetAccount(accountDAO);
	const output = await getAccount.execute(req.params.accountId);
	res.json(output);
});



app.post("/race", async function (req, res) {
	let body = req.body; 
	const accountId: string = req.body.accountId;
	const accountDAO = new AccountDAODatabase();
	const getAccount = new GetAccount(accountDAO);
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {		
		const outputAccount = await getAccount.execute(accountId); 
		
		// deve verificar se o account_id tem is_passenger true;
		if (outputAccount && outputAccount.account_id && outputAccount.is_passenger) {
			// * deve verificar se já não existe uma corrida do passageiro em status diferente de "completed", se existir lançar um erro
			const [race] = await connection.query("select * from ccca.ride where passenger_id = $1 ", [outputAccount.account_id]);
			if (!race || race.status !== "completed") {
				// * deve gerar o ride_id (uuid)
				body.ride_id = crypto.randomUUID();
				// * deve definir o status como "requested"
				body.status = "requested";
				// * deve definir date com a data atual	
				body.date = new Date().toISOString()
				console.log(body.date)
				await connection.query("insert into ccca.ride (ride_id, status, date) values ($1, $2, $3)", 
					[body.ride_id, body.status, body.date]);

				res.json(body);
			} else {
				res.json(-2)
			}
		} else {
			res.json(-1)
		}
	} catch (error: any) {
		console.log(error);
	} 
	finally {
		await connection.$pool.end();
	}
})

app.get("/race/:rideId", async function (req, res) {
	const rideId = req.params.rideId;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [ride] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId])
	await connection.$pool.end();
	res.json(ride);
})

app.listen(3000);
