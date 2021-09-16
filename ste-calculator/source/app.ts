import { initServer } from "./server";
import * as dotenv from "dotenv";

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string);
const MESSAGE: string = `STE calculator running on ${PORT}`;

initServer()
    .then(srv => {
        srv.listen(PORT, () => {
            console.log(`${MESSAGE}`);
        });
    })
    .catch(err => {
        console.log(`Error: ${err}`);
    });