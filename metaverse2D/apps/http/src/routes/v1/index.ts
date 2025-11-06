import { Router } from "express"
import { userRouter } from "./user.js";
import { spaceRouter } from "./space.js";
import { adminRouter } from "./admin.js";
import { SignInSchema, SignUpSchema } from "src/types/index.js";
import bcrypt from "bcrypt"
import client from "@repo/db"
import jwt from "jsonwebtoken"
import { config } from "src/config.js";

export const router = Router();

router.post("/signup", async (req,res) => {
    //check the user 
    const parseData = SignUpSchema.safeParse(req.body);
    if(!parseData.success){
        return res.status(400).json({message: "SignUp parse failed"})
    }

    const hashedPassword = await bcrypt.hash(parseData.data.password, 10);

    try {
        const user = await client.user.create({
            data:{
                username: parseData.data.username,
                password: hashedPassword,
                role: parseData.data.type === "admin" ? "Admin" : "User",
            }
        }) 
        res.json({
            userId: user.id
        })
    } catch (e) {
        res.status(400).json({message: "User already exists"})     
    }

})

router.post("/signin", async(req,res) => {
    const parseData = SignInSchema.safeParse(req.body);
    
    if(!parseData.success){
        return res.status(403).json({message: "Invalid Credentials"})
    }

    try {
        const user = await client.user.findUnique({
            where: {
                username: parseData.data.username
            }
        })

        if(!user){
            return res.status(403).json({messsage: "User not found"})
        }

        const validatePassword = await bcrypt.compare(parseData.data.password , user.password)
        if(!validatePassword){
            return res.status(403).json({message: "Invalid Password"});
        }

       const token = jwt.sign({
            userId: user.id,
            role: user.role
       }, config.jwtSecret , { expiresIn: "23h"});

        res.json({
            token ,
            message: "User signIn"
        })

    } catch (e) {
        res.status(500).json({
            message: "Error while SignIn" + e
        })
    }
})

router.get("/elements", (req,res) => {})

router.get("/avatars", (req,res) => {})

router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)