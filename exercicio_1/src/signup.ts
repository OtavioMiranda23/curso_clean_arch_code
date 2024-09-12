import crypto from "crypto";
import express from "express";
import { validateCpf } from "./validateCpf";
import { isValidCarPlate, isValidEmail, isValidName } from "./utils/validators";
import AccountRepository from "./repository/accountRepository";
import { db } from "./db/db";

export const app = express();
app.use(express.json());

const repository = new AccountRepository(db);

app.get("/signup/:accountId", async function (req, res) {
	const account = await repository.getAccountById(req.params.accountId)
	if (!account) return res.status(401).json({ error: "Conta não encontrada"});
	res.status(200).json(account);
});

app.post("/signup", async function (req, res) {
	const input = req.body;
	try {
		const account = await repository.findAccountByEmail(input.email);
		if (account) return res.status(409).json({ message: "Account already exists" });
		if (!isValidName(input.name)) return res.status(400).json({ message: "Invalid name" });
		if (!isValidEmail(input.email)) return res.status(400).json({ message: "Invalid email" });
		if (!validateCpf(input.cpf)) return res.status(400).json({ message: "Invalid cpf" });
		if (!input.isDriver) {
			const id = crypto.randomUUID();
			await repository.createAccount(id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password)
			return res.json({ accountId: id });
		 }
		if (!isValidCarPlate(input.carPlate)) {
			return res.status(400).json({ message: "Invalid car plate" });
		 }
		const id = crypto.randomUUID();
		await repository.createAccount(id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password)
		res.json({ accountId: id });
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

app.listen(3000);