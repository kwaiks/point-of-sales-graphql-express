import { Request, Response} from "express";
import jwt from "jsonwebtoken";

export const verifyToken =  async (
        req: Request, res: Response, next: Function) => {
    try {
        const token: string = req.headers["authorization"].split(" ")[1];
        req['user'] = jwt.verify(token, process.env.PRIVATE_KEY);
        return next();
    } catch(err) {
        req['user'] = null;
        return next();
    }  
};