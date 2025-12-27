import express from 'express'
import { router } from './routes/v1/index.js';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/api/v1", router)


app.listen(PORT , () => console.log(`Server listening on PORT : ${PORT}`))