import pgp from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";

export default class AccountRepository {
    private connection: pgp.IDatabase<{}, pg.IClient>;

    constructor(address: string) {
        this.connection = pgp()(address); 
    }

    public async getAccountById(id: string) {
        return await this.connection.query("select * from ccca.account where account_id = $1", [id]);
    }

    public async findAccountByEmail(email: string) {
        return await this.connection.query("select * from ccca.account where email = $1", [email]);

    }

    public async createAccount(
        id: string, name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean, password: string
    ) {
        return await this.connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, name, email, cpf, carPlate, isPassenger, isDriver, password]);
    }

    public async closeConnection() {
        await this.connection.$pool.end()
    }
}