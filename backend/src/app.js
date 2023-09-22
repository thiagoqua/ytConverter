import express from "express";
import { downloadRouter } from "./routes/download.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(cors({
  origin:(origin,callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:4200',
      'https://youtconverter.netlify.app',
      'https://youtconverter.netlify.app/'
    ]

    if(ACCEPTED_ORIGINS.includes(origin))
      return callback(null,true);

    return callback(new Error('NOT ALLOWED BY CORS'));
  },
  exposedHeaders: "Content-Disposition"
}));
app.use('/download',downloadRouter);

app.listen(PORT,() => {
  console.log(`server started on http://localhost:${PORT}`);
});