import express from "express";
import { router } from "./routes/v1/index.js";
import client from "@repo/db";

const app = express(); 

app.use("/api/v1", router)



const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
	console.log(`HTTP server listening on port ${PORT}`);
});
