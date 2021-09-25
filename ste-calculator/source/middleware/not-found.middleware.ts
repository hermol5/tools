import { Request, Response, NextFunction } from "express";
import DefaultResponse from "../common/default.response";

export const notFoundHandler = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    
    const resp: DefaultResponse = {
        message: "404 - Not found",
        description: "Please provide valid address from Terra blockchain"
    }

    response
        .status(404)
        .json(resp);
};