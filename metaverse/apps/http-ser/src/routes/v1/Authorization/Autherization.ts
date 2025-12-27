import { Router, type Request, type Response } from "express";
import { SignInSchema, SignUpSchema } from "../../../types/index.js";
import { prismaClient } from '@repo/db/client'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Autherization = Router();

Autherization.post("/signup", async (req: Request, res: Response) => {

    const parseData = SignUpSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({ message: "Validation failed" })
    }

    const existingUser = await prismaClient.user.findUnique({
        where: { username: parseData.data.username }
    });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(parseData.data.password, 10);

    try {
        const user = await prismaClient.user.create({
            data: {
                username: parseData.data.username,
                password: hashedPassword,
                role: parseData.data.type === "admin" ? "Admin" : "User"
            }
        })

        res.status(200).json({
            userId: user.id,
            message: "User created successfully"
        })

    } catch (error) {
        res.status(500).json({ message: "User creation failed", error })
        return;
    }

})

Autherization.post("/signin", async (req: Request, res: Response) => {
    const parseData = SignInSchema.safeParse(req.body);

    if (!parseData.success) {
        return res.status(400).json({ message: "Validation failed" })
    }

    // Sign-in logic to be implemented

    try {
        const user = await prismaClient.user.findUnique({
            where: {
                username: parseData.data.username
            }
        })

        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(parseData.data.password, (await user)?.password || "");

        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            {
                userId: user?.id,
            },
            process.env.JWT_SECRET || "defaultsecret",
            {
                expiresIn: "7D"
            }
        )

        return res.status(200).json({
            token: token,
            message: "User signed in successfully"
        })

    } catch (error) {
        res.status(500).json({ message: "User sign-in failed", error })
        return;
    }

})