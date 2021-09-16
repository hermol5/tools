import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
    request: Request,
    response: Response,
    next: NextFunction
) => {

    const message = "404 - Not found";

    response
        .type('text/json')
        .status(404)
        .send(message);
};