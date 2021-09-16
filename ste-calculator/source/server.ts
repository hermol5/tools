import express, { Express } from 'express';
import { notFoundHandler } from './middleware/not-found.middleware';
import { errorHandler } from './middleware/error.middleware';
import { steRouter } from './endpoints/ste.router';

export const initServer = async (): Promise<Express> => {

    const router: Express = express();

    router.use(express.urlencoded({ extended: false }));
    router.use(express.json());

    router.use((req, res, next) => {
        // set the CORS policy
        res.header('Access-Control-Allow-Origin', '*');
        // set the CORS headers
        res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
        // set the CORS method headers
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
            return res.status(200).json({});
        }
        next();
    });

    router.use("/ste", steRouter);

    router.use(errorHandler);
    router.use(notFoundHandler);

    return router;
}