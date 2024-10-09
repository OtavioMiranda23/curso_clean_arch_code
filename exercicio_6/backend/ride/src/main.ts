import { Registry } from "./infra/di/DI";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";

const httpServer = new ExpressAdapter();
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
httpServer.listen(3000);