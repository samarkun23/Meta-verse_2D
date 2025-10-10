import { Router } from "express"
import { userRouter } from "./user.js";
import { spaceRouter } from "./space.js";
import { adminRouter } from "./admin.js";

export const router = Router();

router.post("/signup", (req,res) => {
    res.json({
        message: "signup"
    })
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