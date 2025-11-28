import { Router, type Request, type Response } from "express";

export const SpaceRoute = Router();

SpaceRoute.post("/", (req: Request , res: Response) => {

})

SpaceRoute.delete("/:spaceId", (req:Request, res: Response) => {

})

SpaceRoute.get("/all", (req: Request, res: Response) => {

})

SpaceRoute.post("/element", (req: Request, res: Response) => {

})

SpaceRoute.delete("/element", (req: Request, res: Response) => {

})

SpaceRoute.get("/:spaceId", (req: Request, res: Response) => {

})