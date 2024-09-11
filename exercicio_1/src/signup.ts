import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";
import { isValidCarPlate, isValidEmail, isValidName } from "./utils/validators";

export const app = express();
app.use(express.json());

app.get("/signup/:accountId", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [account] = await connection.query("select * from ccca.account where account_id = $1", req.params.accountId);
	if (!account) return res.status(401).json({ error: "Conta não encontrada"});
	await connection.$pool.end();
	res.status(200).json(account);
});

app.post("/signup", async function (req, res) {
	const input = req.body;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const [account] = await connection.query("select * from ccca.account where email = $1", [input.email]);
		if (account) {
			res.status(409).json({ message: "Account already exists" });
			return
		}
		if (!isValidName(input.name)) {
			res.status(400).json({ message: "Invalid name" });
			return
		}
		if (!isValidEmail(input.email)) {
			res.status(400).json({ message: "Invalid email" });
			return
		 }
		if (!validateCpf(input.cpf)) {
			res.status(400).json({ message: "Invalid cpf" });
			return
		 }
		if (!input.isDriver) {
			const id = crypto.randomUUID();
			await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
			res.json({ accountId: id });
			return
		 }
		if (!isValidCarPlate(input.carPlate)) {
			res.status(400).json({ message: "Invalid car plate" });
			return
		 }
		const id = crypto.randomUUID();
		await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
		res.json({ accountId: id });
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	} finally {		
		await connection.$pool.end();
	}
});

app.listen(3000);
