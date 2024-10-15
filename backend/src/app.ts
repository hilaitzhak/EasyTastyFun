import { AppServer } from "./service";

const main = async () => {
    const server = new AppServer();
    await server.init();
    server.listen();
}

main();