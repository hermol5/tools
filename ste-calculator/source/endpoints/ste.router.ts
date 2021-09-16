import express, { Request, Response } from "express";
import HttpException from "../common/http-exception";

export const steRouter = express.Router();

steRouter.get("/", async (req: Request, res: Response) => {
    try {
        res.status(200).send("OK");
    } catch (e) {
        res.status(500).send((e as HttpException).message);
    }
});