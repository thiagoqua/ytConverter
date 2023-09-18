import express from "express";
import { downloadRouter } from "./routes/download.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 8080;

// for production only. REMOVE IT in local
const corsOptions = {
  origin:'https://youtconverter.netlify.app/',
  optionsSuccessStatus:200
}

app.use(cors(corsOptions));
app.use('/download',downloadRouter);

app.listen(PORT,() => {
  console.log(`server started on http://localhost:${PORT}`);
});