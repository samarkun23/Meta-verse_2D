import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

declare global {
    namespace Express {
        interface Request {
            role?: "Admin" | "User";
            userId?: string
        }
    }
}

export const userAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]
    const token = header?.split(" ")[1]
    const JWT_SECRET = process.env.JWT_SECRET

    if(!token){
        return res.status(401).json({message: "Token invalid"})
    }
     
    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as { role: string, userId: string }
        req.userId = decoded.userId
        next()
    } catch (error) {
        res.status(401).json({message: "Unauthorized"})    
        return
    }
}