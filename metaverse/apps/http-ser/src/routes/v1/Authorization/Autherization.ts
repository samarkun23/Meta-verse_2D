import { Router, type Request, type Response } from "express";
import { SignUpSchema } from "../../../types/index.js";
import { prisma } from "@repo/db/client"
import bcrypt from "bcryptjs";

export const Autherization = Router();

Autherization.post("/signup", async(req: Request,res: Response) => {
    const parseData = SignUpSchema.safeParse(req.body);
    if(!parseData.success){
        return res.json({message: "Validation failed"})
    }

    const hashedPassword = await bcrypt.hash(parseData.data.password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                username: parseData.data.email,
                email: parseData.data.email,
                password: hashedPassword,
                role: parseData.data.type === "admin" ? "ADMIN" : "USER"
            }
        })

        res.json({
            userId: user.id,
            message: "User created successfully"
        })

    } catch (error) {
        res.status(500).json({message: "User creation failed", error})
        return;
    } 

})

Autherization.post("/signin", (req: Request, res: Response) => {
    
})