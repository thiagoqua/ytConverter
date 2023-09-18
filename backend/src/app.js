import express from "express";
import { downloadRouter } from "./routes/download.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(cors());
app.use('/download',downloadRouter);

app.listen(PORT,() => {
  console.log(`server started on http://localhost:${PORT}`);
});