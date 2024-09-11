import pgp from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";

export default class AccountRepository {
    private connection: pgp.IDatabase<{}, pg.IClient>;

    constructor(db: string) {
        this.connection = pgp()(db); 
    }

    public async getAccountById(id: string) {
        const [account] = await this.connection.query("select * from ccca.account where account_id = $1", [id]);
        return account;
    }

    public async findAccountByEmail(email: string) {
        const [account] = await this.connection.query("select * from ccca.account where email = $1", [email]);
        return account;
    }

    public async createAccount(
        id: string, name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean, password: string
    ) {
        const [account] = await this.connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, name, email, cpf, carPlate, isPassenger, isDriver, password]);
        return account;
    }

    public async closeConnection() {
        await this.connection.$pool.end()
    }
}