import { Router, type Request, type Response } from "express";
import { Autherization } from "./Authorization/Autherization.js";
import { UserRouter } from "./UserRoutes/UserRouter.js";
import { SpaceRoute } from "./SpaceRoutes/SpaceRoute.js";
import { AdminRoute } from "./AdminRoutes/AdminRoute.js";

export const router = Router();

router.use("/authorization", Autherization);
router.use("/user", UserRouter);
router.use("/space", SpaceRoute);
router.use("/admin", AdminRoute);


router.get("/elements", (req: Request, res: Response) => {});
router.get("/avatars", (req: Request, res: Response) => {});
