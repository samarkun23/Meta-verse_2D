import { Router } from "express"
import { userRouter } from "./user.js";
import { spaceRouter } from "./space.js";
import { adminRouter } from "./admin.js";
import { SignUpSchema } from "src/types/index.js";
import client from "@repo/db"

export const router = Router();

router.post("/signup", async (req,res) => {
    //check the user 
    const parseData = SignUpSchema.safeParse(req.body);
    if(!parseData.success){
        return res.status(400).json({message: "SignUp parse failed"})
    }

    try {
        const user = await client.user.create({
            data:{
                usename: parseData.data.username,
                password: parseData.data.password,
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

router.post("/signin", (req,res) => {
    
    res.json({
        message: "signin"
    })
})

router.get("/elements", (req,res) => {})

router.get("/avatars", (req,res) => {})

router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)